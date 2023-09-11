/**
 * Employee Management Controller
 */

import { Request, Response } from "express";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import EmployeeManagementService from "../service/EmployeeManagementService";
import { validationResult } from "express-validator";

export default class EmployeeManagementController {
    /**
     * Get Employees
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async all(req: Request, res: Response) {
        try {
            // Get Customer ID
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get employee
            const employees = await EmployeeManagementService.getEmployees(customerId);

            if (employees.length === 0) {
                return successResponse(res, 200, 'Employee List Empty', []);
            }

            // Return Employee
            return successResponse(res, 200, 'Employee Fetched Successfully', employees);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    } 
    
    /**
     * Get Employee By Id
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getById(req: Request, res: Response) {
        try {
            // Get Customer ID
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get employee
            const employee = await EmployeeManagementService.getEmployeeById(customerId, req.params.id);

            if (!employee) {
                return errorResponse(res, 404, 'NOT_FOUND', 'Employee Not Found');
            }

            // Return Employee
            return successResponse(res, 200, 'Employee Fetched Successfully', employee);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Store Employee
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async store(req: Request, res: Response) {
        try {
            // Get Validation Result and return error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
            }

            // Get Customer ID
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Check username exitst with same customer id
            if (await EmployeeManagementService.checkUsernameExists(customerId, req.body.username)) {
                return errorResponse(res, 400, 'USERNAME_EXITST', 'Username Exitst');
            }

            // Store Employee
            await EmployeeManagementService.storeEmployee(customerId, req.body);

            // Return Employee
            return successResponse(res, 201, 'Employee Stored Successfully');
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Update Employee
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async update(req: Request, res: Response) {
        try {
            // Get Validation Result and return error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
            }

            // Get Customer ID
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Check employee id exists
            const employee = await EmployeeManagementService.getEmployeeById(customerId, req.body.id, true);
            if (!employee) {
                return errorResponse(res, 404, 'NOT_FOUND', 'Employee Not Found');
            }

            // Check username exitst with same customer id
            if (employee.username != `u${customerId}-${req.body.username}`) {
                if (await EmployeeManagementService.checkUsernameExists(customerId, req.body.username)) {
                    return errorResponse(res, 400, 'USERNAME_EXITST', 'Username Exitst');
                }
            }

            // Update Employee
            await EmployeeManagementService.updateEmployee(customerId, req.body.id, employee, req.body);

            // Return Employee
            return successResponse(res, 200, 'Employee Updated Successfully');
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Drop Employee
     * 
     * @param req Request
     * @param res Response
     * @returns Responses
     */
    public static async drop(req: Request, res: Response) {
        try {
            // Get Customer ID
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Check employee id exists
            const employee = await EmployeeManagementService.getEmployeeById(customerId, req.params.id, true);
            if (!employee) {
                return errorResponse(res, 404, 'NOT_FOUND', 'Employee Not Found');
            }

            // Drop Employee
            await EmployeeManagementService.dropEmployee(customerId, req.params.id);

            // Return Employee
            return successResponse(res, 200, 'Employee Dropped Successfully');
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}