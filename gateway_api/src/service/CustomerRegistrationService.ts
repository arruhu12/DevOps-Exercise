import { pool } from "./DatabaseService";
import { RowDataPacket } from "mysql2";
import { User } from "models/User";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { Customer } from "models/Customer";
import RedisService from "./RedisService";

/**
 * Register a new account
 *
 * Register a new account with the given information
 * 
 * body any 
 * returns APISuccessResponse
 **/
export const registerAccount = async (body: any) => {
    try {
        const user: User = {
            id: uuid(),
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            phone_number: body.phoneNumber,
            is_active: false
        }

        const customer: Customer = {
            id: uuid(),
            user_id: user.id,
            first_name: body.firstName,
            last_name: body.lastName === undefined ? null : body.lastName,
            company_name: body.companyName,
            company_address: body.companyAddress
        };
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        await connection.query(`INSERT INTO Users SET ?;`, [user]);
        await connection.query(`INSERT INTO Customers SET ?;`, [customer]);
        await connection.commit(); 
    } catch (error) {
        throw error;
    }
}


/**
 * Check Exists User
 * 
 * Check if a user exists with the given email
 * 
 * email String
 * returns Boolean
 **/
export const checkEmail = async (email: string) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`SELECT id FROM Users WHERE email = ?`, [email]);
        return rows.length > 0;
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
export const checkUserActive = async (email: string) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`SELECT id FROM Users WHERE email = ? AND is_active=1`, [email]);
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
 * email String 
 * returns String
 */
export const generateActivationToken = async (email: string) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`SELECT id FROM Users WHERE email = ?`, [email]);
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
 * @returns APISuccessResponse
 */
export const activateAccount = async (token: string) => {
    try {
        const user = await RedisService.get('user-activation', token);
        if (user) {
            const connection = await pool.getConnection();
            await connection.beginTransaction();
            await connection.query(`UPDATE Users SET is_active = true WHERE id = ?;`, [user.id]);
            await connection.commit();
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
}