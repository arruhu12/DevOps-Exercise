/**
 * Employee Management Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { v4 as uuid } from 'uuid';
import { Employee } from "../models/Employee";
import bcrypt from "bcrypt";
import { User } from "../models/User";

export default class EmployeeManagementService {
  /**
   * Check username exists in same Customer ID
   * 
   * @param customerId number
   * @param username string
   * @returns boolean
   */
  public static async checkUsernameExists(customerId: number, username: string) {
    try {
      const [[account]] = await db.query<RowDataPacket[]>(
        `SELECT u.username FROM users u 
        WHERE u.username = ?`, `u${customerId}-${username}`);
      return (account != null);
    } catch (err) {
      throw err;
    }
  }
  
  /**
   * Show employees List
   *
   * @param customerId number
   * @return object
   **/
  public static async getEmployees(customerId: number) {
    try {
      const [employees] = await db.query<RowDataPacket[]>(
        `SELECT e.id, e.name, e.phone_number, u.username, u.roles FROM employees e, users u
        WHERE u.id = e.user_id AND e.customer_id = ?`, [customerId]);
      return employees;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get Employee by Id
   * 
   * @param customerId number
   * @param employeeId string
   * @param isForUpdate boolean (default: false)
   * @returns object
   */
  public static async getEmployeeById(customerId: number, employeeId: string, isForUpdate: boolean = false) {
    try {
      let query;
      if (isForUpdate) {
        query = `SELECT e.id, e.user_id, e.name, e.phone_number, u.username, u.password, u.roles FROM employees e, users u
        WHERE u.id = e.user_id AND e.id = ? AND e.customer_id = ?`;
      }
      else {
        query = `SELECT e.id, e.user_id, e.name, e.phone_number, u.username, u.roles FROM employees e, users u
        WHERE u.id = e.user_id AND e.id = ? AND e.customer_id = ?`;
      }
      const [[employee]] = await db.query<RowDataPacket[]>(
        query, [employeeId, customerId]);
      return employee;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Store Employee
   * 
   * @param customerId number
   * @param body Any
   * @returns void
   */
  public static async storeEmployee(customerId: number, body: any) {
    try {
      const userId = uuid();
      const user: User = {
        id: userId,
        username: `u${customerId}-${body.username}`,
        email: '-',
        password: await bcrypt.hash(body.password, 10),
        phone_number: body.phoneNumber,
        is_active: true,
        roles: body.role
      }
      const employee: Employee = {
        id: uuid(),
        user_id: userId,
        customer_id: customerId,
        name: body.name,
        phone_number: body.phoneNumber
      }
      const connection = await db.getConnection();
      await connection.beginTransaction();
      await connection.query('INSERT INTO users SET ?', user);
      await connection.query('INSERT INTO employees SET ?', employee);
      await connection.commit();
    } catch (err) {
      throw err;
    }
  }

  /**
   * Update Employee
   * 
   * @param customerId number
   * @param employeeId string
   * @param currentEmployeeData object
   * @returns object
   */
  public static async updateEmployee(customerId: number, employeeId: string, currentEmployeeData: any, body: any) {
    try {
      const employee: Employee = {
        id: employeeId,
        user_id: currentEmployeeData.user_id,
        customer_id: customerId,
        name: (body.name === currentEmployeeData.name) ? currentEmployeeData.name : body.name,
        phone_number: (body.phoneNumber === currentEmployeeData.phone_number) ? currentEmployeeData.phone_number : body.phoneNumber
      }
      const user: User = {
        id: currentEmployeeData.user_id,
        username: (body.username === currentEmployeeData.username) ? currentEmployeeData.username : body.username,
        password: (!body.password) ? currentEmployeeData.password : await bcrypt.hash(body.password, 10),
        roles: (body.role === currentEmployeeData.role) ? currentEmployeeData.role : body.role
      }

      const connection = await db.getConnection();
      await connection.beginTransaction();
      await connection.query('UPDATE employees SET ? WHERE id = ?', [employee, employeeId]);
      await connection.query('UPDATE users SET ? WHERE id = ?', [user, currentEmployeeData.user_id]);
      await connection.commit();
    } catch (err) {
      throw err;
    }
  }

  /**
   * Drop Employee
   * 
   * @param customerId number
   * @param employeeId string
   * @returns void
   */
  public static async dropEmployee(customerId: number, employeeId: string) {
    try {
      const connection = await db.getConnection();
      await connection.beginTransaction();
      await connection.query('DELETE FROM Accounts WHERE employee_id = ?', [employeeId]);
      await connection.query('DELETE FROM employees WHERE id = ? AND customer_id = ?', [employeeId, customerId]);
      await connection.commit();
    } catch (err) {
      throw err;
    }
  }
}