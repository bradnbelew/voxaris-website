
import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';

export interface ClientConfig {
  id: string;
  business_name: string;
  retell_agent_id: string;
  tavus_persona_id: string;
  tavus_replica_id?: string;
  system_prompt: string;
  objection_map: Record<string, string>;
  ghl_location_id?: string;
}

export const clientsService = {
  /**
   * Universal Lookup: Finds the client configuration based on the incoming Retell Agent ID.
   * This is the "Magic" that allows 1 codebase to serve 1,000 clients.
   */
  async getClientByRetellAgentId(agentId: string): Promise<ClientConfig | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('retell_agent_id', agentId)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
         logger.warn(`⚠️ Unknown Agent ID attempted call: ${agentId}`);
         return null; 
      }
      logger.error('❌ Supabase Client Lookup Failed:', error);
      throw new Error('Database specific error in client lookup');
    }

    return data as ClientConfig;
  },

  /**
   * Lookup Client by Tavus Persona ID.
   */
  async getClientByTavusPersonaId(personaId: string): Promise<ClientConfig | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('tavus_persona_id', personaId)
      .eq('active', true)
      .single();

    if (error) {
       // Silent fail or warn?
       return null; 
    }
    return data as ClientConfig;
  },

  /**
   * Fallback for development/testing if Agent ID is missing or local.
   * Reads from .env to mock a "Legacy" client row.
   */
  getLegacyEnvClient(): ClientConfig {
    return {
        id: 'legacy-env-client',
        business_name: 'Hill Nissan (Legacy Env)',
        retell_agent_id: process.env.RETELL_AGENT_ID || '',
        tavus_persona_id: process.env.TAVUS_PERSONA_ID || '',
        system_prompt: "Legacy Prompt from Env (Deprecated)", // In reality, we handle this in the controller
        objection_map: {},
        ghl_location_id: process.env.GHL_LOCATION_ID
    };
  }
};
