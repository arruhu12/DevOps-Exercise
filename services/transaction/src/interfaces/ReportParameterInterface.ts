export default interface ReportParametersInterface {
    startDate?: string;
    endDate?: string;
    transactionType?: string;
    products?: string[];
    suppliers?: string[];
    paymentStatus?: string;
    paymentMethod?: string;
    deliveryStatus?: string;
}