import { Request, Response } from "express";
import SalesTransactionService from "../service/SalesTransactionService";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import { validationResult } from "express-validator";
import TransactionImageService from "../service/TransactionImageService";
import { camelCaseKeys } from "../utils/keyConverter";

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

            if (transactions.length === 0) {
                return successResponse(res, 200, `Sales transaction is empty`, []);
            }

            // Formatting Output
            const transactionsFormatted = transactions.map((transaction) => 
                camelCaseKeys(transaction));
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
            transaction.proof_images = await TransactionImageService.getImages(transaction.id);

            if (!transaction) {
                return errorResponse(res, 404, 'NOT_FOUND', `Transaction Not Found`);
            }

            return successResponse(res, 200, 'Sales Transaction Fetched Successfully', camelCaseKeys(transaction));
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
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            await SalesTransactionService.store(userId, customerId, req.body);
            return successResponse(res, 201, 'Sale Transaction Stored Successfully');
        } catch (error) {
            if (error instanceof Error) {
                switch(error.message) {
                    case 'INSUFFICIENT_STOCK':
                        return errorResponse(res, 400, error.message, 'Insufficient Stock');
                    case 'DELIVERED_WEIGHT_MISMATCH':
                        return errorResponse(res, 400, error.message, 'Delivered Weight Mismatch');
                }
            }
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}