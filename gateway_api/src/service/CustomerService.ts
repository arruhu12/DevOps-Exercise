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
     * @param customerId string
     * @param isSessionData boolean
     */
    public static async getCustomer(customerId: string) {
        try {
            const [result] = await pool.query<RowDataPacket[]>(`
                SELECT c.id, c.user_id, c.first_name, c.last_name, c.company_name, c.company_address, u.email, u.phone_number 
                FROM Customers c, Users u WHERE c.user_id = u.id AND c.id = ?`, [customerId]);
            return result[0];
        }
        catch (error) {
            throw error;
        }
    }

    public static async getCustomerSession(userId: string) {
        try {
            const [result] = await pool.query<RowDataPacket[]>(`
            SELECT id, first_name, last_name, company_name FROM Customers WHERE user_id = ?`, [userId]);
            return result[0];
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
            const [customer] = await pool.query<RowDataPacket[]>(`SELECT id FROM Customers WHERE user_id = ?`, [userId]);
            return customer[0].id;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Customers
     * 
     * This function gets all customers.
     * 
     * @param req Request
     * @param res Response
     */
    public static getCustomers(req: any, res: any) {
        res.status(200).send({
            message: "Customers retrieved successfully!"
        });
    }

    /**
     * Update Customer
     * 
     * This function updates a customer.
     * 
     * @param body: any
     * @param customerId: string
     */
    public static async updateCustomer(body: any, customerId: string) {
        try {
            const [[userId]] = await pool.query<RowDataPacket[]>("SELECT user_id FROM Customers WHERE id = ?", [customerId]);
            if (!userId) {
                throw new Error("Customer not found");
            }

            const user:User = {
                id: userId.user_id,
                email: body.email,
                phone_number: body.phoneNumber
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
            await connection.beginTransaction();
            await connection.query("UPDATE Users SET ? WHERE id = ?", [user, user.id]);
            await connection.query("UPDATE Customers SET ? WHERE id = ?", [customer, customer.id]);
            await connection.commit(); 
            return true;
        } catch (error) { 
            throw error;
        }
    }

}

export default CustomerService;