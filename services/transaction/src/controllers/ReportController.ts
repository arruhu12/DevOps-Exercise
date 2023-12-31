import { Request, Response } from "express";
import UserContextService from "../service/UserContextService";
import { errorResponse, successResponse } from "../utils/writer";
import ReportParametersInterface from "../interfaces/ReportParameterInterface";
import ReportService from "../service/ReportService";
import { camelCaseKeys } from "../utils/keyConverter";
import TransactionImageService from "../service/TransactionImageService";



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
            const parameters: ReportParametersInterface = JSON.parse(req.query.query?.toString() ?? "{}");

            // Get Customer Id
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get Sales Transactions
            const transactions = await ReportService.getReports(customerId, parameters);
            if (transactions.length === 0) {
                return successResponse(res, 200, `Empty Reports`, []);
            }

            // Formatting Output
            const transactionsFormatted = transactions.map((transaction) => 
                camelCaseKeys(transaction));
            return successResponse(res, 200, `Report Fetched Succesfull`, transactionsFormatted);
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }

    /**
     * Get Report Detail
     * 
     * @param req Request
     * @param res Response
     * @returns Response
     */
    public static async getReportDetail(req: Request, res: Response) {
        try {
            // Get Customer Id
            const customerId = UserContextService.getCustomerId(req.headers.authorization!);

            // Get Sales Transactions
            const transaction = await ReportService.getTransactionDetail(customerId, req.params.id);
            if (!transaction) {
                return errorResponse(res, 404, 'NOT_FOUND', `Report Not Found`);
            }

             // Get Proof Images
            transaction.proof_images = await TransactionImageService.getImages(transaction.id);

            return successResponse(res, 200, `Report Fetched Succesfull`, camelCaseKeys(transaction));
        } catch (error) {
            return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
        }
    }
}