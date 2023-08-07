/**
 * Authentication Service
 * 
 * This file contains the authentication service.
 */

import { RowDataPacket } from "mysql2";
import { pool } from "./DatabaseService";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import CustomerService from "./CustomerService";

config();

interface UserContext {
  user: {
    id: string;
    displayName: string;
    companyName: string;
  };
  roles: string[];
  isNewAccount?: boolean;
  isSubscriptionActive?: boolean;
}

export default class AuthenticationService {

  /**
   * Create Token Claims Body
   * 
   * @param identification: string,
   * @param aud: string
   * @returns object
   */
  private static async createClaims(identification: string, aud: string) {
    let sub: string;
    let context: UserContext;

    if (aud === "customer") {
      const customer = await CustomerService.getCustomerSession(identification);
      sub = customer.first_name;
      context = {
        user: {
          id: customer.id,
          displayName: customer.first_name + " " + customer.last_name,
          companyName: customer.company_name
        },
        roles: ["admin"],
        isNewAccount: false,
        isSubscriptionActive: false
      }
    }
    else {
      sub = "";
    }
    return {
      "iss": "bukusawit",
      "sub": sub,
      "iat": Math.floor(Date.now() / 1000),
      "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 24),
      "aud": aud,
      "context": context!
    }
  }

  /**
   * Login
   * 
   * This function logs in a customer.
   * 
   * @param email string
   * @param password string
   * @param authenticationType string
   * @returns [string, string]
   */
  public static async customerLogin(email: string, password: string) {
    try {
      // Get user
      const [user] = await pool.query<RowDataPacket[]>(`SELECT id, email, password, is_active FROM Users WHERE email = ?`, [email]);

      // Check user is not active or password missmatch
      if (!await bcrypt.compare(password, user[0].password)) {
        throw new Error("CREDENTIAL_PASSWORD_MISMATCH");
      }
      if (!user[0].is_active) {
        throw new Error("CREDENTIAL_ACCOUNT_NOT_ACTIVE");
      }

      // Sign the token
      const payload = await this.createClaims(user[0].id, "customer");
      const token = sign(
        payload,
        process.env.APP_KEY!
      );

      // Return token and user context
      return token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Token Validation
   * 
   * This function validates a token.
   * 
   * @param token string
   * @returns UserContext
   */
  public static async tokenValidation(token: string) {
    try {
      const payload = verify(token, process.env.APP_KEY!) as JwtPayload;
      return payload.context;
    } catch (error) {
      throw error;
    }
  }
}