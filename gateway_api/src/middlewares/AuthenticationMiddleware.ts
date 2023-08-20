import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/writer";
import AuthenticationService from "../service/AuthenticationService";

export default () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Bypass CORS OPTIONS
            if (
                req.method === "OPTIONS" &&
                req.headers.origin &&
                req.headers["access-control-request-method"]
            ) {
                return next();
            }
    
            // Validation token
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return errorResponse(res, 401, "UNAUTHORIZED", "Unauthorized");
            }
            const user = await AuthenticationService.tokenValidation(token);
            if (!user) {
                return errorResponse(res, 401, "UNAUTHORIZED", "Unauthorized");
            }
            return next();
        } catch (error) {
            return errorResponse(res, 401, "UNAUTHORIZED", "Unauthorized", error);
        }
    }
}
