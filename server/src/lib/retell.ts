/**
 * Retell AI Voice Agent Integration
 *
 * Handles outbound calls and agent management via Retell API
 */

import { logger } from './logger';

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_BASE_URL = 'https://api.retellai.com';

interface CreateCallParams {
  fromNumber: string;
  toNumber: string;
  agentId: string;
  dynamicVariables?: Record<string, string>;
  metadata?: Record<string, any>;
}

interface CallResponse {
  call_id: string;
  agent_id: string;
  from_number: string;
  to_number: string;
  status: string;
}

interface RetellError {
  error: string;
  message: string;
}

class RetellClient {
  private apiKey: string;

  constructor() {
    if (!RETELL_API_KEY) {
      logger.warn('⚠️ RETELL_API_KEY not set - outbound calls will fail');
    }
    this.apiKey = RETELL_API_KEY || '';
  }

  /**
   * Create an outbound phone call
   */
  async createOutboundCall(params: CreateCallParams): Promise<{
    success: boolean;
    callId?: string;
    error?: string;
  }> {
    if (!this.apiKey) {
      return { success: false, error: 'RETELL_API_KEY not configured' };
    }

    try {
      logger.info(`📞 Creating outbound call to ${params.toNumber} using agent ${params.agentId}`);

      // Use override_agent_id to use a different agent than the one bound to the phone number
      const response = await fetch(`${RETELL_BASE_URL}/v2/create-phone-call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_number: params.fromNumber,
          to_number: params.toNumber,
          override_agent_id: params.agentId,
          retell_llm_dynamic_variables: params.dynamicVariables || {},
          metadata: params.metadata || {},
        }),
      });

      if (!response.ok) {
        const error = await response.json() as RetellError;
        logger.error(`❌ Retell API error: ${error.message || response.statusText}`);
        return { success: false, error: error.message || response.statusText };
      }

      const data = await response.json() as CallResponse;
      logger.info(`✅ Outbound call created: ${data.call_id}`);

      return { success: true, callId: data.call_id };

    } catch (error: any) {
      logger.error(`❌ Error creating outbound call: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get call details by call ID
   */
  async getCall(callId: string): Promise<any> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(`${RETELL_BASE_URL}/v2/get-call/${callId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();

    } catch (error: any) {
      logger.error(`❌ Error getting call: ${error.message}`);
      return null;
    }
  }

  /**
   * List all agents
   */
  async listAgents(): Promise<any[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${RETELL_BASE_URL}/list-agents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      return await response.json();

    } catch (error: any) {
      logger.error(`❌ Error listing agents: ${error.message}`);
      return [];
    }
  }

  /**
   * List phone numbers
   */
  async listPhoneNumbers(): Promise<any[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await fetch(`${RETELL_BASE_URL}/list-phone-numbers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      return await response.json();

    } catch (error: any) {
      logger.error(`❌ Error listing phone numbers: ${error.message}`);
      return [];
    }
  }
}

export const retell = new RetellClient();
