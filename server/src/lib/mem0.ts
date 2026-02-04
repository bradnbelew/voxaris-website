/**
 * Mem0 - Universal Memory Layer for AI Agents
 *
 * Provides persistent memory across conversations, allowing agents
 * to remember returning callers and personalize interactions.
 *
 * Documentation: https://docs.mem0.ai/
 */

import axios, { AxiosInstance } from 'axios';
import { logger } from './logger';

// ============================================================================
// TYPES
// ============================================================================

export interface Memory {
    id: string;
    memory: string;
    user_id?: string;
    agent_id?: string;
    metadata?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}

export interface AddMemoryOptions {
    user_id?: string;
    agent_id?: string;
    metadata?: Record<string, any>;
}

export interface SearchMemoryOptions {
    user_id?: string;
    agent_id?: string;
    limit?: number;
}

export interface MemorySearchResult {
    id: string;
    memory: string;
    score: number;
    metadata?: Record<string, any>;
}

// ============================================================================
// MEM0 SERVICE
// ============================================================================

class Mem0Service {
    private client: AxiosInstance;
    private apiKey: string;
    private baseUrl: string = 'https://api.mem0.ai/v1';

    constructor() {
        this.apiKey = process.env.MEM0_API_KEY || '';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Token ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Check if Mem0 is configured
     */
    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Add memories for a user (typically by phone number)
     * Mem0 automatically extracts facts from the content provided
     */
    async addMemory(
        content: string | string[],
        options: AddMemoryOptions = {}
    ): Promise<{ success: boolean; memories?: Memory[]; error?: string }> {
        if (!this.isConfigured()) {
            logger.warn('⚠️ MEM0_API_KEY not configured. Memory not stored.');
            return { success: false, error: 'MEM0_API_KEY not configured' };
        }

        try {
            const messages = Array.isArray(content)
                ? content.map(c => ({ role: 'user', content: c }))
                : [{ role: 'user', content }];

            const response = await this.client.post('/memories/', {
                messages,
                user_id: options.user_id,
                agent_id: options.agent_id,
                metadata: options.metadata
            });

            logger.info(`✅ Mem0: Stored ${response.data.length || 1} memories for user ${options.user_id}`);
            return { success: true, memories: response.data };

        } catch (error: any) {
            logger.error('❌ Mem0 addMemory error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.detail || error.message };
        }
    }

    /**
     * Get all memories for a user
     */
    async getMemories(
        options: SearchMemoryOptions = {}
    ): Promise<{ success: boolean; memories?: Memory[]; error?: string }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'MEM0_API_KEY not configured' };
        }

        try {
            const params = new URLSearchParams();
            if (options.user_id) params.append('user_id', options.user_id);
            if (options.agent_id) params.append('agent_id', options.agent_id);
            if (options.limit) params.append('limit', options.limit.toString());

            const response = await this.client.get(`/memories/?${params.toString()}`);

            logger.info(`✅ Mem0: Retrieved ${response.data.length || 0} memories for user ${options.user_id}`);
            return { success: true, memories: response.data };

        } catch (error: any) {
            logger.error('❌ Mem0 getMemories error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.detail || error.message };
        }
    }

    /**
     * Search memories semantically
     */
    async searchMemories(
        query: string,
        options: SearchMemoryOptions = {}
    ): Promise<{ success: boolean; results?: MemorySearchResult[]; error?: string }> {
        if (!this.isConfigured()) {
            return { success: false, error: 'MEM0_API_KEY not configured' };
        }

        try {
            const response = await this.client.post('/memories/search/', {
                query,
                user_id: options.user_id,
                agent_id: options.agent_id,
                limit: options.limit || 10
            });

            logger.info(`✅ Mem0: Found ${response.data.length || 0} matching memories`);
            return { success: true, results: response.data };

        } catch (error: any) {
            logger.error('❌ Mem0 searchMemories error:', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.detail || error.message };
        }
    }

    /**
     * Get memory by phone number (our primary use case)
     * Formats phone number as user_id
     */
    async getByPhone(phone: string): Promise<{ success: boolean; memories?: Memory[]; error?: string }> {
        const normalizedPhone = this.normalizePhone(phone);
        return this.getMemories({ user_id: normalizedPhone });
    }

    /**
     * Add memory by phone number
     */
    async addByPhone(
        phone: string,
        content: string | string[],
        metadata?: Record<string, any>
    ): Promise<{ success: boolean; memories?: Memory[]; error?: string }> {
        const normalizedPhone = this.normalizePhone(phone);
        return this.addMemory(content, {
            user_id: normalizedPhone,
            metadata: {
                ...metadata,
                phone: normalizedPhone,
                source: 'roofing_voice_agent'
            }
        });
    }

    /**
     * Format memories as context string for the agent
     */
    formatMemoriesForAgent(memories: Memory[]): string {
        if (!memories || memories.length === 0) {
            return '';
        }

        const memoryLines = memories.map(m => `- ${m.memory}`).join('\n');
        return `
## Returning Caller - Previous Information
This caller has interacted with us before. Here's what we know:
${memoryLines}

Use this context naturally in the conversation. Don't explicitly mention "I see from our records" -
just use the information to provide personalized service.
`.trim();
    }

    /**
     * Extract and store key facts from a completed call
     */
    async storeCallSummary(
        phone: string,
        callData: {
            name?: string;
            address?: string;
            roofIssue?: string;
            stormDamage?: boolean;
            insuranceClaim?: boolean;
            appointmentScheduled?: boolean;
            appointmentDate?: string;
            outcome?: string;
            concerns?: string[];
        }
    ): Promise<{ success: boolean; error?: string }> {
        const facts: string[] = [];
        const timestamp = new Date().toISOString().split('T')[0];

        if (callData.name) {
            facts.push(`Customer name is ${callData.name}`);
        }
        if (callData.address) {
            facts.push(`Property address is ${callData.address}`);
        }
        if (callData.roofIssue) {
            facts.push(`Roof issue: ${callData.roofIssue}`);
        }
        if (callData.stormDamage) {
            facts.push(`Property has storm damage (reported ${timestamp})`);
        }
        if (callData.insuranceClaim) {
            facts.push(`Insurance claim has been filed`);
        }
        if (callData.appointmentScheduled && callData.appointmentDate) {
            facts.push(`Inspection scheduled for ${callData.appointmentDate}`);
        }
        if (callData.outcome) {
            facts.push(`Last call outcome: ${callData.outcome}`);
        }
        if (callData.concerns && callData.concerns.length > 0) {
            facts.push(`Concerns mentioned: ${callData.concerns.join(', ')}`);
        }

        if (facts.length === 0) {
            return { success: true }; // Nothing to store
        }

        const result = await this.addByPhone(phone, facts, {
            call_date: timestamp,
            call_type: 'roofing_inquiry'
        });

        return { success: result.success, error: result.error };
    }

    /**
     * Normalize phone number to E.164 format (remove formatting)
     */
    private normalizePhone(phone: string): string {
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');

        // If it's 10 digits, assume US and add +1
        if (digits.length === 10) {
            return `+1${digits}`;
        }

        // If it already has country code
        if (digits.length === 11 && digits.startsWith('1')) {
            return `+${digits}`;
        }

        // Otherwise just prefix with +
        return `+${digits}`;
    }
}

// Export singleton instance
export const mem0 = new Mem0Service();
