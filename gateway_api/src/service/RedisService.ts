import { config } from "dotenv";
import { RedisClientType, createClient } from "redis";

config();

class RedisService {
    client: RedisClientType;
    
    constructor() {
        this.client = createClient({
            socket: {
                host: process.env.REDIS_HOST,
            }
        });
    }

    async store (tagName: string, id: string, data:object, expired?: number) {
        await this.client.connect();
        if (expired) {
            await this.client.setEx(`${tagName}-${id}`, expired, JSON.stringify(data));
        }
        else {
            await this.client.set(`${tagName}-${id}`, JSON.stringify(data));
        }
        await this.client.disconnect();
    }

    async get (tagName: string, id: string): Promise<any> {
        await this.client.connect();
        const data = await this.client.get(`${tagName}-${id}`);
        await this.client.disconnect();
        if (typeof data === 'string') {
            return JSON.parse(data);
        }
        return data;
    }
}

export default new RedisService();
