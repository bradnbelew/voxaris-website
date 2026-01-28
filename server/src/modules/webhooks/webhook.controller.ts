import { Router, Request, Response } from 'express';
import { ghl } from '../../lib/ghl';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import { clientsService } from '../clients/clients.service';

const router = Router();
// RETELL WEBHOOKS (Voice)
// ==========================================
router.post('/retell', async (req: Request, res: Response) => {
    try {
        const event = req.body;
        if (event.event !== 'call_analyzed') {
            return res.json({ ignored: true });
        }

        logger.info(`📞 Retell Call Analyzed: ${event.call_id}`);
        const { call_id, duration_seconds, post_call_analysis, recording_url, agent_id } = event;
        
        // 0. VOXOS DB LOGGING (Section 0)
        // We log to our own DB *before* GHL in case GHL fails.
        // We need to find which client this is to link it.
        const client = await clientsService.getClientByRetellAgentId(agent_id);
        
        if (client) {
             const { error: dbError } = await supabase.from('calls').insert({
                call_id: call_id,
                client_id: client.id,
                platform: 'retell',
                direction: event.call?.direction || 'inbound',
                started_at: new Date(event.call?.start_timestamp || Date.now()).toISOString(), // Retell timestamp
                ended_at: new Date(event.call?.end_timestamp || Date.now()).toISOString(),
                duration_seconds: duration_seconds,
                transcript: post_call_analysis.transcript, 
                summary: post_call_analysis.call_summary,
                outcome: post_call_analysis.call_outcome,
                sentiment_score: post_call_analysis.sentiment_score,
                metadata: event,
                flagged: duration_seconds < 10 // Auto-flag short calls
            });
            
            if (dbError) logger.error("❌ Failed to log Call to DB:", dbError);
            else logger.info("✅ Call Logged to Supabase 'calls' table");
        } else {
             logger.warn(`⚠️ Could not log call to DB: Client not found for Agent ${agent_id}`);
        }

        // ... existing GHL logic
        // Retell sends custom_data as flattened or nested? Checking docs: usually flattened in 'retell_llm_dynamic_variables' or 'metadata'.
        // Assuming we passed contact_id in metadata.
        // We need to look at 'metadata' or 'retell_llm_dynamic_variables'.
        // In our start-call logic, we put it in metadata.
        // Retell webhook payload structure needs careful checking. Assuming 'metadata' is at root of payload if configured, or inside call object.
        // Actually, Retell webhook often sends the 'call' object which has 'metadata'.
        
        // Safety check: where is metadata?
        let contactId = event.call?.metadata?.contact_id || event.metadata?.contact_id;
        
        // FALLBACK: If no Contact ID, try to verify by Phone Number
        if (!contactId) {
             logger.warn("⚠️ No Contact ID in metadata. Attempting lookup by Phone...");
             const call = event.call || event;
             // Retell: Inbound (user=from), Outbound (user=to)
             // We'll check 'to_number' if direction is outbound, else 'from_number'
             const direction = call.direction || 'inbound';
             const customerNumber = direction === 'outbound' ? call.to_number : call.from_number;

             if (customerNumber) {
                 const found = await ghl.findContact(customerNumber);
                 if (found && found.id) {
                     contactId = found.id;
                     logger.info(`✅ Found Contact via Phone Lookup (${direction}): ${contactId}`);
                 }
             }
        }

        if (!contactId) {
            logger.warn("❌ Failed to resolve Contact ID (Metadata missing & Phone lookup failed)");
            return res.json({ error: "No Contact ID resolved" });
        }

        // 1. SYNC DATA TO GHL (Section 10: Post-Call Sync)
        const updateData: any = {
            customFields: {
                ai_conversation_type: "Voice (Retell)",
                ai_conversation_id: call_id,
                ai_conversation_duration: duration_seconds,
                ai_conversation_outcome: post_call_analysis.call_outcome,
                ai_conversation_summary: post_call_analysis.call_summary,
                ai_recording_url: recording_url,
                customer_intent: post_call_analysis.customer_intent,
                primary_objection: post_call_analysis.primary_objection,
                lead_quality: post_call_analysis.lead_quality,
                appointment_booked: post_call_analysis.appointment_booked ? "Yes" : "No",
                sentiment_score: post_call_analysis.sentiment_score // If available
            }
        };

        await ghl.createOrUpdateContact({ id: contactId, ...updateData });

        // 2. LOG NOTE
        await ghl.addNote(contactId, 
            `## AI Voice Conversation\n\n` +
            `**Outcome:** ${post_call_analysis.call_outcome}\n` +
            `**Summary:** ${post_call_analysis.call_summary}\n` +
            `**Recording:** ${recording_url}`
        );

        // 3. APPOINTMENT BOOKING HANDLER (Section 11)
        if (post_call_analysis.appointment_booked) {
             logger.info("📅 Appointment Detected! Logic Triggered.");
             // Ideally we parse "Next Tuesday at 2pm" -> Date Object.
             // For V1, we just Tag it "AI_BOOKED" and let the human scheduler finalize if precise time parsing is hard.
             // OR if Retell gives precise ISO timestamp in 'appointment_details', we use it.
             // We will assume human review needed unless exact time provided.
             
             // Tag it
             await ghl.createOrUpdateContact({
                 id: contactId,
                 tags: ["appointment_booked", "needs_scheduling_review"]
             });
             
             // Send SMS Confirmation
             await ghl.sendSMS(contactId, "Thanks! Maria here. I've noted your request for an appointment. I'll text you shortly to confirm the exact slot.");
        }

        res.json({ success: true });

    } catch (error: any) {
        logger.error("❌ Retell Webhook Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// TAVUS WEBHOOKS (Video)
// ==========================================
router.post('/tavus', async (req: Request, res: Response) => {
    try {
        const event = req.body;
        logger.info(`🎥 Tavus Event: ${event.event}`);

        if (event.event === 'conversation.ended') {
            const { conversation_id, duration_seconds, summary, sentiment, metadata, persona_id } = event;
            
            // 0. VOXOS DB LOGGING
            const client = await clientsService.getClientByTavusPersonaId(persona_id);
            if (client) {
                const { error: dbError } = await supabase.from('calls').insert({
                    call_id: conversation_id,
                    client_id: client.id,
                    platform: 'tavus',
                    direction: 'outbound', // Contextually usually outbound for video sends? Or inbound. assume outbound/video gen for now.
                    started_at: new Date(Date.now() - (duration_seconds * 1000)).toISOString(), // Approx start
                    ended_at: new Date().toISOString(),
                    duration_seconds: duration_seconds,
                    summary: summary,
                    sentiment_score: sentiment ? Math.round(sentiment.score * 100) : null,
                    outcome: 'video_completed',
                    metadata: event,
                    flagged: false
                });
                if (dbError) logger.error("❌ Failed to log Tavus Call to DB:", dbError);
                else logger.info("✅ Tavus Call Logged to Supabase");
            }

            let contactId = metadata?.contact_id;
            // ... fallback logic
            if (!contactId && req.query.contact_id) {
                contactId = req.query.contact_id as string;
            }

            // Fallback 2: Check for email or phone in query params
            if (!contactId) {
                const email = req.query.email as string;
                const phone = req.query.phone as string;
                
                if (email || phone) {
                    logger.info(`🔍 Looking up Tavus contact by ${email ? 'Email' : 'Phone'}...`);
                    const found = await ghl.findContact(email || phone);
                    if (found && found.id) {
                        contactId = found.id;
                        logger.info(`✅ Found Contact via Lookup: ${contactId}`);
                    }
                }
            }

            if (!contactId) {
                 logger.warn("❌ No Contact ID found for Tavus Event (and lookup failed)");
                 return res.json({ error: "No Contact ID" });
            }

            if (contactId) {
                await ghl.createOrUpdateContact({
                    id: contactId,
                    customFields: {
                        ai_conversation_type: "Video (Tavus)",
                        ai_conversation_id: conversation_id,
                        ai_conversation_summary: summary,
                        // Convert decimal 0.8 to 80
                        sentiment_score: sentiment ? Math.round(sentiment.score * 100) : undefined
                    }
                });
                
                await ghl.addNote(contactId, `## AI Video Summary\n${summary}`);
            }
        }
        res.json({ success: true });
    } catch (error: any) {
         logger.error("❌ Tavus Webhook Error:", error);
         res.status(500).json({ error: error.message });
    }
});



// ==========================================
// GHL INBOUND WEBHOOKS (SMS Bot)
// ==========================================
import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SMS_SYSTEM_PROMPT = `
You are Maria, a Senior Acquisition Manager at Hill Nissan.
You are chatting via SMS with a customer who received a "Payment Swap" mailer.
GOAL: Get them to come to the showroom for a 10-minute appraisal.
TONE: Professional, warm, concise (SMS style). Max 160 chars per text usually.
KNOWLEDGE:
- Offer: Up to $5,000 over KBB value.
- Address: 123 Hill Nissan Dr.
- Hours: 9am-8pm.
RULES:
- If they ask for price, say "I need to see it in person to give the max offer, but the mailer typically unlocks $3k-$5k over market."
- If they want to book, ask: "Does 2:15 or 4:45 work better for you?"
- If they agree to a time, say "Great, I'll lock that in."
`;

router.post('/ghl', async (req: Request, res: Response) => {
    try {
        // GHL Webhook payload structure varies by trigger type
        // Assuming "Inbound Message" trigger sends: { type: "InboundMessage", contactId, message: { body: "..." } }
        const { type, contactId, message } = req.body;
        
        console.log(`📩 GHL Event: ${type}`);

        if (type !== "InboundMessage" || !message?.body) {
             return res.json({ ignored: true });
        }

        if (message.direction === "outbound") {
            return res.json({ ignored: true }); // Ignore our own messages
        }

        console.log(`💬 Incoming SMS from ${contactId}: "${message.body}"`);

        // 1. Generate AI Response
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: SMS_SYSTEM_PROMPT },
                { role: "user", content: message.body }
            ],
            max_tokens: 150,
        });

        const aiReply = completion.choices[0].message.content || "Hey, this is Maria. Can you stop by today?";
        
        // 2. Send Reply via GHL
        await ghl.sendSMS(contactId, aiReply);

        res.json({ success: true });

    } catch (error: any) {
        console.error("❌ SMS Bot Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
