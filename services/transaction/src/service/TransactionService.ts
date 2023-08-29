/**
 * Transaction Service
 */

import TransactionOutputInterface from "../interfaces/TransactionInterface";

export default class TransactionService {
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
    public static generateTransactionOutput(transaction: any, isDetail:boolean = false): TransactionOutputInterface {
        try {
            const { nettoWeight, nettoWeightWithDeduction, total } = this.calculateNettoWeightAndTotal(
                transaction.gross_weight,
                transaction.tare_weight,
                transaction.deduction_percentage,
                transaction.price
            );

            if (!isDetail) {
                return {
                    id: transaction.id,
                    supplierName: transaction.supplier_name,
                    productName: transaction.product_name,
                    transactionDate: this.formattingTransactionDate(transaction.transaction_date),
                    totalWeight: nettoWeightWithDeduction,
                    receivedWeight: transaction.received_weight,
                    total: total,
                    paymentMethod: transaction.payment_method,
                    paymentStatus: transaction.payment_status,
                    deliveryStatus: transaction.delivery_status,
                    isPaid: transaction.payment_status === 'Paid',
                    isDelivered: transaction.delivery_status === 'Delivered',
                }
            }
            return {
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
                paymentMethod: transaction.payment_method,
                paymentStatus: transaction.payment_status,
                deliveryStatus: transaction.delivery_status,
                sourceOfPurchase: transaction.source_of_purchase,
                additionalNotes: transaction.additional_notes,
            }
        } catch (error) {
            throw error;
        }
    }
}