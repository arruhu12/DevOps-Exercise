/**
 * Purchases Transaction Controller
 */

import { Request, Response } from "express";
import PurchasesTransactionService from "../service/PurchasesTransactionService";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import { validationResult } from "express-validator";
import TransactionImageService from "../service/TransactionImageService";
import { camelCaseKeys } from "../utils/keyConverter";
import TransactionRepositories from "../repositories/TransactionRepositories";

export default class PurchasesTransactionController {
    /**
     * Get Purchases 
     * 
     * Get Purchases with same employeeId
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getPurchases(req: Request, res: Response) {
        try {
            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);

            // Get Purchase Transactions
            const transactions = await PurchasesTransactionService.getDailyHistory(userId);

            if (transactions.length === 0) {
                return successResponse(res, 200, `Today's purchase transaction is empty`, []);
            }

            // Formatting Output
            const transactionsFormatted = transactions.map((transaction) => 
                camelCaseKeys(transaction));
            return successResponse(res, 200, 'Purchases Transaction Fetched Successfully', transactionsFormatted);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Get Purchases Transaction By Id
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getPurchasesById(req: Request, res: Response) {
        try {
            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);

            // Get Purchase Transaction
            const transaction = await PurchasesTransactionService.getPurchaseById(userId, req.params.id);

            if (!transaction) {
                return errorResponse(res, 404, 'NOT_FOUND', 'Purchase Transaction Not Found');
            }

            // Get Proof Images
            transaction.proof_images = await TransactionImageService.getImages(transaction.id);

            return successResponse(res, 200, 'Purchase Transaction Fetched Successfully', camelCaseKeys(transaction));
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
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

            await PurchasesTransactionService.store(userId, customerId, req.body);
            return successResponse(res, 201, 'Purchase Transaction Stored Successfully');
        } catch (error) {
            if (error instanceof Error && error.message === 'DELIVERED_WEIGHT_MISMATCH') {
                return errorResponse(res, 400, error.message, 'Delivered Weight Mismatch');
            }
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Update Purchase Transaction
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async updatePurchase(req: Request, res: Response) {
        try {
            // Get Validation Result and return error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
            }

            // Get Employee Id and Customer Id
            const userId = UserContextService.getUserId(req.headers.authorization!);
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Check Purchase Transaction Exists
            const isTransactionExists = await TransactionRepositories.checkTransactionExists(req.body.id, customerId);
            if (!isTransactionExists) {
                return errorResponse(res, 404, 'NOT_FOUND', 'Purchase Transaction Not Found');
            }

            // Update Purchase Transaction
            await PurchasesTransactionService.update(userId, customerId, req.body);
            return successResponse(res, 200, 'Purchase Transaction Updated Successfully');
        } catch (error) {
            if (error instanceof Error && error.message === 'DELIVERED_WEIGHT_MISMATCH') {
                return errorResponse(res, 400, error.message, 'Delivered Weight Mismatch');
            }
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}
