import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { ghl } from '../../lib/ghl';
import { logger } from '../../lib/logger';
import { clientsService } from '../clients/clients.service';

const router = Router();

/**
 * Retell LLM Request type
 */
interface RetellLLMRequest {
  call_id: string;
  agent_id: string;
  interaction_type?: 'call_details' | 'reminder_required' | 'response_required' | 'ping_pong';
  transcript?: Array<{
    role: 'agent' | 'user';
    content: string;
  }>;
  [key: string]: any; // Allow additional fields
}

// Main Retell LLM Endpoint
router.post('/retell-llm', async (req: Request, res: Response) => {
  const body: RetellLLMRequest = req.body;
  const { call_id, agent_id } = body;

  logger.info(`📞 Retell LLM | Call: ${call_id} | Agent: ${agent_id}`);

  try {
    // 1. LOOKUP CLIENT (The VoxOS Brain)
    // We stop guessing who is calling. We ask the database.
    let client = await clientsService.getClientByRetellAgentId(agent_id);

    // Fallback: If DB lookup fails (or during migration), check .env
    if (!client) {
      if (agent_id === process.env.RETELL_AGENT_ID) {
          logger.warn("⚠️ Falling back to LEGACY .env Config for Hill Nissan");
          client = clientsService.getLegacyEnvClient();
      } else {
          logger.error(`❌ CRITICAL: Unknown Agent ID: ${agent_id}`);
          // We can't proceed if we don't know who this is.
          // Retell expects a response, so we might return a generic "System Error" prompt or exit.
          return res.status(500).json({ error: "Unknown Client Agent ID" });
      }
    }

    logger.info(`✅ Recognized Client: ${client.business_name} (${client.id})`);

    // 2. PREPARE THE PROMPT
    // We inject dynamic variables if needed (e.g. caller name)
    // For now, we assume the DB `system_prompt` is the master source.
    const systemPrompt = client.system_prompt;
    
    // ... Initialize OpenAI with this system Prompt
     // ... (logic)

  } catch (error) {
    logger.error("❌ Retell LLM Error:", { error });
    return res.status(500).json({ error: "LLM processing failed" });
  }
});

// Tool Result Handler
router.post('/retell-llm/tool-result', (req: Request, res: Response) => {
  const { name, arguments: rawArgs } = req.body;
  const args = JSON.parse(rawArgs);

  // ... (switch)

  switch (name) {
    // ...
    case "book_appointment":
       // ...
       // FIRE & FORGET SYNC
       (async () => {
         try {
            logger.info("🔄 Syncing Appointment to GHL...", { name: args.name, time: args.datetime });
            const contact = await ghl.createOrUpdateContact({
              name: args.name,
              phone: args.phone,
              tags: ["AI_BOOKED", "VIP_BUYBACK_2026"]
            });
            
            if (contact && contact.id) {
              logger.info(`✅ GHL Contact Synced: ${contact.id}`);
              // Add note
              await ghl.addNote(contact.id, `AI Booked Appointment for: ${args.vehicle} at ${args.datetime}`);
              // Move Opportunity (Stage: Appointment Set)
              // We need pipeline Id. For now, just logging contact is huge win.
            }
         } catch (err) {
            logger.error("❌ GHL Sync Warning:", { error: err });
         }
       })();
       break;
  }

  return res.json({ result: "Success" });
});

export default router;
