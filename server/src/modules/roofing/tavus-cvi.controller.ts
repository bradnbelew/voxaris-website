/**
 * Tavus CVI (Conversational Video Interface) Controller
 *
 * Manages the video chat agent for Roofing Pros USA website.
 * Sarah appears as a video avatar and can help visitors with:
 * - Answering questions about services
 * - Scheduling inspections via Cal.com
 * - Providing insurance claim guidance
 *
 * Integrates with:
 * - Tavus for video rendering
 * - Cal.com for appointment scheduling
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
const TAVUS_PERSONA_ID = process.env.TAVUS_ROOFING_PERSONA_ID;
const TAVUS_REPLICA_ID = process.env.TAVUS_ROOFING_REPLICA_ID;

// Persona configuration from Production Config document
const SARAH_PERSONA = {
  persona_name: "Sarah - Roofing Pros USA",
  system_prompt: `You are Sarah, a friendly and knowledgeable customer service representative for Roofing Pros USA. You help website visitors schedule free roof inspections and answer questions about roofing services.

## Your Personality
- Warm and professional, like a helpful neighbor who knows about roofing
- Confident but never pushy
- Empathetic to homeowners' concerns about their roof

## Company Information
- Name: Roofing Pros USA
- Service areas: Jacksonville, Orlando, Tampa, Pensacola, West Palm Beach, Daytona Beach, Melbourne (Florida)
- Services: Roof inspections, repairs, replacements, storm damage restoration, insurance claim assistance
- License: CCC1333006 (Florida State Licensed)
- Google Reviews: 636+ five-star reviews
- Owner: Rick Dorman

## Your Capabilities
1. Schedule free roof inspections using the calendar tool
2. Answer questions about roofing services
3. Explain the inspection process
4. Discuss financing options (GoodLeap, Sunlight Financial)
5. Guide homeowners through insurance claim process

## Inspection Scheduling
- Inspections are FREE and take 30-45 minutes
- Morning window: 9 AM - 12 PM
- Afternoon window: 1 PM - 5 PM
- A specialist calls the morning of to confirm

## Key Rules
1. ALWAYS verify the visitor's zip code is in a service area before scheduling
2. For insurance claims, NEVER promise claim approval - only offer to help document
3. If asked about specific pricing, explain that a free inspection is needed first
4. Be conversational and natural - you're on video, so smile and be warm!

## Service Area Zip Codes (first 3 digits)
- Jacksonville: 320, 321, 322
- Orlando: 327, 328, 347
- Tampa: 335, 336, 337
- West Palm Beach: 334
- Pensacola: 325
- Daytona Beach: 321
- Melbourne: 329`,

  context: `You are a video chat agent on the Roofing Pros USA website. Visitors can see you and hear you. Be engaging and personable. Your goal is to help them schedule a free roof inspection or answer their questions.`,

  default_replica_id: TAVUS_REPLICA_ID,

  layers: {
    llm: {
      model: "gpt-4o",
      base_url: "https://api.openai.com/v1"
    },
    perception: {
      perception_model: "gpt-4o",
      ambient_awareness_queries: [
        "Is the user looking at me or distracted?",
        "Does the user seem confused or hesitant?"
      ],
      perception_analysis_period_ms: 8000
    },
    tts: {
      tts_engine: "eleven_turbo_v2",
      voice_id: "EXAVITQu4vr4xnSDxMaL" // Sarah voice
    }
  },

  properties: {
    max_call_duration: 1200, // 20 minutes max
    participant_left_timeout: 30,
    participant_absent_timeout: 120,
    enable_recording: true,
    enable_transcription: true,
    apply_greenscreen: true,
    language: "english",
    recording_s3_bucket_name: process.env.TAVUS_RECORDING_BUCKET,
    recording_s3_bucket_region: "us-east-1"
  },

  tools: [
    {
      type: "function",
      function: {
        name: "check_availability",
        description: "Check available appointment slots for roof inspections. Call this when a customer wants to schedule an inspection.",
        parameters: {
          type: "object",
          properties: {
            date_from: {
              type: "string",
              description: "Start date for availability check (YYYY-MM-DD)"
            },
            date_to: {
              type: "string",
              description: "End date for availability check (YYYY-MM-DD)"
            }
          },
          required: ["date_from", "date_to"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "book_inspection",
        description: "Book a roof inspection appointment. Call after confirming slot with customer.",
        parameters: {
          type: "object",
          properties: {
            customer_name: { type: "string", description: "Customer's full name" },
            phone: { type: "string", description: "Customer's phone number" },
            email: { type: "string", description: "Customer's email address" },
            property_address: { type: "string", description: "Property address for inspection" },
            property_zip: { type: "string", description: "Property zip code" },
            appointment_date: { type: "string", description: "Selected date (YYYY-MM-DD)" },
            appointment_time_window: { type: "string", enum: ["morning", "afternoon"], description: "Time window preference" },
            roof_issue: { type: "string", description: "Description of roof issue/concern" },
            is_storm_damage: { type: "boolean", description: "Is this related to storm damage?" },
            has_insurance_claim: { type: "boolean", description: "Does customer have or plan to file insurance claim?" }
          },
          required: ["customer_name", "phone", "property_address", "property_zip", "appointment_date", "appointment_time_window"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "check_service_area",
        description: "Verify if a zip code is within service area",
        parameters: {
          type: "object",
          properties: {
            zip_code: { type: "string", description: "5-digit zip code to check" }
          },
          required: ["zip_code"]
        }
      }
    }
  ],

  tool_call_strict_mode: true,

  conversation_objectives: [
    "Determine if the visitor needs roof inspection, repairs, or general information",
    "Verify the visitor's property is in our service area",
    "Schedule a free roof inspection if appropriate",
    "Collect contact information for follow-up",
    "Answer any questions about our services professionally"
  ],

  guardrails: [
    {
      type: "negative",
      topic: "Never discuss competitors or their pricing",
      action: "redirect",
      redirect_message: "I'm happy to focus on how Roofing Pros USA can help you. Let me tell you about our services."
    },
    {
      type: "negative",
      topic: "Never promise insurance claim approval",
      action: "clarify",
      redirect_message: "While I can't guarantee insurance approval, our team is experienced in documenting damage and working with insurance adjusters."
    },
    {
      type: "negative",
      topic: "Never give specific pricing without inspection",
      action: "clarify",
      redirect_message: "Every roof is unique, so I'd need our specialist to do a free inspection first. But I can schedule that for you right now!"
    }
  ]
};

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * POST /api/roofing/tavus/create-session
 *
 * Creates a new Tavus CVI session for website video chat
 */
router.post('/create-session', async (req: Request, res: Response) => {
  try {
    const { visitor_id, page_url, referrer } = req.body;

    logger.info(`🎥 Creating Tavus CVI session`);

    if (!TAVUS_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Tavus API not configured'
      });
    }

    // Create conversation via Tavus API
    const response = await fetch(`${TAVUS_API_URL}/v2/conversations`, {
      method: 'POST',
      headers: {
        'x-api-key': TAVUS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        replica_id: TAVUS_REPLICA_ID,
        persona_id: TAVUS_PERSONA_ID,
        conversation_name: `Website Chat - ${new Date().toISOString()}`,
        conversational_context: `Visitor arrived from: ${page_url || 'Homepage'}`,
        custom_greeting: "Hi there! I'm Sarah from Roofing Pros USA. How can I help you with your roof today?",
        properties: SARAH_PERSONA.properties,
        callback_url: `${process.env.BASE_URL}/api/roofing/webhooks/tavus`,
        metadata: {
          visitor_id,
          page_url,
          referrer,
          created_at: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(`Tavus create session failed: ${error}`);
      throw new Error('Failed to create video session');
    }

    const session = await response.json();

    // Log session in Supabase
    await supabase.from('video_sessions').insert({
      session_id: session.conversation_id,
      platform: 'tavus',
      visitor_id,
      page_url,
      status: 'created',
      created_at: new Date().toISOString()
    });

    logger.info(`✅ Tavus session created: ${session.conversation_id}`);

    res.json({
      success: true,
      conversation_id: session.conversation_id,
      conversation_url: session.conversation_url
    });

  } catch (error: any) {
    logger.error(`❌ Tavus session error: ${error.message}`);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/roofing/tavus/tool-call
 *
 * Handles tool calls from Tavus CVI agent
 */
router.post('/tool-call', async (req: Request, res: Response) => {
  try {
    const { tool_name, parameters, conversation_id } = req.body;

    logger.info(`🔧 Tavus tool call: ${tool_name}`);

    let result: any;

    switch (tool_name) {
      case 'check_availability':
        result = await handleCheckAvailability(parameters);
        break;

      case 'book_inspection':
        result = await handleBookInspection(parameters, conversation_id);
        break;

      case 'check_service_area':
        result = await handleCheckServiceArea(parameters);
        break;

      default:
        result = { error: `Unknown tool: ${tool_name}` };
    }

    res.json(result);

  } catch (error: any) {
    logger.error(`❌ Tool call error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/roofing/tavus/persona
 *
 * Returns the Sarah persona configuration (for setup/debugging)
 */
router.get('/persona', (req: Request, res: Response) => {
  res.json({
    persona: SARAH_PERSONA,
    replica_id: TAVUS_REPLICA_ID,
    persona_id: TAVUS_PERSONA_ID
  });
});

// ============================================================================
// TOOL HANDLERS
// ============================================================================

async function handleCheckAvailability(params: any): Promise<any> {
  try {
    const availability = await calcom.checkAvailability(
      params.date_from,
      params.date_to
    );

    // Format for voice response
    const availableSlots = availability.slots
      .filter(s => s.available)
      .slice(0, 6); // Limit to 6 slots for voice

    if (availableSlots.length === 0) {
      return {
        success: true,
        message: "I don't see any available slots in that range. Would you like me to check a different week?",
        slots: []
      };
    }

    // Group by day
    const slotsByDay: Record<string, string[]> = {};
    for (const slot of availableSlots) {
      const date = new Date(slot.time);
      const dayKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      if (!slotsByDay[dayKey]) slotsByDay[dayKey] = [];
      slotsByDay[dayKey].push(timeStr);
    }

    // Build voice-friendly response
    let message = "Great news! I have availability:\n";
    for (const [day, times] of Object.entries(slotsByDay)) {
      message += `${day}: ${times.join(', ')}\n`;
    }
    message += "\nWhich works best for you?";

    return {
      success: true,
      message,
      slots: availableSlots
    };

  } catch (error: any) {
    logger.error(`Availability check failed: ${error.message}`);
    return {
      success: false,
      message: "I'm having trouble checking the calendar right now. Can I take your information and have someone call you back?",
      error: error.message
    };
  }
}

async function handleBookInspection(params: any, conversationId: string): Promise<any> {
  try {
    // Verify service area first
    const serviceCheck = await handleCheckServiceArea({ zip_code: params.property_zip });
    if (!serviceCheck.in_service_area) {
      return {
        success: false,
        message: `I'm sorry, but ${params.property_zip} is outside our current service area. We serve the Jacksonville, Orlando, Tampa, Pensacola, West Palm Beach, Daytona Beach, and Melbourne areas.`
      };
    }

    // Calculate appointment times
    const appointmentDate = new Date(params.appointment_date);
    const startHour = params.appointment_time_window === 'morning' ? 9 : 13;
    appointmentDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(appointmentDate);
    endDate.setHours(startHour + 3); // 3-hour window

    // Book via Cal.com
    const booking = await calcom.bookAppointment({
      eventTypeId: parseInt(process.env.CAL_EVENT_TYPE_ID || '0'),
      start: appointmentDate.toISOString(),
      end: endDate.toISOString(),
      name: params.customer_name,
      email: params.email || `${params.phone.replace(/\D/g, '')}@placeholder.roofingpros.com`,
      phone: params.phone,
      notes: params.roof_issue,
      location: params.property_address,
      metadata: {
        source: 'tavus_video_agent',
        conversation_id: conversationId,
        is_storm_damage: params.is_storm_damage,
        has_insurance_claim: params.has_insurance_claim
      }
    });

    // Create/update GHL contact
    const contact = await ghl.createOrUpdateContact({
      name: params.customer_name,
      phone: params.phone,
      email: params.email,
      tags: ['video-chat', 'appointment-scheduled'],
      customFields: {
        address: params.property_address,
        zip: params.property_zip,
        source: 'Tavus Video Chat',
        appointment_date: params.appointment_date,
        appointment_time: params.appointment_time_window,
        roof_issue: params.roof_issue,
        is_storm_damage: params.is_storm_damage ? 'Yes' : 'No',
        has_insurance_claim: params.has_insurance_claim ? 'Yes' : 'No'
      }
    });

    // Update Supabase
    await supabase.from('leads').upsert({
      phone: params.phone,
      first_name: params.customer_name.split(' ')[0],
      last_name: params.customer_name.split(' ').slice(1).join(' '),
      email: params.email,
      address: params.property_address,
      zip: params.property_zip,
      is_homeowner: true,
      issue_type: params.roof_issue,
      has_insurance_claim: params.has_insurance_claim || false,
      appointment_booked: true,
      appointment_date: params.appointment_date,
      appointment_time: params.appointment_time_window,
      pipeline_stage: 'inspection_booked',
      source: 'tavus_video',
      ghl_contact_id: contact?.id,
      cal_booking_id: booking.uid
    }, { onConflict: 'phone' });

    // Format date for voice response
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    logger.info(`✅ Inspection booked via Tavus: ${booking.uid}`);

    return {
      success: true,
      booking_id: booking.uid,
      message: `Wonderful! I've got you scheduled for ${formattedDate} in the ${params.appointment_time_window}. Our specialist will call you the morning of to confirm a specific time. You'll receive a confirmation text at ${params.phone}. Is there anything else I can help you with?`
    };

  } catch (error: any) {
    logger.error(`Booking failed: ${error.message}`);
    return {
      success: false,
      message: "I'm having a little trouble with the booking system. Let me take your information and have our team call you right back to confirm the appointment. What's the best number to reach you?"
    };
  }
}

async function handleCheckServiceArea(params: any): Promise<any> {
  const zip = params.zip_code?.toString().slice(0, 3);

  // Service area prefixes
  const serviceAreas: Record<string, string> = {
    '320': 'Jacksonville',
    '321': 'Jacksonville/Daytona Beach',
    '322': 'Jacksonville',
    '325': 'Pensacola',
    '327': 'Orlando',
    '328': 'Orlando',
    '329': 'Melbourne',
    '334': 'West Palm Beach',
    '335': 'Tampa',
    '336': 'Tampa',
    '337': 'Tampa',
    '347': 'Orlando'
  };

  const area = serviceAreas[zip];

  if (area) {
    return {
      success: true,
      in_service_area: true,
      service_area: area,
      message: `Great news! We service the ${area} area. I can help you schedule a free inspection.`
    };
  } else {
    return {
      success: true,
      in_service_area: false,
      message: `I'm sorry, but ${params.zip_code} is outside our current service area. We currently serve Jacksonville, Orlando, Tampa, Pensacola, West Palm Beach, Daytona Beach, and Melbourne.`
    };
  }
}

export default router;
