import { Request, Response } from "express";
import TransactionService from "../service/TransactionService";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import PurchasesTransactionService from "../service/PurchasesTransactionService";

export default class ReportController {
    public static async getDashboard(req: Request, res: Response) {
        try {
            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get Sales Transactions
            const transactions = await PurchasesTransactionService.getDailyHistoryForDashboard(customerId);
            if (!transactions) {
                return successResponse(res, 200, `Today's sales transaction is empty`, []);
            }

            return successResponse(res, 200, `Today's sales transaction`, transactions);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}