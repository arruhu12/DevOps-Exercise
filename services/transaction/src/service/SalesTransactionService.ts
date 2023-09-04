import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { Transaction } from "models/Transaction";
import { v4 as uuid } from 'uuid';
import TransactionService from "./TransactionService";

/**
 * Sales Transaction Service
 */
export default class SalesTransactionService {
  /**
   * Get sales transactions
   * 
   * @param userId string
   * @returns Promise<RowDataPacket[]>
   */
  public static async all(userId: string): Promise<RowDataPacket[]> {
    try {
      const [purchases] = await db.query<RowDataPacket[]>(`
          SELECT t.id, t.transaction_type, p.name as product_name, p.price,
          t.created_at as transaction_date, t.gross_weight, t.tare_weight, 
          t.received_weight, t.deduction_percentage, t.vehicle_registration_number, 
          t.payment_status, t.delivery_status, t.payment_method
          FROM product_transactions t, products p
          WHERE t.product_id = p.id AND t.created_by = ? AND t.transaction_type = 'sale'
          ORDER BY t.created_at DESC
      `, [userId]);
      return purchases;
    } catch (error) {
        throw error;
    }
  }

  /**
   * Get sale by id
   * 
   * @param userId string
   * @param transactionId string
   * @returns Promise<RowDataPacket>
   */
  public static async getById(userId: string, transactionId: string): Promise<RowDataPacket> {
    try {
      const [sale] = await db.query<RowDataPacket[]>(`
          SELECT t.id, t.transaction_type, p.name as product_name, p.price, 
          t.created_at as transaction_date, t.gross_weight, t.tare_weight, 
          t.received_weight, t.deduction_percentage, t.vehicle_registration_number,
          t.payment_status, t.delivery_status, t.payment_method
          FROM product_transactions t, products p
          WHERE t.product_id = p.id AND t.created_by = ? AND 
          t.transaction_type = 'sale' AND t.id = ?
      `, [userId, transactionId]);
      return sale[0];
    } catch (error) {
        throw error;
    }
  }

  /**
   * Store Sale Transaction
   * 
   * @param userId string
   * @param body any
   * @returns void
   */
  public static async store(userId: string, body: any): Promise<void> {
    try {
      const transaction: Transaction = {
        id: uuid(),
        transaction_type: 'sale',
        product_id: body.productId,
        gross_weight: body.grossWeight,
        tare_weight: body.tareWeight,
        deduction_percentage: body.deductionPercentage,
        received_weight: body.receivedWeight,
        vehicle_registration_number: body.vehicleRegistrationNumber,
        payment_status: body.paymentStatus,
        delivery_status: body.deliveryStatus,
        payment_method: body.paymentMethod,
        created_by: userId
      }

      const [, nettoWeightWithDeduction] = TransactionService.calculateNettoAndWeight(
        body.grossWeight, body.tareWeight,  body.deductionPercentage
      );

      // Check if the received weight is not more than netto weight with deduction
      if (body.receivedWeight > nettoWeightWithDeduction) {
        throw new Error('RECEIVED_WEIGHT_MISMATCH');
      }

      // Database Transaction
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
  
        // Lock transaction and check stock
        const [[product]] = await connection.query<RowDataPacket[]>(`SELECT stock FROM products WHERE id = ?`, [body.productId]);
        if (product.stock < nettoWeightWithDeduction) {
          throw new Error('INSUFFICIENT_STOCK');
        }
  
        await connection.query(`INSERT INTO product_transactions SET ?`, [transaction]);
        await connection.query(`UPDATE products SET stock = stock - ? WHERE id = ?`, [body.receivedWeight, body.productId]);
        await connection.commit();
      } catch (transactionError) {
          await connection.rollback();
          throw transactionError;
      }
      await TransactionService.storePurchaseProofImage(transaction.id, body.proofImages);
    } catch (error) {
        throw error;
    }
  }
}