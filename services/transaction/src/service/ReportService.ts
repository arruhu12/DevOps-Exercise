import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import ReportParametersInterface from "../interfaces/ReportParameterInterface";
import ReportRepositories, { ITotalByPaymentMethod, ITotalByProductName } from "../repositories/ReportRepositories";
import { ITransactionOutput } from "../interfaces/TransactionOutputInterface";

export default class ReportService {
    private static UTC_OFFSET_MINUTES = 7 * 60;
    /**
     * Split transaction type
     * 
     * @param acc Record <string, any>
     * @param item ITotalByProductName | ITotalByPaymentMethod
     * @returns Record <string, any>
     */
    private static splitTransactionType(
        acc: Record<string, any>, 
        item: ITotalByProductName | ITotalByPaymentMethod): Record<string, any>  {
        const key = item.transaction_type;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push({
            name: item.name,
            total: +item.total
        })
        return acc;
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
     * Get Purchases Daily History for Dashboard
     * 
     * @param customerId string
     * @returns
     */
    public static async getDailyHistoryForDashboard(customerId: number) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const total = await ReportRepositories.getDailyTotalWeight(customerId);
            const totalByProduct = await ReportRepositories.getDailyTotalByProductName(customerId)
                .then(res => res.reduce((acc: Record<string, any>, item) => this.splitTransactionType(acc, item), {}));
            const totalByPaymentMethod = await ReportRepositories.getDailyTotalByPaymentMethod(customerId)
                .then(res => res.reduce((acc: Record<string, any>, item) => this.splitTransactionType(acc, item), {}));
            await connection.commit();

            return {
                totalPurchases: +total.purchase,
                totalSales: +total.sale,
                purcahsesProducts: totalByProduct.purchase,
                salesProducts: totalByProduct.sale,
                purchasesPaymentMethods: totalByPaymentMethod.purchase,
                salesPaymentMethods: totalByPaymentMethod.sale
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
        customerId: number, parameters: ReportParametersInterface): Promise<ITransactionOutput[]> {
            try {
                const conditionals: string[] = [];
                const values: any[] = [];

                // Date Range Filter
                if (parameters.startDate && parameters.endDate) {
                    conditionals.push(`DATE(t.created_at) BETWEEN DATE(?) AND DATE(?)`);

                    const startDate = new Date(
                        new Date(parameters.startDate).setUTCHours(0,0,0,0)
                    );
                    const endDate = new Date(
                        new Date(parameters.endDate).setUTCHours(23,59,59,999)
                    );
                    startDate.setMinutes(startDate.getMinutes() - this.UTC_OFFSET_MINUTES);
                    endDate.setMinutes(endDate.getMinutes() - this.UTC_OFFSET_MINUTES);

                    values.push(new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)));
                    values.push(new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)));
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
                    conditionals.push(`purchase_detail.supplier_id IN (?)`);
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

                const reports = await ReportRepositories.getReports(customerId, conditionals, values);
                return reports.map((report) => {
                    report.transaction_date = this.formattingTransactionDate(report.transaction_date);
                    report.total_weight = +report.total_weight ?? 0;
                    report.delivered_weight = +report.delivered_weight ?? 0;
                    report.total = +report.total ?? 0;
                    return report;
                });
            } catch (error) {
                throw error;
            }
    }
}