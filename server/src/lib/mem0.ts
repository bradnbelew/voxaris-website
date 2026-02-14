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

        // Check for do-not-call flag
        const doNotCall = memories.some(m =>
            m.memory.toLowerCase().includes('do not call') ||
            m.metadata?.do_not_call === true
        );

        if (doNotCall) {
            return `
## ⚠️ WARNING - DO NOT CALL
This caller has requested NO FURTHER CONTACT.
DO NOT proceed with this call. End politely and remove from call queue.
`.trim();
        }

        // Categorize memories for better agent context
        const basicInfo: string[] = [];
        const salesSignals: string[] = [];
        const concerns: string[] = [];
        const history: string[] = [];

        memories.forEach(m => {
            const lower = m.memory.toLowerCase();
            if (lower.includes('name is') || lower.includes('address') || lower.includes('email')) {
                basicInfo.push(`- ${m.memory}`);
            } else if (lower.includes('budget') || lower.includes('quote') || lower.includes('competitor') || lower.includes('timeline')) {
                salesSignals.push(`- ${m.memory}`);
            } else if (lower.includes('concern') || lower.includes('objection') || lower.includes('worry')) {
                concerns.push(`- ${m.memory}`);
            } else {
                history.push(`- ${m.memory}`);
            }
        });

        let context = `## Returning Caller - Previous Information\n`;
        context += `This caller has interacted with us before.\n\n`;

        if (basicInfo.length > 0) {
            context += `**Customer Info:**\n${basicInfo.join('\n')}\n\n`;
        }
        if (salesSignals.length > 0) {
            context += `**Sales Intelligence:**\n${salesSignals.join('\n')}\n\n`;
        }
        if (concerns.length > 0) {
            context += `**Address These Concerns:**\n${concerns.join('\n')}\n\n`;
        }
        if (history.length > 0) {
            context += `**History:**\n${history.join('\n')}\n\n`;
        }

        context += `Use this context naturally. Personalize the conversation without saying "I see from our records."`;

        return context.trim();
    }

    /**
     * Extract and store FULL HISTORY from a completed call
     * Captures everything: sentiment, objections, competitors, budget signals, etc.
     */
    async storeCallSummary(
        phone: string,
        callData: {
            // Basic info
            name?: string;
            address?: string;
            email?: string;
            roofIssue?: string;
            // Insurance & damage
            stormDamage?: boolean;
            insuranceClaim?: boolean;
            wantsInsuranceHelp?: boolean;
            insuranceCompany?: string;
            // Appointment
            appointmentScheduled?: boolean;
            appointmentDate?: string;
            officeLocation?: string;
            // Sales signals
            urgencyLevel?: string;
            leadQuality?: string;
            outcome?: string;
            // FULL HISTORY CAPTURE
            sentiment?: 'positive' | 'neutral' | 'negative' | 'hostile';
            objections?: string[];
            competitorsMentioned?: string[];
            previousQuotes?: string[];
            budgetSignals?: string;
            decisionTimeline?: string;
            familySituation?: string;
            concerns?: string[];
            // Transcript excerpt for context
            keyQuotes?: string[];
            // Do not call flag
            doNotCall?: boolean;
            doNotCallReason?: string;
        }
    ): Promise<{ success: boolean; error?: string }> {
        const facts: string[] = [];
        const timestamp = new Date().toISOString().split('T')[0];
        const timeFormatted = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

        // === BASIC INFO ===
        if (callData.name) {
            facts.push(`Customer name is ${callData.name}`);
        }
        if (callData.address) {
            facts.push(`Property address is ${callData.address}`);
        }
        if (callData.email) {
            facts.push(`Email address is ${callData.email}`);
        }
        if (callData.roofIssue) {
            facts.push(`Roof issue: ${callData.roofIssue}`);
        }

        // === INSURANCE & DAMAGE ===
        if (callData.stormDamage) {
            facts.push(`Property has STORM DAMAGE (reported ${timestamp})`);
        }
        if (callData.insuranceClaim) {
            facts.push(`Insurance claim has been filed`);
            if (callData.insuranceCompany) {
                facts.push(`Insurance company: ${callData.insuranceCompany}`);
            }
        }
        if (callData.wantsInsuranceHelp) {
            facts.push(`Customer wants help with insurance claim process`);
        }

        // === APPOINTMENT ===
        if (callData.appointmentScheduled && callData.appointmentDate) {
            facts.push(`Inspection scheduled for ${callData.appointmentDate} at ${callData.officeLocation || 'TBD'}`);
        }

        // === SALES SIGNALS ===
        if (callData.urgencyLevel) {
            facts.push(`Urgency level: ${callData.urgencyLevel}`);
        }
        if (callData.leadQuality) {
            facts.push(`Lead quality: ${callData.leadQuality}`);
        }
        if (callData.outcome) {
            facts.push(`Call outcome on ${timeFormatted}: ${callData.outcome}`);
        }

        // === FULL HISTORY - SENTIMENT ===
        if (callData.sentiment) {
            facts.push(`Customer sentiment: ${callData.sentiment}`);
            if (callData.sentiment === 'hostile' || callData.sentiment === 'negative') {
                facts.push(`⚠️ Customer was ${callData.sentiment} during call on ${timestamp}`);
            }
        }

        // === FULL HISTORY - OBJECTIONS ===
        if (callData.objections && callData.objections.length > 0) {
            facts.push(`Objections raised: ${callData.objections.join('; ')}`);
        }

        // === FULL HISTORY - COMPETITORS ===
        if (callData.competitorsMentioned && callData.competitorsMentioned.length > 0) {
            facts.push(`Competitors mentioned: ${callData.competitorsMentioned.join(', ')}`);
        }

        // === FULL HISTORY - PREVIOUS QUOTES ===
        if (callData.previousQuotes && callData.previousQuotes.length > 0) {
            facts.push(`Previous quotes received: ${callData.previousQuotes.join('; ')}`);
        }

        // === FULL HISTORY - BUDGET ===
        if (callData.budgetSignals) {
            facts.push(`Budget signals: ${callData.budgetSignals}`);
        }

        // === FULL HISTORY - DECISION TIMELINE ===
        if (callData.decisionTimeline) {
            facts.push(`Decision timeline: ${callData.decisionTimeline}`);
        }

        // === FULL HISTORY - FAMILY SITUATION ===
        if (callData.familySituation) {
            facts.push(`Family situation: ${callData.familySituation}`);
        }

        // === CONCERNS ===
        if (callData.concerns && callData.concerns.length > 0) {
            facts.push(`Concerns mentioned: ${callData.concerns.join(', ')}`);
        }

        // === KEY QUOTES ===
        if (callData.keyQuotes && callData.keyQuotes.length > 0) {
            callData.keyQuotes.forEach((quote, i) => {
                facts.push(`Customer said: "${quote}"`);
            });
        }

        // === DO NOT CALL FLAG ===
        if (callData.doNotCall) {
            facts.push(`🚫 DO NOT CALL - Customer requested no further contact (${timestamp})`);
            if (callData.doNotCallReason) {
                facts.push(`Do not call reason: ${callData.doNotCallReason}`);
            }
        }

        if (facts.length === 0) {
            return { success: true }; // Nothing to store
        }

        const result = await this.addByPhone(phone, facts, {
            call_date: timestamp,
            call_type: 'roofing_inquiry',
            sentiment: callData.sentiment,
            do_not_call: callData.doNotCall || false,
            lead_quality: callData.leadQuality
        });

        return { success: result.success, error: result.error };
    }

    /**
     * Check if a phone number is flagged as "do not call"
     */
    async isDoNotCall(phone: string): Promise<boolean> {
        const normalizedPhone = this.normalizePhone(phone);
        const memories = await this.getMemories({ user_id: normalizedPhone });

        if (!memories.success || !memories.memories) {
            return false;
        }

        // Check if any memory contains do not call flag
        return memories.memories.some(m =>
            m.memory.toLowerCase().includes('do not call') ||
            m.memory.toLowerCase().includes('stop calling') ||
            m.memory.toLowerCase().includes('never call') ||
            m.metadata?.do_not_call === true
        );
    }

    /**
     * Flag a phone number as "do not call"
     */
    async flagDoNotCall(phone: string, reason?: string): Promise<{ success: boolean; error?: string }> {
        const facts = [
            `🚫 DO NOT CALL - Flagged on ${new Date().toISOString().split('T')[0]}`,
            reason ? `Reason: ${reason}` : 'Reason: Customer requested no further contact'
        ];

        const result = await this.addByPhone(phone, facts, {
            do_not_call: true,
            flagged_date: new Date().toISOString()
        });

        logger.info(`🚫 Flagged ${phone} as DO NOT CALL`);
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
