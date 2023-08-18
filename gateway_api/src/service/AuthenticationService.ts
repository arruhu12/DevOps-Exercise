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
    employeeId?: string;
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
          employeeId: identification,
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
   * Customer Login
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
      const [customer] = await pool.query<RowDataPacket[]>(`SELECT user_id FROM Customers WHERE id = ?`, [id]);
      if (!customer[0]) {
        throw new Error("CREDENTIAL_ACCOUNT_NOT_FOUND");
      }

      // Get user
      const [user] = await pool.query<RowDataPacket[]>(`SELECT id, password FROM Users WHERE id = ?`, [customer[0].user_id]);

      // Check current password
      if (!await bcrypt.compare(currentPassword, user[0].password)) {
        throw new Error("CREDENTIAL_PASSWORD_MISMATCH");
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.query(`UPDATE Users SET password = ? WHERE id = ?`, [hashedPassword, customer[0].user_id]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check Username for Employee Login
   * 
   * @param username string
   * @returns boolean
   */
  public static async checkUsernameForEmployeeLogin(username: string) {
    try {
      const [[employee]] = await pool.query<RowDataPacket[]>(`SELECT id FROM Accounts WHERE username = ?`, [username]);
      return employee;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Employee Login
   * 
   * @param username string
   * @param password string
   * @returns string
   */
  public static async employeeLogin(username: string, password: string) {
    try {
      // Get user
      const [[user]] = await pool.query<RowDataPacket[]>(`SELECT id, employee_id, password FROM Accounts WHERE username = ?`, [username]);

      // Check user is not active or password missmatch
      if (!await bcrypt.compare(password, user.password)) {
        throw new Error("CREDENTIAL_PASSWORD_MISMATCH");
      }

      // Sign the token
      const payload = await this.createClaims(user.employee_id, "employee");
      const token = sign(
        payload,
        process.env.APP_KEY!
      );

      // Return token
      return token;
    } catch (error) {
      throw error;
    }
  }  
}