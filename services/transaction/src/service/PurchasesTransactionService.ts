/**
 * Purchase Transaction Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { Transaction } from "models/Transaction";
import { v4 as uuid } from 'uuid';
import FileUpload from "./FileUpload";
import TransactionImageInterface from "interfaces/TransactionImageInterface";

export default class PurchasesTransactionService {
    /** 
     * Get Purchases Daily History
     * 
     * @param userId string
     * @returns Promise<RowDataPacket[]>
    */
    public static async getDailyHistory(userId: string): Promise<RowDataPacket[]> {
        try {
            const [purchases] = await db.query<RowDataPacket[]>(`
                SELECT t.id, t.transaction_type, p.name as product_name, p.price,
                s.name as supplier_name, t.created_at as transaction_date, 
                t.gross_weight, t.tare_weight, t.received_weight, t.deduction_percentage,
                t.vehicle_registration_number, t.payment_status, t.delivery_status, 
                t.payment_method
                FROM product_transactions t, products p, suppliers s
                WHERE t.product_id = p.id AND t.supplier_id = s.id AND 
                t.created_by = ? AND t.transaction_type = 'purchase'
                AND DATE(t.created_at) = CURDATE() ORDER BY t.created_at
            `, [userId]);
            return purchases;
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
    public static async getPurchaseById(userId: string, transactionId: string): Promise<RowDataPacket> {
        try {
            const [[purchase]] = await db.query<RowDataPacket[]>(`
                SELECT t.id, t.transaction_type, p.name as product_name, p.price,
                s.name as supplier_name, t.created_at as transaction_date, 
                t.gross_weight, t.tare_weight, t.received_weight, t.deduction_percentage,
                t.vehicle_registration_number, t.payment_status, t.delivery_status, 
                t.payment_method, t.source_of_purchase, t.additional_notes
                FROM product_transactions t, products p, suppliers s
                WHERE t.product_id = p.id AND t.supplier_id = s.id AND 
                t.created_by = ? AND t.transaction_type = 'purchase' AND t.id = ?
            `, [userId, transactionId]);
            return purchase;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Store Purcahse proof Image
     * 
     * @param transactionId string
     * @param files string[]
     * @returns void
     */
    public static async storePurchaseProofImage(transactionId: string, files: string[]): Promise<void> {
        const connection = await db.getConnection();
        const storage = new FileUpload();

        try {
            await connection.beginTransaction();
            for (const file of files) {
                const [filename, type] = await storage.upload(file);

                if (!filename || !type) {
                    throw new Error("Error uploading file");
                }

                const transactionImage: TransactionImageInterface = {
                    id: uuid(),
                    transaction_id: transactionId,
                    image_type: type,
                    image_path: filename
                }

                await connection.query(`INSERT INTO product_transaction_images SET ?`, [transactionImage]);
            }
            await connection.commit();
        } catch (error) {
            await connection.rollback();
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
    public static async store(userId: string, body: any): Promise<void> {
        const connection = await db.getConnection();

        try {
            const transaction: Transaction = {
                id: uuid(),
                transaction_type: 'purchase',
                product_id: body.productId,
                supplier_id: body.supplierId,
                gross_weight: body.grossWeight,
                tare_weight: body.tareWeight,
                deduction_percentage: body.dedicationPersentage,
                received_weight: body.receivedWeight,
                vehicle_registration_number: body.vehicleRegistrationNumber,
                payment_status: body.paymentStatus,
                delivery_status: body.deliveryStatus,
                payment_method: body.paymentMethod,
                source_of_purchase: body.sourceOfPurchase,
                additional_notes: body.additionalNotes,
                created_by: userId
            }
            await connection.beginTransaction();
            await connection.query(`INSERT INTO product_transactions SET ?`, [transaction]);
            await connection.query(`UPDATE products SET stock = stock + ? WHERE id = ?`, [body.receivedWeight, body.productId]);
            await connection.commit();
            await PurchasesTransactionService.storePurchaseProofImage(transaction.id, body.proofImages);
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}
