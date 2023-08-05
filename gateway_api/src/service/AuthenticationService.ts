/**
 * Authentication Service
 * 
 * This file contains the authentication service.
 */

import { RowDataPacket } from "mysql2";
import { pool } from "./DatabaseService";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { sign } from "jsonwebtoken";

config();

class AuthenticationService {

  /**
   * Login
   * 
   * This function logs in a customer.
   * 
   * @param email string
   * @param password string
   * @returns Response
   */
  public static async login(email: string, password: string) {
    try {
      const [user] = await pool.query<RowDataPacket[]>(`SELECT id, email, password, is_active FROM Users WHERE email = ?`, [email]);
      if (await bcrypt.compare(password, user[0].password) && user[0].is_active) {
        const token = sign(
          { id: user[0].id },
          process.env.APP_KEY!,
          {
            expiresIn: "1d"
          }
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
}

export default AuthenticationService;
