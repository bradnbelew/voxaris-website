/**
 * Redis Connection for BullMQ Queues
 * Re-exports from central redis lib for backwards compatibility
 */

export {
  getQueueConnection,
  getCacheConnection,
  closeRedisConnections
} from '../lib/redis';

// Re-export Redis types
import Redis from 'ioredis';
export { Redis };

// Test connection utility
export async function testRedisConnection(): Promise<boolean> {
  const { getQueueConnection } = await import('../lib/redis');
  const connection = getQueueConnection();

  if (!connection) {
    console.warn('⚠️ Redis not configured');
    return false;
  }

  try {
    const pong = await connection.ping();
    console.log('✅ Redis connected:', pong);
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}
