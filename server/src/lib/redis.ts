import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Upstash Redis connection for BullMQ queues and caching
// Uses UPSTASH_REDIS_URL format: redis://default:xxx@xxx.upstash.io:6379

const REDIS_URL = process.env.UPSTASH_REDIS_URL || process.env.REDIS_URL;

if (!REDIS_URL) {
  console.warn('⚠️ REDIS_URL not found. Queue system and caching will be disabled.');
}

// Create connection for BullMQ (requires maxRetriesPerRequest: null)
export const createQueueConnection = () => {
  if (!REDIS_URL) return null;

  return new Redis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
    tls: {}, // Upstash requires TLS
    retryStrategy: (times) => {
      if (times > 3) {
        console.error('❌ Redis connection failed after 3 retries');
        return null; // Stop retrying
      }
      return Math.min(times * 200, 2000); // Exponential backoff
    }
  });
};

// Create connection for caching (standard connection)
export const createCacheConnection = () => {
  if (!REDIS_URL) return null;

  return new Redis(REDIS_URL, {
    enableReadyCheck: false,
    tls: {}, // Upstash requires TLS
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    }
  });
};

// Singleton connections
let queueConnection: Redis | null = null;
let cacheConnection: Redis | null = null;

export const getQueueConnection = () => {
  if (!queueConnection && REDIS_URL) {
    queueConnection = createQueueConnection();
    queueConnection?.on('error', (err) => console.error('Redis Queue Error:', err));
    queueConnection?.on('connect', () => console.log('✅ Redis Queue Connected'));
  }
  return queueConnection;
};

export const getCacheConnection = () => {
  if (!cacheConnection && REDIS_URL) {
    cacheConnection = createCacheConnection();
    cacheConnection?.on('error', (err) => console.error('Redis Cache Error:', err));
    cacheConnection?.on('connect', () => console.log('✅ Redis Cache Connected'));
  }
  return cacheConnection;
};

// Graceful shutdown
export const closeRedisConnections = async () => {
  if (queueConnection) {
    await queueConnection.quit();
    queueConnection = null;
  }
  if (cacheConnection) {
    await cacheConnection.quit();
    cacheConnection = null;
  }
  console.log('✅ Redis connections closed');
};
