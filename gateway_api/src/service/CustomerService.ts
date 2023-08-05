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
     * @param req Request
     * @param res Response
     */
    public static getCustomer(req: any, res: any) {
        res.status(200).send({
            message: "Customer retrieved successfully!"
        });
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