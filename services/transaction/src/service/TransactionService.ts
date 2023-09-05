/**
 * Transaction Service
 */

import TransactionImageInterface from "interfaces/TransactionImageInterface";
import TransactionOutputInterface from "../interfaces/TransactionInterface";
import { v4 as uuid } from 'uuid';
import FileService from "./FileService";
import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";

export default class TransactionService {
    private static readonly GET_IMAGE_QUERY = `
        SELECT id, image_type, image_path
        FROM product_transaction_images
        WHERE transaction_id = ?
    `;

    /**
     * Capitalize First Letter of words
     * @param inputWords string
     * @returns string
     */
    private static capitalizeFirstLetter(inputWords: string): string {
        try {
            const words = inputWords.split(' ');
            const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
            return capitalizedWords.join(' ');
        } catch (error) {
            throw error;
        }
    }

    /**
     * Calculate Netto and Weight
     * 
     * @param grossWeight number
     * @param tareWeight number
     * @param deductionPercentage number
     * 
     * @returns any
     */
    public static calculateNettoAndWeight(grossWeight: number, tareWeight: number, deductionPercentage: number) {
        try {
            const nettoWeight = grossWeight - tareWeight;
            const deduction = nettoWeight * deductionPercentage / 100;
            const nettoWeightWithDeduction = nettoWeight - deduction;
            return [ nettoWeight, nettoWeightWithDeduction ] as const;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Calculate Netto Weight and total
     * @param grossWeight number
     * @param tareWeight number
     * @param deductionPercentage number
     * @param price number
     * 
     * @returns any
     */
    private static calculateNettoWeightAndTotal(grossWeight: number, tareWeight: number, deductionPercentage: number, price: number) {
        try {
            const [nettoWeight, nettoWeightWithDeduction] = this.calculateNettoAndWeight(grossWeight, tareWeight, deductionPercentage);
            const total = nettoWeightWithDeduction * price;
            return { nettoWeight, nettoWeightWithDeduction, total };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Formatting Transaction Date
     * 
     * @param transactionDate string
     * @returns string
     */
    private static formattingTransactionDate(transactionDate: string) {
        try {
            const date = new Date(transactionDate);
            date.setHours(date.getHours() + 7);
            return date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate Transaction Output
     * 
     * @param transaction any
     * @param isDetail boolean (default: false)
     * @returns TransactionOutputInterface
     */
    public static generateTransactionOutput(transaction: any, proofImages: any[]=[], isDetail:boolean = false): TransactionOutputInterface {
        try {
            const { nettoWeight, nettoWeightWithDeduction, total } = this.calculateNettoWeightAndTotal(
                transaction.gross_weight,
                transaction.tare_weight,
                transaction.deduction_percentage,
                transaction.price
            );

            let result: TransactionOutputInterface;

            if (!isDetail) {
                result = {
                    id: transaction.id,
                    supplierName: transaction.supplier_name,
                    productName: transaction.product_name,
                    transactionDate: this.formattingTransactionDate(transaction.transaction_date),
                    totalWeight: nettoWeightWithDeduction,
                    receivedWeight: transaction.received_weight,
                    total: total,
                    paymentMethod: this.capitalizeFirstLetter(transaction.payment_method),
                    paymentStatus: this.capitalizeFirstLetter(transaction.payment_status),
                    deliveryStatus: this.capitalizeFirstLetter(transaction.delivery_status),
                    isPaid: transaction.payment_status.to === 'paid',
                    isDelivered: transaction.delivery_status === 'fully delivered',
                }
            }
            else {
                result = {
                    id: transaction.id,
                    supplierName: transaction.supplier_name,
                    productName: transaction.product_name,
                    transactionDate: this.formattingTransactionDate(transaction.transaction_date),
                    grossWeight: transaction.gross_weight,
                    tareWeight: transaction.tare_weight,
                    nettoWeight: nettoWeight,
                    deductionPercentage: transaction.deduction_percentage,
                    totalWeight: nettoWeightWithDeduction,
                    receivedWeight: transaction.received_weight,
                    price: transaction.price,
                    total: total,
                    vehicleRegistrationNumber: transaction.vehicle_registration_number,
                    paymentMethod: this.capitalizeFirstLetter(transaction.payment_method),
                    paymentStatus: this.capitalizeFirstLetter(transaction.payment_status),
                    deliveryStatus: this.capitalizeFirstLetter(transaction.delivery_status),
                    sourceOfPurchase: transaction.source_of_purchase,
                    additionalNotes: transaction.additional_notes,
                    proofImages: proofImages
                }
            }

            if (transaction.transaction_type) {
                result.transactionType = transaction.transaction_type;
            }
            if (transaction.created_by) {
                result.createdBy = transaction.created_by;
            }
            return result;
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
        const storage = new FileService();

        try {
            await connection.beginTransaction();
            for (const file of files) {
                const [filename, type] = await storage.upload(file, transactionId);

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
     * Get Purchase Images By Transaction Id
     * 
     * @param transactionId string
     * @returns Promise<RowDataPacket[]>
     */
    public static async getPurchaseImagesByTransactionId(transactionId: string): Promise<string[]> {
        try {
            const storage = new FileService();

            const [images] = await db.query<RowDataPacket[]>(this.GET_IMAGE_QUERY, [transactionId]);

            const imageUrls = images.map(async (image: RowDataPacket) => {
                const filename = `${image.image_path}.${image.image_type}`;
                return await storage.getFileUrl(filename, transactionId);
            }); 
            return await Promise.all(imageUrls);
        } catch (error) {
            throw error;
        }
    }
}