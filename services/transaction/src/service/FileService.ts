import { GetObjectCommand, PutObjectCommandInput, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "dotenv";
import Randomstring from "randomstring";

export default class FileService {
    private readonly s3: S3;
    private readonly PRESIGNED_URL_EXPIRES = 15 * 60;

    constructor() {
        config();
        this.s3 = new S3({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        })
    }

    /**
     * Generate Object Parameters from Base64
     * 
     * @param file string
     * @param pathname string
     * @returns PutObjectRequest
     */
    private generateObjectParameters(file: string, pathname: string): PutObjectCommandInput {
        const base64Data = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = file.split(';')[0].split('/')[1];
        const filename = `${pathname}/${Randomstring.generate(40)}.${type}`;
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: base64Data,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };
    }

    /**
     * Get File Url
     * @param filename string
     * @param transactionId string
     * @returns string
     */
    public async getFileUrl(filename: string, transactionId: string): Promise<string> {
        try {
            if (!process.env.AWS_BUCKET_NAME) {
                throw new Error("AWS_BUCKET_NAME is not defined");
            }
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `${transactionId}/${filename}`
            };

            const command = new GetObjectCommand(params);
            const url = await getSignedUrl(this.s3, command, { expiresIn: this.PRESIGNED_URL_EXPIRES });
            return url;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Upload File
     * @param file string 
     * @param pathname string
     * @returns void
     */
    public async upload(file: string, pathname: string) {
        try {
            if (!process.env.AWS_BUCKET_NAME) {
                throw new Error("AWS_BUCKET_NAME is not defined");
            }
            const params = this.generateObjectParameters(file, pathname);

            await this.s3.putObject(params);
            return params.Key!.replace(`${pathname}/`, '').split('.');
        } catch (error) {
            throw error;
        }
    }
}