/**
 * Test Redis connection and queue initialization
 * Run: npx ts-node scripts/test-redis.ts
 */

import dotenv from 'dotenv';
dotenv.config();

import { testRedisConnection } from '../src/queues/connection';
import { initializeQueues, getAllQueueStats } from '../src/queues/queues';

async function main() {
  console.log('\n🔍 Testing Redis Connection...\n');

  // Check env var
  const redisUrl = process.env.UPSTASH_REDIS_URL;
  if (!redisUrl) {
    console.error('❌ UPSTASH_REDIS_URL not set in .env');
    process.exit(1);
  }
  console.log('✅ UPSTASH_REDIS_URL found');

  // Test connection
  const connected = await testRedisConnection();
  if (!connected) {
    console.error('❌ Redis connection failed');
    process.exit(1);
  }

  // Initialize queues
  console.log('\n🔍 Initializing queues...\n');
  const queues = initializeQueues();

  if (!queues.retellQueue || !queues.tavusQueue || !queues.ghlQueue) {
    console.error('❌ Queue initialization failed');
    process.exit(1);
  }

  // Get stats
  const stats = await getAllQueueStats();
  console.log('\n📊 Queue Stats:');
  console.log('  Retell:', stats.retell);
  console.log('  Tavus:', stats.tavus);
  console.log('  GHL:', stats.ghl);

  console.log('\n✅ All tests passed!\n');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
