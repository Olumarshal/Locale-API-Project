import { Redis, RedisOptions } from 'ioredis';
import 'dotenv/config';

class RedisCache {
  private client: Redis;

  constructor() {
    // Connect to your cloud instance of Redis
    const options: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    };
    this.client = new Redis(options);

    this.client.on('connect', () => {
        console.log('Redis database connected');
      });
  }
  

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default RedisCache;
