/**
 * Customer Service
 * 
 * This file contains the customer service.
 */

import { RowDataPacket } from "mysql2";
import { pool } from "./DatabaseService";

class CustomerService {

    /**
     * Get Customer
     * 
     * This function gets a customer.
     * 
     * @param customerId string
     * @param isSessionData boolean
     */
    public static async getCustomer(customerId: string, isSessionData = false) {
        try {
            let result;
            if (isSessionData) {
                [result] = await pool.query<RowDataPacket[]>(`SELECT first_name, last_name, company_name FROM Customers WHERE id = ?`, [customerId]);
            }
            else {
                [result] = await pool.query<RowDataPacket[]>(`
                SELECT id, user_id, first_name, last_name, company_name, company_address, u.email, u.phone_number 
                FROM Customers, Users u WHERE Customer.user_id = u.id AND id = ?`, [customerId]);
            }
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
     * @param req Request
     * @param res Response
     */
    public static updateCustomer(req: any, res: any) {
        res.status(200).send({
            message: "Customer updated successfully!"
        });
    }

}

export default CustomerService;