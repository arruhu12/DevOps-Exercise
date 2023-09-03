/**
 * Purchase Transaction Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { Transaction } from "models/Transaction";
import { v4 as uuid } from 'uuid';
import TransactionService from "./TransactionService";

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
     * Get Purchases Daily History for Dashboard
     * 
     * @param customerId string
     * @returns
     */
    public static async getDailyHistoryForDashboard(customerId: number) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [[purchaseTotal]] = await connection.query<RowDataPacket[]>(`SELECT IFNULL(SUM(received_weight), 0) AS total
                FROM product_transactions pt, employees e 
                WHERE pt.transaction_type = 'purchase' AND DATE(pt.created_at) = CURDATE()
                AND pt.created_by = e.user_id AND e.customer_id = ?`, [customerId]);
            const [[saleTotal]] = await connection.query<RowDataPacket[]>(`SELECT IFNULL(SUM(received_weight), 0) AS total
                FROM product_transactions pt, employees e 
                WHERE transaction_type = 'sale' AND DATE(pt.created_at) = CURDATE()
                AND pt.created_by = e.user_id AND e.customer_id = ?`, [customerId]);
            const [purchaseTotalByProduct] = await connection.query(`SELECT p.name, IFNULL(SUM(received_weight), 0) AS total 
                FROM products p 
                LEFT JOIN product_transactions pt ON p.id = pt.product_id 
                LEFT JOIN employees e ON pt.created_by = e.user_Id 
                WHERE
                    (pt.transaction_type IS NULL OR pt.transaction_type = 'purchase')
                    AND (e.customer_id IS NULL OR e.customer_id = ?)
                    AND (pt.created_at IS NULL OR DATE(pt.created_at) = CURDATE())
                GROUP BY p.name`, [customerId]);
            const [saleTotalByProduct] = await connection.query(`SELECT p.name, IFNULL(SUM(received_weight), 0) AS total 
                FROM products p 
                LEFT JOIN product_transactions pt ON p.id = pt.product_id 
                LEFT JOIN employees e ON pt.created_by = e.user_Id 
                WHERE
                    (pt.transaction_type IS NULL OR pt.transaction_type = 'sale')
                    AND (e.customer_id IS NULL OR e.customer_id = ?)
                    AND (pt.created_at IS NULL OR DATE(pt.created_at) = CURDATE())
                GROUP BY p.name`, [customerId]);
            const [purchaseTotalByPaymentMethod] = await connection.query(`SELECT pm.name, IFNULL(SUM(pt.received_weight), 0) AS total
                FROM (
                    SELECT 'cash' AS name
                    UNION
                    SELECT 'transfer' AS name
                ) AS pm
                LEFT JOIN product_transactions pt  ON pm.name = pt.payment_method
                LEFT JOIN employees e ON pt.created_by = e.user_Id
                WHERE 
                    (pt.transaction_type IS NULL OR pt.transaction_type = 'purchase')
                    AND (pt.created_by IS NULL OR pt.created_by = e.user_id)
                    AND (e.customer_id IS NULL OR e.customer_id = ?)
                    AND (pt.created_at IS NULL OR DATE(pt.created_at) = CURDATE())
                GROUP BY name`, [customerId]);
            const [saleTotalByPaymentMethod] = await connection.query(`SELECT pm.name, IFNULL(SUM(pt.received_weight), 0) AS total
                FROM (
                    SELECT 'cash' AS name
                    UNION
                    SELECT 'transfer' AS name
                ) AS pm
                LEFT JOIN product_transactions pt  ON pm.name = pt.payment_method
                LEFT JOIN employees e ON pt.created_by = e.user_Id
                WHERE
                    (pt.transaction_type IS NULL OR pt.transaction_type = 'purchase')
                    AND (e.customer_id IS NULL OR e.customer_id = ?)
                    AND (pt.created_at IS NULL OR DATE(pt.created_at) = CURDATE())
                GROUP BY name`, [customerId]);
            await connection.commit();
            
            return {
                totalPurchases: purchaseTotal.total,
                totalSales: saleTotal.total,
                purcahsesProducts: purchaseTotalByProduct,
                salesProducts: saleTotalByProduct,
                purchasesPaymentMethods: purchaseTotalByPaymentMethod,
                salesPaymentMethods: saleTotalByPaymentMethod
            }
        } catch (error) {
            await connection.rollback();
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
                deduction_percentage: body.deductionPercentage,
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
            await TransactionService.storePurchaseProofImage(transaction.id, body.proofImages);
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }
}
