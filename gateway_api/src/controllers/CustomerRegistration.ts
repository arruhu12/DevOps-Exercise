import { Request, Response,  } from "express";
import { validationResult } from "express-validator";
import { errorResponse, successResponse } from "../utils/writer";
import { checkEmail, generateActivationToken, registerAccount } from "../service/CustomerRegistrationService";
import { sendMail } from "../service/MailerService";
import UserRegistrationConfirm from "../mail/UserRegistrationConfirm";

// module.exports.activateAccount = function activateAccount (req, res, next, activationCode) {
//   CustomerRegistration.activateAccount(activationCode)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

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
    const isExists = await checkEmail(req.body.email);
    if (isExists) {
      return errorResponse(res, 400, "EMAIL_ALREADY_EXISTS", "Email Already Exists");
    }
    
    // Send body to registration service
    const result = await registerAccount(req.body);

    // Generate activation token and send mail
    const activationToken = await generateActivationToken(req.body.email);
    if (result) {
      sendMail(UserRegistrationConfirm(req.body.email, activationToken));
      return successResponse(res, 201, "Account Registered Successfully");
    }
  } catch (error) {
    return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
  }
};
