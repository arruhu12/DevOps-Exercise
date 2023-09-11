import { RowDataPacket } from "mysql2";
import { DAILY_WEIGHT_TOTAL, DAILY_WEIGHT_TOTAL_BY_PAYMENT_METHOD_QUERY, DAILY_WEIGHT_TOTAL_BY_PRODUCT_QUERY, REPORT_QUERY } from "../queries/ReportQueries";
import { db } from "../service/DatabaseService";
import { ITransactionOutput } from "../interfaces/TransactionOutputInterface";

export interface ITotalWeight {
    purchase: number;
    sale: number;
}

export interface ITotalByProductName {
    transaction_type: string;
    name: string;
    total: number;
}

export interface ITotalByPaymentMethod {
    transaction_type: string;
    name: string;
    total: number;
}

export default class ReportRepositories {
    /**
     * Get Daily Transactions for Dashboard
     * 
     * @param customerId string
     * @returns Promise<ITotalWeight>
     */
    public static async getDailyTotalWeight(customerId: number): Promise<ITotalWeight> {
        try {
            const [total] = await db.query<RowDataPacket[]>(
                DAILY_WEIGHT_TOTAL, [customerId]);
            return {
                purchase: total[0].total,
                sale: total[1].total
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Daily Transactions for Dashboard
     * based on product name
     * 
     * @param customerId string
     * @param transactionType string
     * @returns Promise<ITotalByProductName>
     */
    public static async getDailyTotalByProductName(customerId: number): Promise<ITotalByProductName[]> {
        try {
            const [total] = await db.query<ITotalByProductName[] & RowDataPacket[]>(
                DAILY_WEIGHT_TOTAL_BY_PRODUCT_QUERY, [customerId]);
            return total;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Daily Transaction for Dashboard
     * based on payment method
     * 
     * @param customerId string
     * @param transactionType string
     * @returns Promise<ITotalByPaymentMethod>
     */
    public static async getDailyTotalByPaymentMethod(customerId: number): Promise<ITotalByPaymentMethod[]> {
        try {
            const [total] = await db.query<ITotalByPaymentMethod[] & RowDataPacket[]>(
                DAILY_WEIGHT_TOTAL_BY_PAYMENT_METHOD_QUERY, [customerId]);
            return total;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Reports
     * 
     * @param customerId string
     * @param conditionals string[]
     * @param values string[]
     * @returns Promise<ITransactionOutput[]>
     */
    public static async getReports(customerId: number, conditionals: string[], values: string[]): Promise<ITransactionOutput[]> {
        try {
            const [reports] = await db.query<ITransactionOutput[] & RowDataPacket[]>(
                `${REPORT_QUERY} ${(conditionals.length > 0) ? `AND ${conditionals.join(' AND ')}` : ''}
                ORDER BY t.created_at DESC`, [customerId, ...values]);
            return reports;
        } catch (error) {
            throw error;
        }
    }
}