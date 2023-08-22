/**
 * Purchase Transaction Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { Transaction } from "models/Transaction";
import { v4 as uuid } from 'uuid';

export default class PurchasesTransactionService {
    /** 
     * Get Purchases Daily History
     * 
     * @param employeeId string
     * @returns Promise<RowDataPacket[]>
    */
    public static async getDailyHistory(employeeId: string): Promise<RowDataPacket[]> {
        try {
            const [purchases] = await db.query<RowDataPacket[]>(`
                SELECT t.id, t.transaction_type, p.name as product_name, p.price,
                s.name as supplier_name, t.created_at as transaction_date, 
                t.gross_weight, t.tare_weight, t.received_weight, t.deduction_percentage,
                t.vehicle_registration_number, t.payment_status, t.delivery_status, 
                t.payment_method
                FROM Product_Transactions t, Products p, Suppliers s
                WHERE t.product_id = p.id AND t.supplier_id = s.id AND 
                t.created_by = ? AND t.transaction_type = 'purchase'
                AND DATE(t.created_at) = CURDATE() ORDER BY t.created_at
            `, [employeeId]);
            return purchases;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Purchase By Id
     * 
     * @param employeeId string
     * @param transactionId string
     * @returns Promise<RowDataPacket>
     */
    public static async getPurchaseById(employeeId: string, transactionId: string): Promise<RowDataPacket> {
        try {
            const [[purchase]] = await db.query<RowDataPacket[]>(`
                SELECT t.id, t.transaction_type, p.name as product_name, p.price,
                s.name as supplier_name, t.created_at as transaction_date, 
                t.gross_weight, t.tare_weight, t.received_weight, t.deduction_percentage,
                t.vehicle_registration_number, t.payment_status, t.delivery_status, 
                t.payment_method, t.source_of_purchase, t.additional_notes
                FROM Product_Transactions t, Products p, Suppliers s
                WHERE t.product_id = p.id AND t.supplier_id = s.id AND 
                t.created_by = ? AND t.transaction_type = 'purchase' AND t.id = ?
            `, [employeeId, transactionId]);
            return purchase;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Store Purchases Transaction
     * 
     * @param employeeId string
     * @param body TransactionStoreBody
     * @returns void
     */
    public static async store(employeeId: string, body: any): Promise<void> {
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
                created_by: employeeId
            }
            const connection = await db.getConnection();
            await connection.beginTransaction();
            await connection.query(`INSERT INTO Product_Transactions SET ?`, [transaction]);
            await connection.query(`UPDATE Products SET stock = stock + ? WHERE id = ?`, [body.receivedWeight, body.productId]);
            await connection.commit();
        } catch (error) {
            throw error;
        }
    }
}


// /**
//  * Get Recently Recorded Purchase Transaction
//  *
//  * returns inline_response_200_2
//  **/
// exports.getPurchases = function() {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = "";
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }


// /**
//  * Get Sales Transaction By Id
//  *
//  * transactionId String 
//  * returns inline_response_200_3
//  **/
// exports.getPurchasesTransactionById = function(transactionId) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = "";
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }


// /**
//  * Store Sales Transaction
//  *
//  * body TransactionStoreBody  (optional)
//  * returns APISuccessResponse
//  **/
// exports.storePurchases = function(body) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "success" : true,
//   "message" : "message"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }


// /**
//  * Send Update Request to Admin
//  *
//  * body Purchases_request_body  (optional)
//  * returns APISuccessResponse
//  **/
// exports.updatePurchases = function(body) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "success" : true,
//   "message" : "message"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }

