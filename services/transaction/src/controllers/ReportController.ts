import { Request, Response } from "express";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import ReportParametersInterface from "../interfaces/ReportParameterInterface";
import ReportService from "../service/ReportService";
import TransactionService from "../service/TransactionService";



export default class ReportController {
    /**
     * Get Dashboard Report
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getDashboard(req: Request, res: Response) {
        try {
            // Get Employee Id
            const userId = UserContextService.getUserId(req.headers.authorization!);
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get Sales Transactions
            const transactions = await ReportService.getDailyHistoryForDashboard(customerId);
            if (!transactions) {
                return successResponse(res, 200, `Today's sales transaction is empty`, []);
            }

            return successResponse(res, 200, `Today's sales transaction`, transactions);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Get All Reports
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getReports(req: Request, res: Response) {
        try {
            // Extract query parameters with default values if not provided
            const parameters: ReportParametersInterface = req.query;

            // Get Customer Id
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get Sales Transactions
            const transactions = await ReportService.getReports(customerId, parameters);
            if (!transactions) {
                return successResponse(res, 200, `Today's sales transaction is empty`, []);
            }

            // Formatting Output
            const transactionsFormatted = transactions.map((transaction) => 
                {
                    const result = TransactionService.generateTransactionOutput(transaction);
                    result.transactionType = transaction.transaction_type;
                    return result;
                });
            return successResponse(res, 200, `Today's sales transaction`, transactionsFormatted);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}