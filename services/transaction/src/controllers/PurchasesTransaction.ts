/**
 * Purchases Transaction Controller
 */

import { Request, Response } from "express";
import PurchasesTransactionService from "../service/PurchasesTransactionService";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import TransactionService from "../service/TransactionService";
import { validationResult } from "express-validator";

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

            if (!transactions) {
                return successResponse(res, 200, `Today's purchase transaction is empty`, []);
            }

            // Formatting Output
            const transactionsFormatted = transactions.map((transaction) => 
                TransactionService.generateTransactionOutput(transaction));
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

            return successResponse(res, 200, 'Purchase Transaction Fetched Successfully', 
                TransactionService.generateTransactionOutput(transaction, true));
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

            // Check Received Weight is not more than netto weight with deduction
            const [, nettoWeightWithDeduction] = TransactionService.calculateNettoAndWeight(
                req.body.grossWeight, req.body.tareWeight, req.body.deductionPercentage);
            if (req.body.receivedWeight > nettoWeightWithDeduction) {
                return errorResponse(res, 400, 'RECEIVED_WEIGHT_MISMATCH', 'Received Weight Mismatch');
            }

            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);

            await PurchasesTransactionService.store(userId, req.body);
            return successResponse(res, 201, 'Purchase Transaction Stored Successfully');
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}
