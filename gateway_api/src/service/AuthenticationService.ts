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

config();

interface UserContext {
  user: {
    id: string;
    displayName: string;
    companyName: string;
  };
  roles: string[];
}

function createClaims(sub: string, aud: string, context: UserContext) {
  return {
    "iss": "bukusawit",
    "sub": sub,
    "iat": Math.floor(Date.now() / 1000),
    "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 24),
    "aud": aud,
    "context": context
  }
}

export default class AuthenticationService {

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
      const [user] = await pool.query<RowDataPacket[]>(`SELECT id, email, password, is_active FROM Users WHERE email = ?`, [email]);
      if (await bcrypt.compare(password, user[0].password) && user[0].is_active) {
        const [customer] = await pool.query<RowDataPacket[]>(`SELECT id, first_name, last_name, company_name FROM Customers WHERE user_id = ?`, [user[0].id]);
        const token = sign(
          createClaims(customer[0].first_name, "customer", {
            "user": {
              "id": customer[0].id,
              "displayName": customer[0].first_name + " " + customer[0].last_name,
              "companyName": customer[0].company_name
            },
            "roles": ["customer"]
          }),
          process.env.APP_KEY!
        );
        return token;
      }
      else if (!user[0].is_active) {
        throw new Error("CREDENTIAL_ACCOUNT_NOT_ACTIVE");
      }
      else {
        throw new Error("CREDENTIAL_PASSWORD_MISMATCH");
      }
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