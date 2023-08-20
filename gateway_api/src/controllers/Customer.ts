/**
 * Customer Controller
 * 
 * This file contains the customer profile controller.
 */

import { Request, Response } from "express";
import CustomerService from "../service/CustomerService";
import { errorResponse, successResponse } from "../utils/writer";
import { validationResult } from "express-validator";
import UserContextService from "../service/UserContextService";

export default class CustomerController {
    
    /**
     * Get Customer
     * 
     * This function gets a customer.
     * 
     * @param customerId string
     * @param isSessionData boolean
     */
    public static async getProfile(req: Request, res: Response) {
        try {
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);
            const customer = await CustomerService.getCustomer(customerId);
            return successResponse(res, 200, "Account Information Fetched Successfully", customer);
        } catch (error) {
            return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
        }
    }

    /**
     * Update Customer
     * 
     * @param req: Request
     * @param res: Response
     * @return Response
     */
    public static async updateProfile(req: Request, res: Response) {
        try {
            // Get Validation Result and return error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
            }
            
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);
            await CustomerService.updateCustomer(req.body, customerId);
            return successResponse(res, 200, "Account Information Updated Successfully");
        } catch (error) {
            return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
        }
    }
}

