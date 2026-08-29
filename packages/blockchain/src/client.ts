import { createPublicClient, http, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import Redis from 'ioredis';
import { logger } from '@weth/shared';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // Load env variables from root for local dev

let redisInstance: any = null;
const inMemoryCache = new Map<string, { value: string; expiry: number }>();

try {
  if (process.env.REDIS_URL) {
    redisInstance = new (Redis as any)(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
  } else {
    redisInstance = new (Redis as any)('redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
    });
  }
  redisInstance?.on('error', (err: any) => {
    // Suppress spammy connection error logs when Redis is offline
  });
} catch (err) {
  redisInstance = null;
}

export const redis = redisInstance;

/**
 * Resilient Cache Get: tries Redis first, falls back to in-memory cache if Redis is unavailable.
 */
export async function cacheGet(key: string): Promise<string | null> {
  if (redisInstance) {
    try {
      const result = await redisInstance.get(key);
      if (result) return result;
    } catch {
      // Redis offline/unavailable, check in-memory cache
    }
  }
  const mem = inMemoryCache.get(key);
  if (mem && mem.expiry > Date.now()) {
    return mem.value;
  }
  if (mem) inMemoryCache.delete(key);
  return null;
}

/**
 * Resilient Cache Set: tries Redis first, falls back to in-memory cache.
 */
export async function cacheSet(key: string, ttlSeconds: number, value: string): Promise<void> {
  if (redisInstance) {
    try {
      await redisInstance.setex(key, ttlSeconds, value);
      return;
    } catch {
      // Redis offline/unavailable, store in memory
    }
  }
  inMemoryCache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
}

export const viemClient: PublicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
}) as any as PublicClient;
