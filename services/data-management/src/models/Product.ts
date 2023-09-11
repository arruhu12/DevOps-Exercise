export type Product = {
    id: string,
    customer_id: Number,
    name: string,
    buy_price: number,
    sell_price: number,
    stock?: number,
    created_at?: string,
    updated_at?: string
}