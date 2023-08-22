export default interface TransactionOutputInterface {
    id: string,
    supplierName: string,
    productName: string,
    transactionDate: string,
    grossWeight?: number,
    tareWeight?: number,
    nettoWeight?: number,
    deductionPercentage?: number,
    totalWeight: number,
    receivedWeight: number,
    price?: number,
    total: number,
    vehicleRegistrationNumber?: string,
    paymentMethod: string,
    paymentStatus: string,
    deliveryStatus: string,
    sourceOfPurchase?: string,
    additionalNotes?: string,
    proofImages?: string[],
    isPaid?: boolean,
    isDelivered?: boolean,
}