import { NextFunction, Request, Response } from "express";
import UserContextService from "../service/UserContextService";
import { errorResponse } from "../utils/writer";

export default (roles: string[] = ['*']) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRoles = UserContextService.getUserRole(req.headers.authorization!);
        const checkRole = userRoles.every(element => roles.includes(element));
        if (!checkRole) {
            return errorResponse(res, 403, "UNAUTHORIZED", "Unauthorized");
        }
        return next();
    }
}