import { ALL_TRANSACTiON_QUERY, ORDER_BY_DATE_QUERY, TRANSACTION_DETAIL_QUERY } from "../queries/ReportQueries";
import { db } from "../service/DatabaseService";
import { Transaction } from "../models/Transaction";
import { PRODUCT_BUY_PRICE_QUERY, PRODUCT_SELL_PRICE_QUERY, PRODUCT_STOCK_QUERY, STORE_TRANSACTION_IMAGE_QUERY, STORE_TRANSACTION_PURCHASE_DETAIL_QUERY, STORE_TRANSACTION_QUERY } from "../queries/TransactionManagementQueries";
import TransactionImage from "../models/TransactionImage";
import { ITransactionOutput, TransactionOutput } from "../interfaces/TransactionOutputInterface";
import { RowDataPacket } from "mysql2";
import TransactionPurchaseDetail from "../models/TransactionPurchaseDetail";

export default class TransactionRepositories {
    /**
     * Get Daily Purchase Transactions for Employee
     * 
     * @param userId string
     * @returns Promise<TransactionOutput[]>
     */
    public static async getPurchaseDailyHistory(userId: string): Promise<TransactionOutput[]> {
        try {
            const [purchases] = await db.query<ITransactionOutput[] & RowDataPacket[]>(`
                ${ALL_TRANSACTiON_QUERY} AND DATE(t.created_at) = CURDATE()
                ${ORDER_BY_DATE_QUERY}`, 
                ['purchase', userId])
            console.log(purchases);
            return purchases.map(purchase => new TransactionOutput(purchase));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Sale Transactions
     * 
     * @param userId: string
     * @returns Promise<TransactionOutput[]>
     */
    public static async getSaleHistory(userId: string): Promise<TransactionOutput[]> {
        try {
            const [sales] = await db.query<ITransactionOutput[] & RowDataPacket[]>(`
                ${ALL_TRANSACTiON_QUERY}
                ${ORDER_BY_DATE_QUERY}`, 
                ['sale', userId])
            return sales.map(sale => new TransactionOutput(sale));
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Transaction Detail
     * 
     * @param userId string
     * @param transactionId string
     * @param transactionType string
     * @returns Promise<TransactionOutput>
     */
    public static async getTransactionById(userId: string, transactionId: string, transactionType: string): Promise<TransactionOutput> {
        try {
            const [[transaction]] = await db.query<ITransactionOutput[] & RowDataPacket[]>(
                `${TRANSACTION_DETAIL_QUERY} AND created_by = ?`, [
                    transactionType, transactionId, userId
                ]);
            if (!transaction) {
                return transaction;
            }
            return new TransactionOutput(transaction);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Product Buy Price
     * @param productId string
     * @return Promise<number>
     */
    public static async getProductBuyPrice(productId: string): Promise<number> {
        try {
            const [[product]] = await db.query<number & RowDataPacket[]>(
                PRODUCT_BUY_PRICE_QUERY, [productId]);
            return product.price ?? 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Product Sell Price
     * @param productId
     * @returns Promise<number>
     */
    public static async getProductSellPrice(productId: string): Promise<number> {
        try {
            const [[product]] = await db.query<number & RowDataPacket[]>(
                PRODUCT_SELL_PRICE_QUERY, [productId]);
            return product.price ?? 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Product Stock
     * @param productId
     * @returns Promise<number>
     */
    public static async getProductStock(productId: string): Promise<number> {
        try {
            const [[product]] = await db.query<number & RowDataPacket[]>(
                PRODUCT_STOCK_QUERY, [productId]);
            return product.stock ?? 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Store Transaction
     * 
     * @param body Transaction
     * @returns Promise<void>
     */
    public static async store(body: Transaction): Promise<void> {
        try {
            await db.query(STORE_TRANSACTION_QUERY, [body]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Store Purchase Transaction Detail
     * 
     * @param body TransactionPurchaseDetail
     * @returns Promise<void>
     */
    public static async storePurchaseDetail(body: TransactionPurchaseDetail): Promise<void> {
        try {
            await db.query(STORE_TRANSACTION_PURCHASE_DETAIL_QUERY, [body]);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Store Transaction Image
     * 
     * @param body: TransactionImage
     * @returns Promise<void>
     */
    public static async storeImage(body: TransactionImage): Promise<void> {
        try {
            await db.query(STORE_TRANSACTION_IMAGE_QUERY, [body]);
        } catch (error) {
            throw error;
        }
    }
    
}