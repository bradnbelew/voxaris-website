
import { Router, Request, Response } from 'express';
import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';

const router = Router();

// Define Request Body Type
interface SpawnRequest {
    businessName: string;
    industry: string;
    systemPrompt: string;
    // Integration Configs
    retellAgentId?: string;
    tavusPersonaId?: string;
    ghlLocationId?: string;
    objectionMap?: Record<string, string>;
}

// POST /api/spawn
// The "One Button" to launch a new client.
router.post('/spawn', async (req: Request, res: Response) => {
    logger.info("🏭 Spawn Agent Request Received");
    try {
        const body: SpawnRequest = req.body;
        
        // 1. Validation
        if (!body.businessName || !body.systemPrompt) {
            return res.status(400).json({ error: "Missing required fields: businessName, systemPrompt" });
        }

        // 2. Integration Provisioning (Mocked for Level 2, will be real API calls in Level 3)
        // In a real "Factory", we would call Tavus API here to create a persona.
        // For now, we assume the user created them manually and is just "Registering" them in VoxOS.
        const retellAgentId = body.retellAgentId || `agent_mock_${Date.now()}`; 
        const tavusPersonaId = body.tavusPersonaId || `p_${Date.now()}`;

        // 3. Database Creation (The Source of Truth)
        const { data: client, error } = await supabase
            .from('clients')
            .insert({
                business_name: body.businessName,
                industry: body.industry || 'General',
                system_prompt: body.systemPrompt,
                retell_agent_id: retellAgentId,
                tavus_persona_id: tavusPersonaId,
                ghl_location_id: body.ghlLocationId,
                objection_map: body.objectionMap || {},
                active: true
            })
            .select()
            .single();

        if (error) {
            logger.error("❌ Failed to spawn client in DB:", error);
            // Check for specific Supabase errors (like table not existing)
            if (error.code === '42P01') { 
                return res.status(500).json({ error: "Database tables not found. Did you run the Schema SQL?", details: error });
            }
            throw error;
        }

        logger.info(`✅ Client Spawned Successfully: ${client.business_name} (${client.id})`);

        res.json({
            success: true,
            message: "Client Spawned",
            client: {
                id: client.id,
                businessName: client.business_name,
                retellAgentId: client.retell_agent_id,
                tavusPersonaId: client.tavus_persona_id
            }
        });

    } catch (error: any) {
        logger.error("❌ Spawn Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
