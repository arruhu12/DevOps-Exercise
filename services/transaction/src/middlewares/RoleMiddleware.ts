import { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/writer";
import UserContextService from "../service/UserContextService";

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