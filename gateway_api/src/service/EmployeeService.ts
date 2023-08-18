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
     * @param employeeId string
     * @returns object
     */
    public static async getSessionData(employeeId: string) {
        try {
            const [[employee]] = await pool.query<RowDataPacket[]>(`SELECT c.company_name, e.name, e.customer_id 
            FROM Employees e, Customers c WHERE e.id = ? AND c.id = e.customer_id`, [employeeId]);
            return employee;
        } catch (error) {
            throw error;
        }
    }
}
