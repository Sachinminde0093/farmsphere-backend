import { createClient, RedisClientType } from 'redis';

class RedisCon {
    private static instance: RedisCon;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient();
        this.connect();
        this.client.on('error', err => {
            console.log('Redis Client Error', err);
        });
    }

    static getInstance(): RedisCon {
        if (!RedisCon.instance) {
            RedisCon.instance = new RedisCon();
        }
        return RedisCon.instance;
    }

    async connect(): Promise<void> {
        await this.client.connect();
        // await this.client.set('connect', 'connected to Redis database!');
        const value = await this.client.get('connect');
        console.log(value)
    }

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async remove(key: string): Promise<void> {
        await this.client.del(key).then(
            (data)=>{
                return true;
            }
        ).catch(
            (err:any) => {
                return false;
            }
        );
    }

    
    async close(): Promise<void> {
        await this.client.quit();
        // await this.client.disconnect();
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}

export default RedisCon;
