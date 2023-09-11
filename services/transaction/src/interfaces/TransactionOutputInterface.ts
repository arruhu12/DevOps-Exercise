import ITransactionImage from "../models/TransactionImage";

export interface ITransactionOutput {
    id: string,
    supplier_name?: string,
    product_name: string,
    transaction_date: string,
    transaction_type?: string,
    gross_weight: number,
    tare_weight: number,
    netto_weight?: number,
    deduction_percentage: number,
    total_weight: number,
    delivered_weight: number,
    price?: number,
    total: number,
    vehicle_registration_number?: string,
    payment_method: string,
    payment_status: string,
    delivery_status: string,
    source_of_purchase?: string,
    additional_notes?: string,
    longitude?:number,
    latitude?:number,
    proof_images?: string[],
    proof_thumbnail_images?: string[],
    is_paid?: boolean,
    is_delivered?: boolean,
    transaction_images?: ITransactionImage[]
    created_by?: string,
    updated_by?: string,
    created_at?: string,
    updated_at?: string,
}

export class TransactionOutput implements ITransactionOutput {
    id: string;
    supplier_name?: string;
    product_name: string;
    transaction_date: string;
    transaction_type?: string;
    gross_weight: number;
    tare_weight: number;
    netto_weight?: number;
    deduction_percentage: number;
    total_weight: number;
    delivered_weight: number;
    price?: number;
    total: number;
    vehicle_registration_number?: string;
    payment_method: string;
    payment_status: string;
    delivery_status: string;
    longitude?: number;
    latitude?: number;
    source_of_purchase?: string;
    additional_notes?: string;
    proof_images?: string[];
    proof_thumbnail_images?: string[];
    is_paid?: boolean;
    is_delivered?: boolean;
    transaction_images?: ITransactionImage[];
    created_by?: string;
    updated_by?: string;
    created_at?: string;
    updated_at?: string;

    /**
     * Formatting Transaction Date
     * 
     * @param transactionDate string
     * @returns string
     */
    private formattingTransactionDate(transactionDate: string) {
        try {
            const date = new Date(transactionDate);
            date.setHours(date.getHours() + 7);
            return date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        } catch (error) {
            throw error;
        }
    }

    constructor(transaction: ITransactionOutput) {
        this.id = transaction.id;
        this.supplier_name = (transaction.supplier_name !== undefined) ? 
            transaction.supplier_name ?? undefined: undefined;
        this.product_name = transaction.product_name;
        this.transaction_date = this.formattingTransactionDate(transaction.transaction_date);
        this.transaction_type = transaction.transaction_type;
        this.gross_weight = transaction.gross_weight;
        this.tare_weight = transaction.tare_weight;
        this.netto_weight = (transaction.netto_weight === undefined) ? 
            undefined : +transaction.netto_weight;
        this.deduction_percentage = transaction.deduction_percentage;
        this.total_weight = +transaction.total_weight;
        this.delivered_weight = transaction.delivered_weight;
        this.price = (transaction.price === undefined) ? 
        undefined : +transaction.price;
        this.total = +transaction.total;
        this.vehicle_registration_number = transaction.vehicle_registration_number;
        this.payment_method = transaction.payment_method;
        this.payment_status = transaction.payment_status;
        this.delivery_status = transaction.delivery_status;
        this.is_paid = (transaction.is_paid === undefined) ? 
            undefined : !!transaction.is_paid;
        this.is_delivered = (transaction.is_delivered === undefined) ? 
            undefined : !!transaction.is_delivered;
        this.source_of_purchase = (transaction.source_of_purchase === undefined) ? 
            undefined: transaction.source_of_purchase ?? '-';
        this.longitude = (transaction.longitude !== undefined) ?
            transaction.longitude ?? undefined : undefined;
        this.latitude = (transaction.latitude !== undefined) ?
            transaction.latitude ?? undefined : undefined;
        this.additional_notes = (transaction.additional_notes === undefined) ?
            undefined : transaction.additional_notes ?? '-';
    }
}