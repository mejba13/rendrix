import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from './logger';

class RedisClient {
  private static instance: Redis | null = null;

  static getInstance(): Redis {
    if (!this.instance) {
      this.instance = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });

      this.instance.on('connect', () => {
        logger.info('Redis connected');
      });

      this.instance.on('error', (error) => {
        logger.error(error, 'Redis connection error');
      });
    }

    return this.instance;
  }

  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
    }
  }
}

export const redis = RedisClient.getInstance();

// Cache utilities
export async function getCache<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export async function setCache(
  key: string,
  value: unknown,
  ttlSeconds?: number
): Promise<void> {
  const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

  if (ttlSeconds) {
    await redis.setex(key, ttlSeconds, stringValue);
  } else {
    await redis.set(key, stringValue);
  }
}

export async function deleteCache(key: string): Promise<void> {
  await redis.del(key);
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Rate limiting utilities
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Remove old entries
  await redis.zremrangebyscore(key, '-inf', windowStart);

  // Count current entries
  const count = await redis.zcard(key);

  if (count >= limit) {
    const oldestEntry = await redis.zrange(key, 0, 0, 'WITHSCORES');
    const resetAt = oldestEntry.length >= 2
      ? parseInt(oldestEntry[1]) + windowSeconds * 1000
      : now + windowSeconds * 1000;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Add new entry
  await redis.zadd(key, now.toString(), now.toString());
  await redis.expire(key, windowSeconds);

  return {
    allowed: true,
    remaining: limit - count - 1,
    resetAt: now + windowSeconds * 1000,
  };
}
