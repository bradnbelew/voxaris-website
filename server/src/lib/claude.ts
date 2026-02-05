/**
 * Claude AI Integration - Opus 4.6
 *
 * Provides Claude AI capabilities with:
 * - Adaptive thinking (extended thinking for complex tasks)
 * - Effort controls (low/medium/high/max)
 * - 1M context window support
 * - 128K output tokens
 *
 * Documentation: https://docs.anthropic.com/
 */

import Anthropic from '@anthropic-ai/sdk';
import { logger } from './logger';

// ============================================================================
// TYPES
// ============================================================================

export type EffortLevel = 'low' | 'medium' | 'high' | 'max';

export interface ClaudeMessageOptions {
    model?: 'claude-opus-4-6-20260205' | 'claude-sonnet-4-5-20260115' | 'claude-haiku-3-5-20241022';
    maxTokens?: number;
    temperature?: number;
    effort?: EffortLevel;
    systemPrompt?: string;
    enableThinking?: boolean;
    thinkingBudget?: number;
}

export interface ClaudeResponse {
    success: boolean;
    content?: string;
    thinking?: string;
    usage?: {
        inputTokens: number;
        outputTokens: number;
        thinkingTokens?: number;
    };
    error?: string;
}

export interface ClaudeStreamCallbacks {
    onThinking?: (text: string) => void;
    onContent?: (text: string) => void;
    onComplete?: (response: ClaudeResponse) => void;
    onError?: (error: Error) => void;
}

// Effort level to thinking budget mapping
const EFFORT_BUDGETS: Record<EffortLevel, number> = {
    low: 1024,      // Quick responses, minimal reasoning
    medium: 4096,   // Balanced reasoning
    high: 10000,    // Deep analysis
    max: 32000      // Maximum reasoning for complex tasks
};

// ============================================================================
// CLAUDE SERVICE
// ============================================================================

class ClaudeService {
    private client: Anthropic;
    private defaultModel: string = 'claude-opus-4-6-20260205';

    constructor() {
        this.client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY || ''
        });
    }

    /**
     * Check if Claude is configured
     */
    isConfigured(): boolean {
        return !!process.env.ANTHROPIC_API_KEY;
    }

    /**
     * Send a message to Claude with optional extended thinking
     */
    async message(
        prompt: string,
        options: ClaudeMessageOptions = {}
    ): Promise<ClaudeResponse> {
        if (!this.isConfigured()) {
            logger.warn('⚠️ ANTHROPIC_API_KEY not configured');
            return { success: false, error: 'ANTHROPIC_API_KEY not configured' };
        }

        const {
            model = this.defaultModel,
            maxTokens = 8192,
            temperature = 1, // Required for extended thinking
            effort = 'medium',
            systemPrompt,
            enableThinking = true,
            thinkingBudget
        } = options;

        try {
            const thinkingTokens = thinkingBudget || EFFORT_BUDGETS[effort];

            // Build request parameters
            const params: Anthropic.MessageCreateParams = {
                model,
                max_tokens: maxTokens + (enableThinking ? thinkingTokens : 0),
                messages: [{ role: 'user', content: prompt }]
            };

            // Add system prompt if provided
            if (systemPrompt) {
                params.system = systemPrompt;
            }

            // Add extended thinking if enabled (Opus 4.6 feature)
            if (enableThinking && model.includes('opus')) {
                params.thinking = {
                    type: 'enabled',
                    budget_tokens: thinkingTokens
                };
                // Temperature must be 1 for extended thinking
                params.temperature = 1;
            } else if (temperature !== undefined) {
                params.temperature = temperature;
            }

            logger.info(`🧠 Claude ${model} - Effort: ${effort}, Thinking: ${enableThinking ? thinkingTokens : 'disabled'}`);

            const response = await this.client.messages.create(params);

            // Extract content and thinking
            let content = '';
            let thinking = '';

            for (const block of response.content) {
                if (block.type === 'thinking') {
                    thinking = block.thinking;
                } else if (block.type === 'text') {
                    content = block.text;
                }
            }

            const result: ClaudeResponse = {
                success: true,
                content,
                thinking: thinking || undefined,
                usage: {
                    inputTokens: response.usage.input_tokens,
                    outputTokens: response.usage.output_tokens
                }
            };

            logger.info(`✅ Claude response: ${response.usage.input_tokens} in, ${response.usage.output_tokens} out`);

            return result;

        } catch (error: any) {
            logger.error('❌ Claude error:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Stream a message from Claude with callbacks
     */
    async stream(
        prompt: string,
        callbacks: ClaudeStreamCallbacks,
        options: ClaudeMessageOptions = {}
    ): Promise<void> {
        if (!this.isConfigured()) {
            callbacks.onError?.(new Error('ANTHROPIC_API_KEY not configured'));
            return;
        }

        const {
            model = this.defaultModel,
            maxTokens = 8192,
            effort = 'medium',
            systemPrompt,
            enableThinking = true,
            thinkingBudget
        } = options;

        try {
            const thinkingTokens = thinkingBudget || EFFORT_BUDGETS[effort];

            const params: Anthropic.MessageCreateParams = {
                model,
                max_tokens: maxTokens + (enableThinking ? thinkingTokens : 0),
                messages: [{ role: 'user', content: prompt }],
                stream: true
            };

            if (systemPrompt) {
                params.system = systemPrompt;
            }

            if (enableThinking && model.includes('opus')) {
                params.thinking = {
                    type: 'enabled',
                    budget_tokens: thinkingTokens
                };
                params.temperature = 1;
            }

            let fullContent = '';
            let fullThinking = '';
            let usage = { inputTokens: 0, outputTokens: 0 };

            const stream = await this.client.messages.stream(params);

            for await (const event of stream) {
                if (event.type === 'content_block_delta') {
                    const delta = event.delta as any;
                    if (delta.type === 'thinking_delta') {
                        fullThinking += delta.thinking;
                        callbacks.onThinking?.(delta.thinking);
                    } else if (delta.type === 'text_delta') {
                        fullContent += delta.text;
                        callbacks.onContent?.(delta.text);
                    }
                } else if (event.type === 'message_delta') {
                    usage = {
                        inputTokens: (event as any).usage?.input_tokens || 0,
                        outputTokens: (event as any).usage?.output_tokens || 0
                    };
                }
            }

            callbacks.onComplete?.({
                success: true,
                content: fullContent,
                thinking: fullThinking || undefined,
                usage
            });

        } catch (error: any) {
            logger.error('❌ Claude stream error:', error.message);
            callbacks.onError?.(error);
        }
    }

    /**
     * Analyze text with Claude - quick analysis using Sonnet
     */
    async analyze(
        text: string,
        instruction: string
    ): Promise<ClaudeResponse> {
        return this.message(
            `${instruction}\n\n---\n\n${text}`,
            {
                model: 'claude-sonnet-4-5-20260115',
                effort: 'low',
                enableThinking: false,
                maxTokens: 2048
            }
        );
    }

    /**
     * Generate structured data (JSON) from Claude
     */
    async generateJSON<T = any>(
        prompt: string,
        options: ClaudeMessageOptions = {}
    ): Promise<{ success: boolean; data?: T; error?: string }> {
        const systemPrompt = `${options.systemPrompt || ''}

IMPORTANT: Your response must be valid JSON only. No markdown, no explanation, just the JSON object.`;

        const response = await this.message(prompt, {
            ...options,
            systemPrompt
        });

        if (!response.success || !response.content) {
            return { success: false, error: response.error || 'No content returned' };
        }

        try {
            // Try to extract JSON from response
            let jsonStr = response.content.trim();

            // Remove markdown code blocks if present
            if (jsonStr.startsWith('```json')) {
                jsonStr = jsonStr.slice(7);
            } else if (jsonStr.startsWith('```')) {
                jsonStr = jsonStr.slice(3);
            }
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.slice(0, -3);
            }

            const data = JSON.parse(jsonStr.trim());
            return { success: true, data };

        } catch (parseError: any) {
            logger.error('❌ JSON parse error:', parseError.message);
            return { success: false, error: `Failed to parse JSON: ${parseError.message}` };
        }
    }

    /**
     * Extract information from call transcript
     */
    async extractFromTranscript(
        transcript: string,
        extractionPrompt: string
    ): Promise<ClaudeResponse> {
        const systemPrompt = `You are an AI assistant analyzing call transcripts for a roofing company.
Extract the requested information accurately from the conversation.
Be precise and only include information that was explicitly stated or strongly implied.`;

        return this.message(
            `${extractionPrompt}\n\nTranscript:\n${transcript}`,
            {
                model: 'claude-sonnet-4-5-20260115',
                systemPrompt,
                effort: 'medium',
                enableThinking: false,
                maxTokens: 4096
            }
        );
    }

    /**
     * Generate personalized content for customer outreach
     */
    async generatePersonalizedContent(
        customerContext: string,
        contentType: 'email' | 'sms' | 'script',
        template?: string
    ): Promise<ClaudeResponse> {
        const systemPrompts = {
            email: 'Generate a professional, warm email for a roofing company customer. Keep it concise and action-oriented.',
            sms: 'Generate a brief, friendly SMS message. Maximum 160 characters. Include a clear call to action.',
            script: 'Generate a natural-sounding phone script for a roofing company representative. Include objection handling.'
        };

        let prompt = `Customer Context:\n${customerContext}\n\n`;
        if (template) {
            prompt += `Use this template as a guide:\n${template}\n\n`;
        }
        prompt += `Generate the ${contentType} content.`;

        return this.message(prompt, {
            model: 'claude-sonnet-4-5-20260115',
            systemPrompt: systemPrompts[contentType],
            effort: 'low',
            enableThinking: false,
            maxTokens: contentType === 'sms' ? 256 : 2048
        });
    }
}

// Export singleton instance
export const claude = new ClaudeService();
