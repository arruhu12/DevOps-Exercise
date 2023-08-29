import { Request, Response } from "express";
import SalesTransactionService from "../service/SalesTransactionService";
import TransactionService from "../service/TransactionService";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import { validationResult } from "express-validator";

/**
 * Sales Transaction Controller
 */
export default class SalesTransactionController {
    /**
     * Get Sales Transactions
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async all(req: Request, res: Response) {
        try {
            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);

            // Get Sales Transactions
            const transactions = await SalesTransactionService.all(userId);

            if (!transactions) {
                return successResponse(res, 200, `Today's sales transaction is empty`, []);
            }

            // Formatting Output
            const transactionsFormatted = transactions.map((transaction) => 
                TransactionService.generateTransactionOutput(transaction));
            return successResponse(res, 200, 'Sales Transaction Fetched Successfully', transactionsFormatted);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Get Sale Transaction By Id
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getById(req: Request, res: Response) {
        try {
            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);

            // Get Sales Transaction
            const transaction = await SalesTransactionService.getById(userId, req.params.id);

            if (!transaction) {
                return errorResponse(res, 404, 'NOT_FOUND', `Transaction Not Found`);
            }

            // Formatting Output
            const transactionFormatted = TransactionService.generateTransactionOutput(transaction);
            return successResponse(res, 200, 'Sales Transaction Fetched Successfully', transactionFormatted);
        } catch (error) {
            return res.status(500).json(error);
        }
    }

    /**
     * Store Purchase
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async storePurchase(req: Request, res: Response) {
        try {
            // Get Validation Result and return error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
            }

            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);

            await SalesTransactionService.store(userId, req.body);
            return successResponse(res, 201, 'Sale Transaction Stored Successfully');
        } catch (error) {
            if (error instanceof Error) {
                switch(error.message) {
                    case 'INSUFFICIENT_STOCK':
                        return errorResponse(res, 400, error.message, 'Insufficient Stock');
                    case 'RECEIVED_WEIGHT_MISMATCH':
                        return errorResponse(res, 400, error.message, 'Received Weight Mismatch');
                }
            }
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}