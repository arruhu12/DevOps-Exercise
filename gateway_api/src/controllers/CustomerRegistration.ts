import { Request, Response,  } from "express";
import { validationResult } from "express-validator";
import { errorResponse, successResponse } from "../utils/writer";
import { sendMail } from "../service/MailerService";
import UserRegistrationConfirm from "../mail/UserRegistrationConfirm";
import AuthenticationService from "../service/AuthenticationService";
import CustomerRegistrationService from "../service/CustomerRegistrationService";


/**
 * Activation Account Controller
 * 
 * Activate a customer account.
 * 
 * @param req Request
 * @param res Response
 * @returns Response
 */

export const customerActivation = async (req: Request, res: Response) => {
  try {
    // Get Validation Result and return error
    if (req.params.activationCode == null) {
      return errorResponse(res, 400, "ACTIVATION_CODE_REQUIRED", "Activation Code Required");
    }

    // Check activation code
    const result = await CustomerRegistrationService.activateAccount(req.params.activationCode);
    if (result) {
      return successResponse(res, 200, "Account Activated Successfully");
    }
    return errorResponse(res, 400, "ACTIVATION_LINK_INVALID", "Activation Link Was Invalid or Expired");
  } catch (error) {
    return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
  }
}

/**
 * Customer Registration
 * 
 * Register a new customer account.
 * 
 * @param req Request
 * @param res Response
 * @returns Response
 */
export const customerRegistration = async (req: Request, res: Response) => {
  try {
    // Get Validation Result and return error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
    }

    // Check email exists
    const isExists = await AuthenticationService.isExists(req.body.email);
    const isActive = await CustomerRegistrationService.checkUserActive(req.body.email);
    if (isExists && isActive) {
      return errorResponse(res, 400, "EMAIL_ALREADY_EXISTS", "Email Already Exists");
    }
    else if (!isExists) {
      // Send body to registration service
      await CustomerRegistrationService.registerAccount(req.body);
    }
    
    // Generate activation token and send mail
    const activationToken = await CustomerRegistrationService.generateActivationToken(req.body.email);
    sendMail(UserRegistrationConfirm(req.body.email, activationToken));
    
    return successResponse(res, 201, "Account Registered Successfully");
  } catch (error) {
    return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
  }
};
