import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.connect();
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error('Error fetching data from Redis:', err);
      return null;
    }
  }

  async set(key, value, duration = 0) {
    try {
      const valueStr = String(value);
      if (duration > 0) {
        await this.client.setEx(key, duration, valueStr); // set with expiration
      } else {
        await this.client.set(key, valueStr); // set without expiration
      }
    } catch (err) {
      console.error('Error setting data in Redis:', err);
    }
  }

  async del(key) {
    try {
      const result = await this.client.del(key);
      if (result === 1) {
        console.log(`Key ${key} deleted successfully`);
      } else {
        console.log(`Key ${key} not found`);
      }
    } catch (err) {
      console.error('Error deleting key from Redis:', err);
    }
  }

  disconnect() {
    this.client.disconnect();
  }
}

const redisClient = new RedisClient();
export default redisClient;
