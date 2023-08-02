import { Request, Response,  } from "express";
import { body, validationResult } from "express-validator";
import { errorResponse, successResponse } from "../utils/writer";
import { checkEmail, registerAccount } from "../service/CustomerRegistrationService";

// module.exports.activateAccount = function activateAccount (req, res, next, activationCode) {
//   CustomerRegistration.activateAccount(activationCode)
//     .then(function (response) {
//       utils.writeJson(res, response);
//     })
//     .catch(function (response) {
//       utils.writeJson(res, response);
//     });
// };

export const customerRegistration = async (req: Request, res: Response) => {
  try {
    // Check email exists

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
    if (result) {
      return successResponse(res, 201, "Account Registered Successfully");
    }
  } catch (error) {
    return errorResponse(res, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", error);
  }
};
