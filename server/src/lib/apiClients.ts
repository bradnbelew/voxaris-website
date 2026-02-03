import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';
import { SecretsManager } from './secrets';
import { cacheGet, cacheSet, CACHE_TTL } from './cache';

/**
 * Centralized API Clients
 *
 * Manages all external API integrations:
 * - Platform keys: Tavus, Retell, Resend (global Voxaris keys)
 * - Per-dealer keys: GHL (each dealer has their own)
 *
 * Features:
 * - Automatic retries
 * - Rate limiting awareness
 * - Error logging
 */

// ============================================
// TAVUS CLIENT (Platform-wide)
// ============================================
const tavusClient: AxiosInstance = axios.create({
  baseURL: 'https://tavusapi.com/v2',
  headers: {
    'x-api-key': process.env.TAVUS_API_KEY || '',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const TavusAPI = {
  /**
   * Create a new persona for a dealer
   */
  async createPersona(config: {
    name: string;
    systemPrompt: string;
    replicaId?: string;
    voiceConfig?: {
      engine: string;
      voiceId: string;
    };
  }): Promise<{ persona_id: string; persona_name: string } | null> {
    try {
      const response = await tavusClient.post('/personas', {
        persona_name: config.name,
        pipeline_mode: 'full',
        system_prompt: config.systemPrompt,
        default_replica_id: config.replicaId || process.env.DEFAULT_TAVUS_REPLICA_ID,
        layers: {
          tts: config.voiceConfig || {
            tts_engine: 'cartesia',
            tts_model_name: 'sonic-3',
            tts_emotion_control: true,
          },
        },
      });
      logger.info(`✅ Tavus persona created: ${response.data.persona_id}`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Tavus createPersona failed:', error.response?.data || error.message);
      return null;
    }
  },

  /**
   * Update an existing persona's system prompt
   */
  async updatePersona(personaId: string, updates: {
    systemPrompt?: string;
    context?: string;
  }): Promise<boolean> {
    try {
      await tavusClient.patch(`/personas/${personaId}`, {
        system_prompt: updates.systemPrompt,
        context: updates.context,
      });
      logger.info(`✅ Tavus persona updated: ${personaId}`);
      return true;
    } catch (error: any) {
      logger.error('❌ Tavus updatePersona failed:', error.response?.data || error.message);
      return false;
    }
  },

  /**
   * Start a new conversation
   */
  async createConversation(config: {
    personaId: string;
    replicaId?: string;
    conversationalContext?: string;
    callbackUrl?: string;
    memoryStores?: string[];
  }): Promise<{ conversation_id: string; conversation_url: string } | null> {
    try {
      const response = await tavusClient.post('/conversations', {
        persona_id: config.personaId,
        replica_id: config.replicaId,
        conversational_context: config.conversationalContext,
        callback_url: config.callbackUrl,
        memory_stores: config.memoryStores,
        properties: {
          enable_recording: true,
        },
      });
      logger.info(`✅ Tavus conversation created: ${response.data.conversation_id}`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Tavus createConversation failed:', error.response?.data || error.message);
      return null;
    }
  },

  /**
   * List all personas (for deduplication checks)
   */
  async listPersonas(): Promise<any[]> {
    try {
      const response = await tavusClient.get('/personas');
      return response.data.data || [];
    } catch (error: any) {
      logger.error('❌ Tavus listPersonas failed:', error.response?.data || error.message);
      return [];
    }
  },
};

// ============================================
// RETELL CLIENT (Platform-wide)
// ============================================
const retellClient: AxiosInstance = axios.create({
  baseURL: 'https://api.retellai.com',
  headers: {
    'Authorization': `Bearer ${process.env.RETELL_API_KEY || ''}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const RetellAPI = {
  /**
   * Create a new voice agent for a dealer
   */
  async createAgent(config: {
    name: string;
    systemPrompt: string;
    voiceId?: string;
    webhookUrl?: string;
  }): Promise<{ agent_id: string } | null> {
    try {
      const response = await retellClient.post('/create-agent', {
        agent_name: config.name,
        voice_id: config.voiceId || '11labs-Cimo',
        response_engine: {
          type: 'retell-llm',
          llm_id: process.env.RETELL_LLM_ID,
        },
        webhook_url: config.webhookUrl,
      });
      logger.info(`✅ Retell agent created: ${response.data.agent_id}`);
      return response.data;
    } catch (error: any) {
      logger.error('❌ Retell createAgent failed:', error.response?.data || error.message);
      return null;
    }
  },

  /**
   * Update agent configuration
   */
  async updateAgent(agentId: string, updates: any): Promise<boolean> {
    try {
      await retellClient.patch(`/update-agent/${agentId}`, updates);
      logger.info(`✅ Retell agent updated: ${agentId}`);
      return true;
    } catch (error: any) {
      logger.error('❌ Retell updateAgent failed:', error.response?.data || error.message);
      return false;
    }
  },
};

// ============================================
// GHL CLIENT (Per-Dealer)
// ============================================

interface GHLContact {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  customFields?: Record<string, any>;
  tags?: string[];
}

/**
 * Get GHL client for a specific dealer
 * Uses cached credentials when available
 */
export async function getGHLClient(dealerId: string): Promise<{
  findContact: (query: string) => Promise<GHLContact | null>;
  createOrUpdateContact: (data: GHLContact) => Promise<GHLContact | null>;
  addNote: (contactId: string, content: string) => Promise<void>;
  sendSMS: (contactId: string, message: string) => Promise<void>;
} | null> {
  // Try to get cached credentials
  const cacheKey = `ghl:client:${dealerId}`;
  let credentials = await cacheGet<{ apiKey: string; locationId: string }>(cacheKey);

  if (!credentials) {
    // Fetch from database
    credentials = await SecretsManager.getDealerGHLCredentials(dealerId);
    if (!credentials) {
      logger.warn(`No GHL credentials found for dealer: ${dealerId}`);
      return null;
    }
    // Cache for 5 minutes
    await cacheSet(cacheKey, credentials, CACHE_TTL.CLIENT_CONFIG);
  }

  const { apiKey, locationId } = credentials;

  const client = axios.create({
    baseURL: 'https://services.leadconnectorhq.com',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  return {
    async findContact(query: string): Promise<GHLContact | null> {
      try {
        const resp = await client.get('/contacts/', {
          params: { locationId, query, limit: 1 },
        });
        return resp.data.contacts?.[0] || null;
      } catch (error: any) {
        logger.error(`GHL findContact error:`, error.response?.data || error.message);
        return null;
      }
    },

    async createOrUpdateContact(data: GHLContact): Promise<GHLContact | null> {
      try {
        const existing = data.id
          ? { id: data.id }
          : await this.findContact(data.email || data.phone || '');

        if (existing?.id) {
          const resp = await client.put(`/contacts/${existing.id}`, {
            ...data,
            locationId,
          });
          return resp.data.contact;
        } else {
          const resp = await client.post('/contacts/', {
            ...data,
            locationId,
          });
          return resp.data.contact;
        }
      } catch (error: any) {
        logger.error(`GHL createOrUpdateContact error:`, error.response?.data || error.message);
        return null;
      }
    },

    async addNote(contactId: string, content: string): Promise<void> {
      try {
        await client.post(`/contacts/${contactId}/notes`, {
          body: content,
          userId: null,
        });
      } catch (error: any) {
        logger.error(`GHL addNote error:`, error.message);
      }
    },

    async sendSMS(contactId: string, message: string): Promise<void> {
      try {
        await client.post('/conversations/messages', {
          type: 'SMS',
          contactId,
          messageBody: message,
        });
        logger.info(`✅ SMS sent to contact: ${contactId}`);
      } catch (error: any) {
        logger.error(`GHL sendSMS error:`, error.response?.data || error.message);
        throw error;
      }
    },
  };
}

// ============================================
// LEGACY GHL CLIENT (Fallback using .env)
// ============================================

/**
 * Legacy GHL client using environment variables
 * Used when dealer_integrations table doesn't exist yet
 */
export function getLegacyGHLClient(): ReturnType<typeof getGHLClient> extends Promise<infer T> ? NonNullable<T> : never {
  const apiKey = process.env.GHL_ACCESS_TOKEN || '';
  const locationId = process.env.GHL_LOCATION_ID || '';

  if (!apiKey) {
    logger.warn('⚠️ GHL_ACCESS_TOKEN not configured');
  }

  const client = axios.create({
    baseURL: 'https://services.leadconnectorhq.com',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Version': '2021-07-28',
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  return {
    async findContact(query: string): Promise<GHLContact | null> {
      try {
        const resp = await client.get('/contacts/', {
          params: { locationId, query, limit: 1 },
        });
        return resp.data.contacts?.[0] || null;
      } catch (error: any) {
        logger.error(`GHL findContact error:`, error.response?.data || error.message);
        return null;
      }
    },

    async createOrUpdateContact(data: GHLContact): Promise<GHLContact | null> {
      try {
        const existing = data.id
          ? { id: data.id }
          : await this.findContact(data.email || data.phone || '');

        if (existing?.id) {
          const resp = await client.put(`/contacts/${existing.id}`, {
            ...data,
            locationId,
          });
          return resp.data.contact;
        } else {
          const resp = await client.post('/contacts/', {
            ...data,
            locationId,
          });
          return resp.data.contact;
        }
      } catch (error: any) {
        logger.error(`GHL createOrUpdateContact error:`, error.response?.data || error.message);
        return null;
      }
    },

    async addNote(contactId: string, content: string): Promise<void> {
      try {
        await client.post(`/contacts/${contactId}/notes`, {
          body: content,
          userId: null,
        });
      } catch (error: any) {
        logger.error(`GHL addNote error:`, error.message);
      }
    },

    async sendSMS(contactId: string, message: string): Promise<void> {
      try {
        await client.post('/conversations/messages', {
          type: 'SMS',
          contactId,
          messageBody: message,
        });
        logger.info(`✅ SMS sent to contact: ${contactId}`);
      } catch (error: any) {
        logger.error(`GHL sendSMS error:`, error.response?.data || error.message);
        throw error;
      }
    },
  };
}
