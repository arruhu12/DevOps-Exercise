/**
 * Authentication Controller
 * 
 * This file contains the authentication controller.
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AuthenticationService from "../service/AuthenticationService";
import { checkEmail } from "../service/CustomerRegistrationService";
import { errorResponse, successResponse } from "../utils/writer";
import CustomerService from "../service/CustomerService";

class AuthenticationController {

  /**
   * Login
   * 
   * This function logs in a customer.
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async login(req: Request, res: Response) {
    try {
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Check email exists
      const isExists = await checkEmail(req.body.email);
      if (!isExists) {
        return errorResponse(res, 400, "EMAIL_NOT_FOUND", "Email Not Found");
      }

      // Send body to Authentication Service and get token and customer id
      const [token, userId] = await AuthenticationService.login(req.body.email, req.body.password);
      const customerId = await CustomerService.getCustomerId(userId);
      const customerSessionData = await CustomerService.getCustomer(customerId, true);
      console.log(customerSessionData.first_name);
      
      return successResponse(res, 200, "Login Success", {
        "acessToken": token,
        "isNewAccount": false,
        "isSubscriptionActive": true,
        "customerId": customerId,
        "firstName": customerSessionData.first_name,
        "lastName": customerSessionData.last_name,
        "companyName": customerSessionData.company_name
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "CREDENTIAL_PASSWORD_MISMATCH") {
          return errorResponse(res, 400, "CREDENTIAL_PASSWORD_MISMATCH", "Credential Password Mismatch");
        }
        else if (error.message === "CREDENTIAL_ACCOUNT_NOT_ACTIVE") {
          return errorResponse(res, 400, "CREDENTIAL_ACCOUNT_NOT_ACTIVE", "User not verified.");
        }
      }
      return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
    }
  }

  /**
   * Logout
   * 
   * This function logs out a customer.
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  // public static async logout(req: Request, res: Response) {
  //   try {
  //     const response = await Authentication.logout();
  //     utils.writeJson(res, response);
  //   } catch (error) {
  //     utils.writeJson(res, error);
  //   }
  // }
}

export default AuthenticationController;