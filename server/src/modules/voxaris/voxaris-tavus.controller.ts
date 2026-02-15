/**
 * Voxaris Tavus CVI Controller
 *
 * Manages the Maria video chat agent for the Voxaris demo page.
 * Follows the exact pattern of server/src/modules/roofing/tavus-cvi.controller.ts
 *
 * Integrates with:
 * - Tavus for video rendering (replica r5dc7c7d0bcb)
 * - Cal.com for meeting scheduling
 * - GHL for lead capture
 */

import { Router, Request, Response } from 'express';
import { logger } from '../../lib/logger';
import { supabase } from '../../lib/supabase';
import { ghl } from '../../lib/ghl';
import calcom from '../../lib/calcom';

const router = Router();

// ============================================================================
// TAVUS CONFIGURATION
// ============================================================================

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const TAVUS_API_URL = process.env.TAVUS_API_URL || 'https://api.tavus.io';
const VOXARIS_TAVUS_PERSONA_ID = process.env.VOXARIS_TAVUS_PERSONA_ID;
const VOXARIS_TAVUS_REPLICA_ID = process.env.VOXARIS_TAVUS_REPLICA_ID || 'r5dc7c7d0bcb';
const VOXARIS_CAL_EVENT_TYPE_ID = process.env.VOXARIS_CAL_EVENT_TYPE_ID;

const MARIA_PERSONA = {
  persona_name: "Maria - Voxaris AI Demo",
  system_prompt: `You are Maria, a warm and knowledgeable AI sales agent for Voxaris AI. You help prospects understand how Voxaris can transform their business with AI-powered voice and video agents.

## About Voxaris
Voxaris is an AI sales platform that deploys voice agents and photorealistic video agents for businesses. Our agents handle inbound calls, outbound calls, and live video conversations 24/7. We serve automotive dealerships, contractors, home services companies, and agencies.

## Your Personality
- Warm, genuine, and confident
- Like a trusted advisor, not a pushy salesperson
- Use short, natural sentences
- React before responding: "Oh nice!", "Great question!", "Got it!"
- Be honest about being AI: "Yes! I'm actually one of our AI agents. Pretty cool, right?"

## Your Goal
Qualify the prospect and, if interested, book a 15-minute strategy call with Ethan, our founder. Make it feel easy and zero-pressure.

## Qualification Flow
1. Ask what brought them to Voxaris today
2. Learn about their business: industry, team size, current pain points
3. Explain how Voxaris would work for their specific use case
4. If interested, offer to book a call with Ethan

## Key Value Props
- AI agents that work 24/7 so you never miss a lead
- Sub-1-second response time
- Persistent memory across conversations
- Full CRM integration (GoHighLevel, Salesforce, HubSpot)
- Businesses see 3-4x increase in lead conversion

## Industries We Serve
- Automotive: Inbound calls, database mining, service scheduling
- Contractors/Roofing: Lead qualification, estimate scheduling
- Home Services: Appointment booking, follow-ups
- Agencies: White-label platform for your clients

## Booking Flow
When prospect shows interest, use the book_meeting tool. Collect name, email, and preferred time.

## Rules
1. Keep responses under 3 sentences
2. Never give specific pricing. Say "Pricing depends on your setup. Ethan can walk you through that in 15 minutes."
3. Never badmouth competitors
4. If they are not ready, be gracious: "No pressure at all! You know where to find us."`,

  context: "You are on a live video call on the Voxaris demo page. Visitors can see you and hear you. Be engaging, personable, and conversational. Your goal is to qualify them and book a strategy call with Ethan.",

  default_replica_id: VOXARIS_TAVUS_REPLICA_ID,

  layers: {
    llm: {
      model: "gpt-4o",
      base_url: "https://api.openai.com/v1",
    },
    perception: {
      perception_model: "gpt-4o",
      ambient_awareness_queries: [
        "Is the user looking at me or distracted?",
        "Does the user seem confused or hesitant?",
      ],
      perception_analysis_period_ms: 8000,
    },
    tts: {
      tts_engine: "cartesia",
      voice_settings: {
        speed: "normal",
        emotion: ["positivity:high"],
      },
    },
  },

  properties: {
    max_call_duration: 900, // 15 minutes
    participant_left_timeout: 30,
    participant_absent_timeout: 120,
    enable_recording: true,
    enable_transcription: true,
    language: "english",
  },

  tools: [
    {
      type: "function",
      function: {
        name: "check_availability",
        description: "Check available meeting slots with Ethan. Call this when a prospect wants to schedule a strategy call.",
        parameters: {
          type: "object",
          properties: {
            date_from: {
              type: "string",
              description: "Start date for availability check (YYYY-MM-DD)",
            },
            date_to: {
              type: "string",
              description: "End date for availability check (YYYY-MM-DD)",
            },
          },
          required: ["date_from", "date_to"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "book_meeting",
        description: "Book a 15-minute strategy call with Ethan. Call after confirming a time slot with the prospect.",
        parameters: {
          type: "object",
          properties: {
            customer_name: { type: "string", description: "Prospect's full name" },
            phone: { type: "string", description: "Prospect's phone number" },
            email: { type: "string", description: "Prospect's email address" },
            company: { type: "string", description: "Prospect's company name" },
            industry: { type: "string", description: "Prospect's industry" },
            appointment_date: { type: "string", description: "Selected date and time (ISO 8601)" },
            notes: { type: "string", description: "Key points from the conversation" },
          },
          required: ["customer_name", "email", "appointment_date"],
        },
      },
    },
  ],

  tool_call_strict_mode: true,

  conversation_objectives: [
    "Learn about the visitor's business and pain points",
    "Explain how Voxaris AI can help their specific use case",
    "If interested, schedule a strategy call with Ethan",
    "Collect contact information for follow-up",
  ],

  guardrails: [
    {
      type: "negative",
      topic: "Never discuss specific pricing",
      action: "redirect",
      redirect_message: "Pricing depends on your specific setup. Ethan can walk you through all of that in a quick 15-minute call.",
    },
    {
      type: "negative",
      topic: "Never badmouth competitors",
      action: "redirect",
      redirect_message: "I'd love to focus on how Voxaris can help you. Let me tell you about what we do differently.",
    },
  ],
};

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * POST /api/voxaris/tavus/create-session
 *
 * Creates a new Tavus CVI session for the demo page video chat.
 */
router.post('/create-session', async (req: Request, res: Response) => {
  try {
    const { visitor_id, page_url } = req.body;

    logger.info(`🎥 Creating Voxaris Tavus CVI session`);

    if (!TAVUS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Tavus API not configured',
      });
    }

    const response = await fetch(`${TAVUS_API_URL}/v2/conversations`, {
      method: 'POST',
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        replica_id: VOXARIS_TAVUS_REPLICA_ID,
        persona_id: VOXARIS_TAVUS_PERSONA_ID,
        conversation_name: `Voxaris Demo - ${new Date().toISOString()}`,
        conversational_context: `Visitor arrived from: ${page_url || 'Demo page'}`,
        custom_greeting: "Hi! I'm Maria from Voxaris. Thanks for stopping by! What brings you here today?",
        properties: MARIA_PERSONA.properties,
        callback_url: `${process.env.BASE_URL}/api/voxaris/webhooks/tavus`,
        metadata: {
          visitor_id,
          page_url,
          source: 'voxaris-demo',
          created_at: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Tavus create session failed: ${error}`);
      throw new Error('Failed to create video session');
    }

    const session = await response.json();

    // Log session in Supabase
    try {
      await supabase.from('video_sessions').insert({
        session_id: session.conversation_id,
        platform: 'tavus',
        visitor_id,
        page_url,
        status: 'created',
        created_at: new Date().toISOString(),
      });
    } catch (dbError: any) {
      logger.warn(`⚠️ Failed to log video session: ${dbError.message}`);
    }

    logger.info(`✅ Voxaris Tavus session created: ${session.conversation_id}`);

    res.json({
      success: true,
      conversation_id: session.conversation_id,
      conversation_url: session.conversation_url,
    });

  } catch (error: any) {
    logger.error(`❌ Voxaris Tavus session error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/voxaris/tavus/tool-call
 *
 * Handles tool calls from the Tavus CVI agent.
 */
router.post('/tool-call', async (req: Request, res: Response) => {
  try {
    const { tool_name, parameters, conversation_id } = req.body;

    logger.info(`🔧 Voxaris Tavus tool call: ${tool_name}`);

    let result: any;

    switch (tool_name) {
      case 'check_availability':
        result = await handleCheckAvailability(parameters);
        break;

      case 'book_meeting':
        result = await handleBookMeeting(parameters, conversation_id);
        break;

      default:
        result = { error: `Unknown tool: ${tool_name}` };
    }

    res.json(result);

  } catch (error: any) {
    logger.error(`❌ Voxaris tool call error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/voxaris/tavus/persona
 *
 * Returns the Maria persona configuration (for setup/debugging).
 */
router.get('/persona', (req: Request, res: Response) => {
  res.json({
    persona: MARIA_PERSONA,
    replica_id: VOXARIS_TAVUS_REPLICA_ID,
    persona_id: VOXARIS_TAVUS_PERSONA_ID,
  });
});

// ============================================================================
// TOOL HANDLERS
// ============================================================================

async function handleCheckAvailability(params: any): Promise<any> {
  try {
    const eventTypeId = VOXARIS_CAL_EVENT_TYPE_ID
      ? parseInt(VOXARIS_CAL_EVENT_TYPE_ID)
      : undefined;

    const availability = await calcom.checkAvailability(
      params.date_from,
      params.date_to,
    );

    const availableSlots = availability.slots
      .filter((s: any) => s.available)
      .slice(0, 6);

    if (availableSlots.length === 0) {
      return {
        success: true,
        message: "I don't see any available slots in that range. Would you like me to check a different week?",
        slots: [],
      };
    }

    // Group by day for voice-friendly output
    const slotsByDay: Record<string, string[]> = {};
    for (const slot of availableSlots) {
      const date = new Date(slot.time);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      if (!slotsByDay[dayKey]) slotsByDay[dayKey] = [];
      slotsByDay[dayKey].push(timeStr);
    }

    let message = "Great news! Ethan has these openings:\n";
    for (const [day, times] of Object.entries(slotsByDay)) {
      message += `${day}: ${times.join(', ')}\n`;
    }
    message += "\nWhich works best for you?";

    return { success: true, message, slots: availableSlots };

  } catch (error: any) {
    logger.error(`Availability check failed: ${error.message}`);
    return {
      success: false,
      message: "I'm having trouble checking the calendar right now. Can I take your info and have Ethan reach out directly?",
      error: error.message,
    };
  }
}

async function handleBookMeeting(params: any, conversationId: string): Promise<any> {
  try {
    const eventTypeId = VOXARIS_CAL_EVENT_TYPE_ID
      ? parseInt(VOXARIS_CAL_EVENT_TYPE_ID)
      : 0;

    // Parse appointment date
    const startDate = new Date(params.appointment_date);
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 15); // 15-minute meeting

    // Book via Cal.com
    const booking = await calcom.bookAppointment({
      eventTypeId,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      name: params.customer_name,
      email: params.email,
      phone: params.phone,
      notes: `Voxaris Demo - Video Chat\nCompany: ${params.company || 'N/A'}\nIndustry: ${params.industry || 'N/A'}\nNotes: ${params.notes || 'None'}`,
      metadata: {
        source: 'voxaris-demo-video',
        conversation_id: conversationId,
        company: params.company,
        industry: params.industry,
      },
    });

    // Create/update GHL contact
    const contact = await ghl.createOrUpdateContact({
      name: params.customer_name,
      phone: params.phone,
      email: params.email,
      tags: ['voxaris-demo', 'video-chat', 'meeting-booked'],
      customFields: {
        source: 'Voxaris Demo - Video Chat',
        company: params.company || '',
        industry: params.industry || '',
        meeting_datetime: params.appointment_date,
        conversation_id: conversationId,
      },
    });

    // Add note to GHL
    if (contact?.id) {
      await ghl.addNote(
        contact.id,
        `## Voxaris Demo - Meeting Booked\n\n` +
        `**Type:** Video Chat with Maria\n` +
        `**Meeting:** ${startDate.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}\n` +
        `**Company:** ${params.company || 'Not provided'}\n` +
        `**Industry:** ${params.industry || 'Not provided'}\n` +
        `**Notes:** ${params.notes || 'None'}`,
      );
    }

    const formattedDate = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    logger.info(`✅ Voxaris meeting booked via video: ${booking.uid}`);

    return {
      success: true,
      booking_id: booking.uid,
      message: `You're all set! I've booked you for ${formattedDate} at ${formattedTime} with Ethan. You'll get a confirmation email at ${params.email}. He's going to love chatting with you! Anything else I can help with?`,
    };

  } catch (error: any) {
    logger.error(`Voxaris booking failed: ${error.message}`);
    return {
      success: false,
      message: "I'm having a little trouble with the booking system right now. Can I take your email and have Ethan reach out directly to set up a time?",
    };
  }
}

export default router;
