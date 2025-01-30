import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
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

  async set(key, value, duration) {
    try {
      const valueStr = String(value);
      await this.client.setEx(key, duration, valueStr);
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
}

export default new RedisClient();
