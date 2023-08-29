/**
 * Employee Service
 * 
 * This service used for authentication
 * purpose only
 */

import { RowDataPacket } from "mysql2";
import { pool } from "./DatabaseService";

export default class EmployeeService {
    /**
     * Get Employee Session Data
     * 
     * @param userId string
     * @returns object
     */
    public static async getSessionData(userId: string) {
        try {
            const [[employee]] = await pool.query<RowDataPacket[]>(`SELECT c.company_name, e.name, e.customer_id 
            FROM employees e, customers c WHERE e.user_id = ? AND c.id = e.customer_id`, [userId]);
            return employee;
        } catch (error) {
            throw error;
        }
    }
}
