import { Response } from "express"
import { ValidationError } from "express-validator";

type ValidationErrorBody = {
    field?: string;
    message: string;
};

type ErrorBody = {
    success: boolean;
    errorCode: string;
    message: string;
    errors?: any;
};

export const successResponse = async (res: Response, httpCode: number, message: string, data?: any) => {
    return res.status(httpCode).json({
        success: true,
        message: message,
        data: data
    });
}

export const errorResponse = async (res: Response, httpCode: number, errorCode: string, message: string, errors?: any) => {
    const body:ErrorBody = {
        success: false,
        errorCode: errorCode,
        message: message
    };
    
    if (errors) {
        if (errors instanceof Array)
            body.errors = errors.map((error) => {
                const field = (error.type === 'field') ? error.path : '';
                const message = error.msg;
                return {
                    field, message
                }
            });
        else if (process.env.NODE_ENV === "development") {
            body.errors = {
                message: errors.message,
                stacktrace: errors.stack
            };
        }
    }
    return res.status(httpCode).json(body);
}