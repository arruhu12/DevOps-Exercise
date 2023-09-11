/**
 * Transaction Service
 */

import { v4 as uuid } from 'uuid';
import FileService from "./FileService";
import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import TransactionRepositories from "../repositories/TransactionRepositories";
import { GET_IMAGE_QUERY } from '../queries/ReportQueries';

export default class TransactionImageService {
    /**
     * Store proof Image
     * 
     * @param transactionId string
     * @param files string[]
     * @returns void
     */
    public static async store(transactionId: string, customerId: number, files: string[]): Promise<void> {
        const connection = await db.getConnection();
        const storage = new FileService();

        try {
            await connection.beginTransaction();
            for (const file of files) {
                const [filename, type] = await storage.upload(file, transactionId);

                if (!filename || !type) {
                    throw new Error("Error uploading file");
                }

                TransactionRepositories.storeImage({
                    id: uuid(),
                    customer_id: customerId,
                    transaction_id: transactionId,
                    image_type: type,
                    image_path: filename
                })
            }
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        }
    }

    /**
     * Get Proof Images
     * 
     * @param transactionId string
     * @returns Promise<RowDataPacket[]>
     */
    public static async getImages(transactionId: string): Promise<string[]> {
        try {
            const storage = new FileService();

            const [images] = await db.query<RowDataPacket[]>(GET_IMAGE_QUERY, [transactionId]);

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