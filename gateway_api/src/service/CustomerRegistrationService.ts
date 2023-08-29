import { pool } from "./DatabaseService";
import { RowDataPacket } from "mysql2";
import { User } from "models/User";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { Customer } from "models/Customer";
import RedisService from "./RedisService";
import AuthenticationService from "./AuthenticationService";

/**
 * Customer Registration Service
 */

export default class CustomerRegistrationService {
    /**
     * Generate Username
     * 
     * @param email String
     * @returns String
     */
    private static async generateUsername(email: string) {
        try {
            let username = email.split('@')[0];
            let result;
            let exists;
            do {
                result = username + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                exists = AuthenticationService.isExists(username)
            } while(!exists);
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Register a new account
     *
     * Register a new account with the given information
     * 
     * @param body any 
     * @returns void
     */
    public static async registerAccount (body: any) {
        try {
            const user: User = {
                id: uuid(),
                username: this.generateUsername(body.email),
                email: body.email,
                password: await bcrypt.hash(body.password, 10),
                phone_number: body.phoneNumber,
                is_active: false,
                roles: 'customer'
            }
    
            const customer: Customer = {
                user_id: user.id,
                first_name: body.firstName,
                last_name: body.lastName === undefined ? null : body.lastName,
                company_name: body.companyName,
                company_address: body.companyAddress
            };
            const connection = await pool.getConnection();
            await connection.beginTransaction();
            await connection.query(`INSERT INTO users SET ?;`, [user]);
            await connection.query(`INSERT INTO customers SET ?;`, [customer]);
            await connection.commit(); 
        } catch (error) {
            throw error;
        }
    }

    /**
     * Check User is active
     * 
     * @param email String
     * @returns Boolean
     */
    public static async checkUserActive (email: string) {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(`SELECT id FROM users WHERE email = ? AND is_active=1`, [email]);
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate Activation Token
     * 
     * Generate activation token for a registered email
     * 
     * @param email string 
     * @returns string
     */
    public static async generateActivationToken (email: string) {
        try {
            const [rows] = await pool.query<RowDataPacket[]>(`SELECT id FROM users WHERE email = ?`, [email]);
            // Generate token
            const token = crypto.randomBytes(20).toString('hex');
            RedisService.store('user-activation', token, {
                id: rows[0].id,
            }, 2 * 60 * 60);
            return token;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Activate an Account
     * 
     * Activate an account with the given activation token
     * 
     * @param token String 
     * @returns Promise<Boolean>
     */
    public static async activateAccount (token: string): Promise<Boolean> {
        try {
            const user = await RedisService.get('user-activation', token);
            if (!user) {
                return false;
            }
            const connection = await pool.getConnection();
            await connection.beginTransaction();
            await connection.query(`UPDATE users SET is_active = true WHERE id = ?;`, [user.id]);
            await connection.commit();
            return true;
        } catch (error) {
            throw error;
        }
    }
}