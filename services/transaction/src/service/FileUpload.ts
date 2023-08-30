import { PutObjectCommandInput, S3 } from "@aws-sdk/client-s3";
import { config } from "dotenv";
import Randomstring from "randomstring";

export default class FileUpload {
    private readonly s3: S3;

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
    private generateObjectParameters(file: string): PutObjectCommandInput {
        const base64Data = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const type = file.split(';')[0].split('/')[1];
        const filename = `${Randomstring.generate(40)}.${type}`;
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename,
            Body: base64Data,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`
        };
    }

    /**
     * Upload File
     * @param file string 
     * @param pathname string
     * @returns void
     */
    public async upload(file: string) {
        try {
            if (!process.env.AWS_BUCKET_NAME) {
                throw new Error("AWS_BUCKET_NAME is not defined");
            }
            const params = this.generateObjectParameters(file);

            await this.s3.putObject(params);
            return [params.Key?.split('.')[0], params.ContentType?.split('/')[1]];
        } catch (error) {
            throw error;
        }
    }
}