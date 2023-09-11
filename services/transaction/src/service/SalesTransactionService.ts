import { db } from "./DatabaseService";
import { v4 as uuid } from 'uuid';
import TransactionRepositories from "../repositories/TransactionRepositories";
import { TransactionOutput } from "../interfaces/TransactionOutputInterface";
import TransactionImageService from "./TransactionImageService";

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
  public static async all(userId: string): Promise<TransactionOutput[]> {
    try {
      return TransactionRepositories.getSaleHistory(userId);
    } catch (error) {
        throw error;
    }
  }

  /**
   * Get sale by id
   * 
   * @param userId string
   * @param transactionId string
   * @returns Promise<TransactionOutput>
   */
  public static async getById(userId: string, transactionId: string): Promise<TransactionOutput> {
    try {
      return TransactionRepositories.getTransactionById(userId, transactionId, 'sale');
    } catch (error) {
        throw error;
    }
  }

  /**
   * Store Sale Transaction
   * 
   * @param userId string
   * @param customerId number
   * @param body any
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

      // Check product stock
      const productStocks = await TransactionRepositories.getProductStock(body.productId);
      if (nettoWeightWithDeduction > productStocks) {
        throw new Error('INSUFFICIENT_STOCK');
      }

      const productPrice = await TransactionRepositories.getProductSellPrice(body.productId);
      const transactionId = uuid();

      await TransactionRepositories.store({
        id: transactionId,
        transaction_type: 'sale',
        product_id: body.productId,
        gross_weight: body.grossWeight,
        tare_weight: body.tareWeight,
        deduction_percentage: body.deductionPercentage,
        price: productPrice,
        delivered_weight: body.deliveredWeight,
        vehicle_registration_number: body.vehicleRegistrationNumber,
        payment_status: body.paymentStatus,
        delivery_status: body.deliveryStatus,
        payment_method: body.paymentMethod,
        created_by: userId
      });

      
      await TransactionImageService.store(transactionId, customerId, body.proofImages);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
        throw error;
    }
  }
}