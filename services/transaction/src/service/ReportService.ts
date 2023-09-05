import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import ReportParametersInterface from "../interfaces/ReportParameterInterface";

export default class ReportService {
    private static readonly SELECT_COLUMN_REPORT_QUERY = `
        SELECT 
            pt.id, pt.created_at AS transaction_date,
            pt.transaction_type, 
            IF(pt.supplier_id IS NULL, '-', s.name) AS supplier_name, 
            p.name AS product_name, p.price, pt.gross_weight,
            pt.tare_weight, pt.deduction_percentage, pt.received_weight,
            pt.payment_method, pt.payment_status, pt.delivery_status,
            details.name AS created_by
        FROM 
            product_transactions pt
            JOIN products p ON pt.product_id = p.id
            JOIN suppliers s ON (pt.supplier_id IS NULL OR pt.supplier_id = s.id)
            JOIN (
                SELECT 
                    id AS customer_id, user_id, CONCAT(first_name, ' ',last_name) as name 
                FROM customers c
                UNION
                SELECT 
                    customer_id, user_id, name 
                FROM employees e
            ) AS details ON details.user_id = pt.created_by
        WHERE
            details.customer_id = ?`;

    private static readonly DAILY_WEIGHT_TOTAL = `
        SELECT IFNULL(SUM(received_weight), 0) AS total
        FROM 
            product_transactions pt
            JOIN (
                SELECT 
                    id AS customer_id, user_id
                FROM customers c 
                UNION
                SELECT 
                    customer_id, user_id
                FROM employees e 
            ) AS user ON user.user_id = pt.created_by
        WHERE 
            pt.transaction_type = ? 
            AND DATE(pt.created_at) = CURDATE()
            AND user.customer_id = ?`;

    private static readonly DAILY_WEIGHT_TOTAL_BY_PRODUCT_QUERY = `
        SELECT p.name, IFNULL(SUM(pt.received_weight), 0) AS weight
        FROM products p 
        LEFT JOIN (
            SELECT product_id, received_weight, created_by
            FROM product_transactions t 
            JOIN (
                SELECT 
                    id AS customer_id, user_id
                FROM customers c 
                UNION
                SELECT 
                    customer_id, user_id
                FROM employees e 
            ) AS user ON user.user_id = t.created_by
            WHERE 
                t.transaction_type = ?
                AND DATE(t.created_at) = CURDATE()
                AND user.customer_id = ?
        ) pt ON p.id = pt.product_id
        GROUP BY p.name`;
    
    private static readonly DAILY_WEIGHT_TOTAL_BY_PAYMENT_METHOD_QUERY = `
        SELECT pm.name, IFNULL(SUM(pt.received_weight), 0) AS weight
        FROM (
            SELECT 'cash' AS name
            UNION
            SELECT 'transfer' AS name
        ) AS pm 
        LEFT JOIN (
            SELECT payment_method, received_weight, created_by
            FROM product_transactions t 
            JOIN (
                SELECT 
                    id AS customer_id, user_id
                FROM customers c 
                UNION
                SELECT 
                    customer_id, user_id
                FROM employees e 
            ) AS user ON user.user_id = t.created_by
            WHERE 
                t.transaction_type = ?
                AND DATE(t.created_at) = CURDATE()
                AND user.customer_id = ?
        ) pt ON pm.name = pt.payment_method
        GROUP BY pm.name`;

    /**
     * Get Purchases Daily History for Dashboard
     * 
     * @param customerId string
     * @returns
     */
    public static async getDailyHistoryForDashboard(customerId: number) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [[purchaseTotal]] = await connection.query<RowDataPacket[]>(
                this.DAILY_WEIGHT_TOTAL, ['purchase', customerId]);
            const [[saleTotal]] = await connection.query<RowDataPacket[]>(
                this.DAILY_WEIGHT_TOTAL, ['sale', customerId]);
            const [purchaseTotalByProduct] = await connection.query<RowDataPacket[]>(
                this.DAILY_WEIGHT_TOTAL_BY_PRODUCT_QUERY, ['purchase', customerId]);
            const [saleTotalByProduct] = await connection.query<RowDataPacket[]>(
                this.DAILY_WEIGHT_TOTAL_BY_PRODUCT_QUERY, ['sale', customerId]);
            const [purchaseTotalByPaymentMethod] = await connection.query(
                this.DAILY_WEIGHT_TOTAL_BY_PAYMENT_METHOD_QUERY, ['purchase', customerId]);
            const [saleTotalByPaymentMethod] = await connection.query(
                this.DAILY_WEIGHT_TOTAL_BY_PAYMENT_METHOD_QUERY, ['sale', customerId]);
            await connection.commit();

            return {
                totalPurchases: purchaseTotal.total,
                totalSales: saleTotal.total,
                purcahsesProducts: purchaseTotalByProduct,
                salesProducts: saleTotalByProduct,
                purchasesPaymentMethods: purchaseTotalByPaymentMethod,
                salesPaymentMethods: saleTotalByPaymentMethod
            }
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Get Reports
     * 
     * @param customerId: number
     * @param parameters: ReportParametersInterface
     * @returns Promise<RowDataPacket[]>
     */
    public static async getReports(
        customerId: number, parameters: ReportParametersInterface): Promise<RowDataPacket[]> {
            try {
                const conditionals: string[] = [];
                const values: any[] = [];

                // Date Range Filter
                if (parameters.startDate && parameters.endDate) {
                    conditionals.push(`DATE(pt.created_at) BETWEEN DATE(?) AND DATE(?)`);
                    values.push(new Date(parameters.startDate).toISOString());
                    values.push(new Date(parameters.endDate).toISOString());
                }

                // Transaction Type Filter
                if (parameters.transactionType) {
                    conditionals.push(`transaction_type = ?`);
                    values.push(parameters.transactionType);
                }

                // Products Filter
                if (parameters.products && parameters.products.length > 0) {
                    conditionals.push(`product_id IN (?)`);
                    values.push(parameters.products);
                }

                // Suppliers Filter
                if (parameters.suppliers && parameters.suppliers.length > 0) {
                    conditionals.push(`supplier_id IN (?)`);
                    values.push(parameters.suppliers);
                }

                // Payment Methods Filter
                if (parameters.paymentMethod) {
                    conditionals.push(`payment_method = ?`);
                    values.push(parameters.paymentMethod);
                }

                // Payment Status Filter
                if (parameters.paymentStatus) {
                    conditionals.push(`payment_status = ?`);
                    values.push(parameters.paymentStatus);
                }

                // Delivery Status Filter
                if (parameters.deliveryStatus) {
                    conditionals.push(`delivery_status = ?`);
                    values.push(parameters.deliveryStatus);
                }
                
                const [reports] = await db.query<RowDataPacket[]>(
                    `${this.SELECT_COLUMN_REPORT_QUERY} 
                    ${(conditionals.length > 0) ? `AND ${conditionals.join(' AND ')}` : ''}
                    ORDER BY pt.created_at DESC`, [customerId].concat(values)
                );
                
                return reports;
            } catch (error) {
                throw error;
            }
    }
}