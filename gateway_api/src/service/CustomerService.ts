/**
 * Customer Service
 * 
 * This file contains the customer service.
 */

import { RowDataPacket } from "mysql2";
import { pool } from "./DatabaseService";
import { User } from "../models/User";
import { Customer } from "../models/Customer";

class CustomerService {

    /**
     * Get Customer
     * 
     * This function gets a customer.
     * 
     * @param customerId number
     * @param isSessionData boolean
     */
    public static async getCustomer(customerId: number) {
        try {
            const [[result]] = await pool.query<RowDataPacket[]>(`
                SELECT c.id, c.user_id, c.first_name, c.last_name, c.company_name, c.company_address, u.email, u.phone_number 
                FROM customers c, users u WHERE c.user_id = u.id AND c.id = ?`, [customerId]);
            return result;
        }
        catch (error) {
            throw error;
        }
    }

    public static async getCustomerSession(userId: string) {
        try {
            const [[result]] = await pool.query<RowDataPacket[]>(`
            SELECT id, user_id, first_name, last_name, company_name FROM customers WHERE user_id = ?`, [userId]);
            return result;
        }
        catch (error) {
            throw error;
        }
    
    }

    /**
     * Get Customer Id
     * 
     * This function gets a customer id.
     * 
     * @param userId string
     * @return string
     */

    public static async getCustomerId(userId: string) {
        try {
            const [[customer]] = await pool.query<RowDataPacket[]>(`SELECT id FROM customers WHERE user_id = ?`, [userId]);
            return customer.id;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update Customer
     * 
     * This function updates a customer.
     * 
     * @param body: any
     * @param customerId: string
     */
    public static async updateCustomer(body: any, customerId: number) {
        try {
            const [[userId]] = await pool.query<RowDataPacket[]>("SELECT user_id FROM customers WHERE id = ?", [customerId]);
            if (!userId) {
                throw new Error("Customer not found");
            }

            const user:User = {
                id: userId.user_id,
                email: body.email,
                phone_number: body.phoneNumber,
                roles: 'customer'
            }

            const customer:Customer = {
                id: customerId,
                user_id: userId.user_id,
                first_name: body.firstName,
                last_name: body.lastName,
                company_name: body.companyName,
                company_address: body.companyAddress
            }

            const connection = await pool.getConnection();
            try {
                await connection.beginTransaction();
                await connection.query("UPDATE users SET ? WHERE id = ?", [user, user.id]);
                await connection.query("UPDATE customers SET ? WHERE id = ?", [customer, customer.id]);
                await connection.commit(); 
            } catch (transactionError) {
                await connection.rollback();
                throw transactionError;
            }
            return true;
        } catch (error) { 
            throw error;
        }
    }

}

export default CustomerService;