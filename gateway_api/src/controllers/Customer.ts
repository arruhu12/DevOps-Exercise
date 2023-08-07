/**
 * Customer Controller
 * 
 * This file contains the customer profile controller.
 */

import { Request, Response } from "express";
import CustomerService from "service/CustomerService";
import { errorResponse, successResponse } from "../utils/writer";

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
            // const customer = await CustomerService.getCustomer(customerId, false);
            // return successResponse(res, 200, "Account Information Fetched Successfully")
            return successResponse(res, 200, "Account Information Fetched Successfully");
        } catch (error) {
            return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
        }
    }
}

// module.exports.getAccountDetails = function getAccountDetails (req, res, next) {
//   ProfileAccountInformation.getAccountDetails()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.getAccountInfo = function getAccountInfo (req, res, next) {
//   ProfileAccountInformation.getAccountInfo()
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

// module.exports.updateAccountDetails = function updateAccountDetails (req, res, next, body) {
//   ProfileAccountInformation.updateAccountDetails(body)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };
