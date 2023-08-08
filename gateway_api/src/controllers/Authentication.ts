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
      let token;
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Check Email or Username exists
      if (!req.body.email && !req.body.username) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", {
          "email or username": "Email or Username is required",
        });
      } 

      // Customer Login
      if (req.body.email) {
        // Check email exists
        const isExists = await checkEmail(req.body.email);
        if (!isExists) {
          return errorResponse(res, 400, "EMAIL_NOT_FOUND", "Email Not Found");
        }
        // Generate Token      
        token = await AuthenticationService.customerLogin(req.body.email, req.body.password);
        
        // Return Response
        return successResponse(res, 200, "Login Success", {
          "acessToken": token
        });
      }
      // TODO: Employee Login
      // else if (req.body.username) {
      //   // Check username exists
      //   const isExists = await CustomerService.checkUsername(req.body.username);
      //   if (!isExists) {
      //     return errorResponse(res, 400, "USERNAME_NOT_FOUND", "Username Not Found");
      //   }
      // }
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

  /**
   * Change Password
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async changePassword(req: Request, res: Response) {
    try {
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Change Password
      const response = await AuthenticationService.changePassword(res.locals.user.user.id, req.body.currentPassword, req.body.newPassword);
      return successResponse(res, 200, "Password Changed Successfully", response);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "CREDENTIAL_PASSWORD_MISMATCH") {
          return errorResponse(res, 400, "CREDENTIAL_PASSWORD_MISMATCH", "Credential Password Mismatch");
        }
      }
      return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
    }
  }
}

export default AuthenticationController;