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
            const employeeId = UserContextService.getEmployeeId(req.headers.authorization!);

            // Get Purchase Transactions
            const transactions = await PurchasesTransactionService.getDailyHistory(employeeId);

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
            const employeeId = UserContextService.getEmployeeId(req.headers.authorization!);

            // Get Purchase Transaction
            const transaction = await PurchasesTransactionService.getPurchaseById(employeeId, req.params.id);

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

            // Get Employee Id
            const employeeId = UserContextService.getEmployeeId(req.headers.authorization!);

            await PurchasesTransactionService.store(employeeId, req.body);
            return successResponse(res, 201, 'Purchase Transaction Stored Successfully');
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}
