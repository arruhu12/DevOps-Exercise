import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/writer";
import AuthenticationService from "../service/AuthenticationService";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (
            req.method === "OPTIONS" &&
            req.headers.origin &&
            req.headers["access-control-request-method"]
        ) {
            return next();
        }

        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return errorResponse(res, 401, "UNAUTHORIZED", "Unauthorized");
        }
        if (await AuthenticationService.tokenValidation(token)) {
            return next();
        }
    } catch (error) {
        return errorResponse(res, 401, "UNAUTHORIZED", "Unauthorized");
    }
}
