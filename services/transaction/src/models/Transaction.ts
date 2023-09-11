export interface Transaction {
    id: string,
    transaction_type: string,
    product_id: string,
    gross_weight?: number,
    tare_weight?: number,
    deduction_percentage?: number,
    delivered_weight?: number,
    price: number,
    vehicle_registration_number: string,
    payment_status?: string,
    delivery_status?: string,
    payment_method?: string,
    source_of_purchase?: string,
    additional_notes?: string,
    created_by: string,
    updated_by?: string
}