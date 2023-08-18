/**
 * Employee Management Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { v4 as uuid } from 'uuid';
import { Employee } from "../models/Employee";
import { Account } from "models/Account";
import bcrypt from "bcrypt";

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
        `SELECT e.id, e.customer_id, a.username FROM Employees e, Accounts a 
        WHERE e.id = a.employee_id AND a.username = ? AND e.customer_id = ?`, [`u${customerId}-${username}`, customerId]);
      return (account != null);
    } catch (err) {
      throw err;
    }
  }
  
  /**
   * Show Employees List
   *
   * @param customerId number
   * @return object
   **/
  public static async getEmployees(customerId: number) {
    try {
      const [employees] = await db.query<RowDataPacket[]>(
        `SELECT e.id, e.name, e.phone_number, a.username, a.role FROM Employees e, Accounts a
        WHERE e.id = a.employee_id AND e.customer_id = ?`, [customerId]);
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
        query = `SELECT e.id, e.name, e.phone_number, a.id AS account_id, a.username, a.password, a.role FROM Employees e, Accounts a
        WHERE e.id = a.employee_id AND e.id = ? AND e.customer_id = ?`;
      }
      else {
        query = `SELECT e.id, e.name, e.phone_number, a.username, a.role FROM Employees e, Accounts a
        WHERE e.id = a.employee_id AND e.id = ? AND e.customer_id = ?`;
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
      const employeeId = uuid();
      const employee: Employee = {
        id: employeeId,
        customer_id: customerId,
        name: body.name,
        phone_number: body.phoneNumber
      }
      const account: Account = {
        id: uuid(),
        employee_id: employeeId,
        username: `u${customerId}-${body.username}`,
        password: await bcrypt.hash(body.password, 10),
        role: body.role
      }
      const connection = await db.getConnection();
      await connection.beginTransaction();
      await connection.query('INSERT INTO Employees SET ?', employee);
      await connection.query('INSERT INTO Accounts SET ?', account);
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
        customer_id: customerId,
        name: (body.name === currentEmployeeData.name) ? currentEmployeeData.name : body.name,
        phone_number: (body.phoneNumber === currentEmployeeData.phone_number) ? currentEmployeeData.phone_number : body.phoneNumber
      }
      const account: Account = {
        id: currentEmployeeData.account_id,
        employee_id: employeeId,
        username: (body.username === currentEmployeeData.username) ? currentEmployeeData.username : body.username,
        password: (!body.password) ? currentEmployeeData.password : await bcrypt.hash(body.password, 10),
        role: (body.role === currentEmployeeData.role) ? currentEmployeeData.role : body.role
      }

      const connection = await db.getConnection();
      await connection.beginTransaction();
      await connection.query('UPDATE Employees SET ? WHERE id = ?', [employee, employeeId]);
      await connection.query('UPDATE Accounts SET ? WHERE id = ?', [account, currentEmployeeData.account_id]);
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
      await connection.query('DELETE FROM Employees WHERE id = ? AND customer_id = ?', [employeeId, customerId]);
      await connection.commit();
    } catch (err) {
      throw err;
    }
  }
}


/**
 * Delete Employee
 *
 * employeeId String 
 * returns APISuccessResponse
 **/
// exports.dropEmployee = function(employeeId) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "success" : true,
//   "message" : "message"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }


/**
 * Show Employees List
 *
 * returns inline_response_200_4
 **/
// exports.getEmployees = function() {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = "";
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }


/**
 *  Store employee data and create account for access system. <br> There are 2 role names: 'employee' and 'admin' 
 *
 * body Employees_store_body  (optional)
 * returns APISuccessResponse
 **/
// exports.storeEmployee = function(body) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "success" : true,
//   "message" : "message"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }


/**
 *
 * body Employees_update_body  (optional)
 * returns APISuccessResponse
 **/
// exports.updateEmployee = function(body) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "success" : true,
//   "message" : "message"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }

