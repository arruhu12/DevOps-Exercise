/**
 * Purchase Transaction Service
 */

import { db } from "./DatabaseService";
import { v4 as uuid } from 'uuid';
import TransactionRepositories from "../repositories/TransactionRepositories";
import TransactionImageService from "./TransactionImageService";
import { ITransactionOutput, TransactionOutput } from "interfaces/TransactionOutputInterface";

export default class PurchasesTransactionService {
    /** 
     * Get Purchases Daily History
     * 
     * @param userId string
     * @returns Promise<RowDataPacket[]>
    */
    public static async getDailyHistory(userId: string): Promise<TransactionOutput[]> {
        try {
            const transactions: TransactionOutput[] = await TransactionRepositories.getPurchaseDailyHistory(userId);
            return transactions;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Purchase By Id
     * 
     * @param userId string
     * @param transactionId string
     * @returns Promise<RowDataPacket>
     */
    public static async getPurchaseById(userId: string, transactionId: string): Promise<ITransactionOutput> {
        try {
            const transaction = await TransactionRepositories.getTransactionById(userId, transactionId, 'purchase');
            return transaction;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Store Purchases Transaction
     * 
     * @param userId string
     * @param body TransactionStoreBody
     * @returns void
     */
    public static async store(userId: string, customerId: number, body: any): Promise<void> {
        const connection = await db.getConnection();
        try {
            // Check if the received weight is not more than netto weight with deduction
            const nettoWeightWithDeduction = (body.grossWeight - body.tareWeight) - ((body.grossWeight - body.tareWeight) * body.deductionPercentage / 100);
            if (body.deliveredWeight > nettoWeightWithDeduction) {
                throw new Error('DELIVERED_WEIGHT_MISMATCH');
            }

            // Database Transaction
            await connection.beginTransaction();
            const productPrice = await TransactionRepositories.getProductBuyPrice(body.productId);

            // Store Transaction
            const transactionId = uuid();
            const [lat, long] = body.coordinate.split(', ');
            await TransactionRepositories.store({
                id: transactionId,
                transaction_type: 'purchase',
                product_id: body.productId,
                price: productPrice,
                vehicle_registration_number: body.vehicleRegistrationNumber,
                source_of_purchase: body.sourceOfPurchase,
                additional_notes: body.additionalNotes,
                created_by: userId
            });
            await TransactionRepositories.storePurchaseDetail({
                transaction_id: transactionId,
                supplier_id: body.supplierId,
                longitude: long,
                latitude: lat
            });
            await TransactionImageService.store(transactionId, customerId, body.proofImages);
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}
