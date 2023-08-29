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
import EmployeeService from "./EmployeeService";

config();

interface UserContext {
  user: {
    userId: string;
    customerId: string;
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
          userId: customer.user_id,
          customerId: customer.id,
          displayName: customer.first_name + " " + customer.last_name,
          companyName: customer.company_name
        },
        roles: ["customer"],
        isNewAccount: false,
        isSubscriptionActive: true
      }
    }
    else if (aud === "employee") {
      const employee = await EmployeeService.getSessionData(identification);
      sub = employee.name;
      context = {
        user: {
          userId: identification,
          customerId: employee.customer_id,
          displayName: employee.name,
          companyName: employee.company_name
        },
        roles: ["employee"],
        isSubscriptionActive: true
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
   * Validate email
   * 
   * @param email: string
   * @returns Boolean
   */
  private static validateEmail(email: string) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  /**
   * Check Exists User
   * 
   * Check if a user exists with the given email or username
   * 
   * @param identification string
   * @returns Boolean
   **/
  public static async isExists (identification: string) {
    try {
      let query;
      if (this.validateEmail(identification)) {
        query = `SELECT id FROM users WHERE email = ?`;
      }
      else {
        query = `SELECT id FROM users WHERE username = ?`;
      }
      const [rows] = await pool.query<RowDataPacket[]>(query, [identification]);
      return rows.length > 0;
    } catch (error) {
        throw error;
    }
  }

  /**
   * Customer Login
   *  
   * @param identification string
   * @param password string
   * @param authenticationType string
   * @returns [string, string]
   */
  public static async login(identification: string, password: string) {
    try {
      // Get user
      let user;
      
      if (this.validateEmail(identification)) {
        [[user]] = await pool.query<RowDataPacket[]>(`SELECT id, email, password, is_active, roles FROM users WHERE email = ?`, [identification]);
      }
      else {
        [[user]] = await pool.query<RowDataPacket[]>(`SELECT id, username, password, is_active, roles FROM users WHERE username = ?`, [identification]);
      }

      // Check user is not active or password missmatch
      if (!await bcrypt.compare(password, user.password)) {
        throw new Error("CREDENTIAL_PASSWORD_MISMATCH");
      }
      if (!user.is_active) {
        throw new Error("CREDENTIAL_ACCOUNT_NOT_ACTIVE");
      }

      // Sign the token
      const payload = await this.createClaims(user.id, user.roles);
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
      return payload;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Change Password
   * 
   * @param id string
   * @param currentPassword string
   * @param newPassword string
   */
  public static async changePassword(id: string, currentPassword: string, newPassword: string) {
    try {
      // Get User id
      const [customer] = await pool.query<RowDataPacket[]>(`SELECT user_id FROM customer WHERE id = ?`, [id]);
      if (!customer[0]) {
        throw new Error("CREDENTIAL_ACCOUNT_NOT_FOUND");
      }

      // Get user
      const [user] = await pool.query<RowDataPacket[]>(`SELECT id, password FROM users WHERE id = ?`, [customer[0].user_id]);

      // Check current password
      if (!await bcrypt.compare(currentPassword, user[0].password)) {
        throw new Error("CREDENTIAL_PASSWORD_MISMATCH");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, customer[0].user_id]);
    } catch (error) {
      throw error;
    }
  }
}