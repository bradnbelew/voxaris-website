import { getCacheConnection } from './redis';
import { logger } from './logger';

/**
 * Cache utilities with TTL management
 *
 * Features:
 * - Cache-aside pattern
 * - Idempotency key tracking
 * - Cache warming
 * - Invalidation
 */

// TTL constants (in seconds)
export const CACHE_TTL = {
  CLIENT_CONFIG: 300,      // 5 minutes
  SYSTEM_PROMPT: 300,      // 5 minutes
  GHL_CONTACT: 120,        // 2 minutes
  IDEMPOTENCY_KEY: 86400,  // 24 hours (prevent duplicate processing)
  RATE_LIMIT: 60,          // 1 minute
};

/**
 * Get a value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getCacheConnection();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch (error: any) {
    logger.warn(`Cache get error for ${key}:`, error.message);
    return null;
  }
}

/**
 * Set a value in cache with TTL
 */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const redis = getCacheConnection();
  if (!redis) return;

  try {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } catch (error: any) {
    logger.warn(`Cache set error for ${key}:`, error.message);
  }
}

/**
 * Delete a key from cache (for invalidation)
 */
export async function cacheDelete(key: string): Promise<void> {
  const redis = getCacheConnection();
  if (!redis) return;

  try {
    await redis.del(key);
    logger.debug(`Cache invalidated: ${key}`);
  } catch (error: any) {
    logger.warn(`Cache delete error for ${key}:`, error.message);
  }
}

/**
 * Delete keys matching a pattern (for bulk invalidation)
 */
export async function cacheDeletePattern(pattern: string): Promise<number> {
  const redis = getCacheConnection();
  if (!redis) return 0;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Cache invalidated ${keys.length} keys matching: ${pattern}`);
    }
    return keys.length;
  } catch (error: any) {
    logger.warn(`Cache delete pattern error for ${pattern}:`, error.message);
    return 0;
  }
}

// ============================================
// IDEMPOTENCY KEY SYSTEM
// ============================================

/**
 * Check if a webhook has already been processed
 * Returns true if already processed (should skip)
 */
export async function isAlreadyProcessed(idempotencyKey: string): Promise<boolean> {
  const redis = getCacheConnection();
  if (!redis) return false; // If no Redis, allow processing

  try {
    const exists = await redis.exists(`processed:${idempotencyKey}`);
    return exists === 1;
  } catch (error: any) {
    logger.warn(`Idempotency check error:`, error.message);
    return false; // On error, allow processing (better to duplicate than lose)
  }
}

/**
 * Mark a webhook as processed (24hr TTL)
 */
export async function markAsProcessed(idempotencyKey: string): Promise<void> {
  const redis = getCacheConnection();
  if (!redis) return;

  try {
    await redis.setex(
      `processed:${idempotencyKey}`,
      CACHE_TTL.IDEMPOTENCY_KEY,
      JSON.stringify({ processedAt: new Date().toISOString() })
    );
  } catch (error: any) {
    logger.warn(`Failed to mark as processed:`, error.message);
  }
}

/**
 * Generate idempotency key from webhook event
 */
export function generateIdempotencyKey(
  source: 'tavus' | 'retell' | 'ghl',
  eventType: string,
  eventId: string,
  timestamp?: string | number
): string {
  const ts = timestamp || Date.now();
  return `${source}:${eventType}:${eventId}:${ts}`;
}

// ============================================
// CACHE KEYS
// ============================================

export const cacheKeys = {
  clientConfig: (clientId: string) => `client:${clientId}:config`,
  clientByRetellAgent: (agentId: string) => `client:retell:${agentId}`,
  clientByTavusPersona: (personaId: string) => `client:tavus:${personaId}`,
  systemPrompt: (clientId: string) => `prompt:${clientId}`,
  ghlContact: (contactId: string) => `ghl:contact:${contactId}`,
};

// ============================================
// CACHE WARMING
// ============================================

import { supabase } from './supabase';

/**
 * Pre-populate cache with active client configs on startup
 */
export async function warmClientCache(): Promise<void> {
  const redis = getCacheConnection();
  if (!redis) {
    logger.warn('⚠️ Cannot warm cache: Redis not available');
    return;
  }

  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('active', true);

    if (error) {
      logger.error('Failed to fetch clients for cache warming:', error);
      return;
    }

    if (!clients?.length) {
      logger.info('No active clients to warm cache');
      return;
    }

    const pipeline = redis.pipeline();

    for (const client of clients) {
      // Cache by ID
      pipeline.setex(
        cacheKeys.clientConfig(client.id),
        CACHE_TTL.CLIENT_CONFIG,
        JSON.stringify(client)
      );

      // Cache by Retell Agent ID
      if (client.retell_agent_id) {
        pipeline.setex(
          cacheKeys.clientByRetellAgent(client.retell_agent_id),
          CACHE_TTL.CLIENT_CONFIG,
          JSON.stringify(client)
        );
      }

      // Cache by Tavus Persona ID
      if (client.tavus_persona_id) {
        pipeline.setex(
          cacheKeys.clientByTavusPersona(client.tavus_persona_id),
          CACHE_TTL.CLIENT_CONFIG,
          JSON.stringify(client)
        );
      }
    }

    await pipeline.exec();
    logger.info(`✅ Warmed cache for ${clients.length} active clients`);
  } catch (error: any) {
    logger.error('Cache warming failed:', error.message);
  }
}

// ============================================
// CACHE INVALIDATION API
// ============================================

/**
 * Invalidate all cache entries for a specific client
 * Call this when client config is updated
 */
export async function invalidateClientCache(
  clientId: string,
  retellAgentId?: string,
  tavusPersonaId?: string
): Promise<void> {
  await Promise.all([
    cacheDelete(cacheKeys.clientConfig(clientId)),
    retellAgentId ? cacheDelete(cacheKeys.clientByRetellAgent(retellAgentId)) : Promise.resolve(),
    tavusPersonaId ? cacheDelete(cacheKeys.clientByTavusPersona(tavusPersonaId)) : Promise.resolve(),
  ]);
  logger.info(`✅ Cache invalidated for client: ${clientId}`);
}
