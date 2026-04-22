import Redis from 'ioredis';
import { config } from './env.js';

let redisClient = null;

export const getRedisClient = () => {
  if (!redisClient && config.redisUrl) {
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
    });

    redisClient.on('connect', () => console.log('Redis connected'));
    redisClient.on('error', (err) => {
      console.warn('Redis error (non-fatal):', err.message);
      redisClient = null;
    });
  }
  return redisClient;
};

export const cacheGet = async (key) => {
  try {
    const client = getRedisClient();
    if (!client) return null;
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttlSeconds = 300) => {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.setex(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // non-fatal
  }
};

export const cacheDel = async (key) => {
  try {
    const client = getRedisClient();
    if (!client) return;
    await client.del(key);
  } catch {
    // non-fatal
  }
};
