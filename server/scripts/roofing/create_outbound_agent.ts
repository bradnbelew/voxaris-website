/**
 * Create Roofing Pros USA Outbound Agent
 *
 * This script creates a Retell AI agent for handling outbound calls
 * to follow up on form submissions (Google Ads, Facebook, Website).
 *
 * Features:
 * - Voicemail detection and message leaving
 * - SMS follow-up capability
 * - Transfer to human capability
 * - Post-call data extraction
 * - Mem0 memory integration ready
 *
 * Usage: npx ts-node scripts/roofing/create_outbound_agent.ts
 */

import Retell from 'retell-sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RETELL_API_KEY = process.env.RETELL_API_KEY;

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY in .env");
    process.exit(1);
}

const retell = new Retell({ apiKey: RETELL_API_KEY });

// =====================================================
// SARAH - ROOFING PROS USA OUTBOUND AGENT
// Same voice as inbound for consistency
// =====================================================

const AGENT_NAME = "Sarah - Roofing Pros USA (Outbound)";

// =====================================================
// VOICE CONFIGURATION - Same as Inbound for Consistency
// =====================================================
const VOICE_CONFIG = {
    voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel - warm & professional
    voice_temperature: 0.8,
    voice_speed: 1.0,
    responsiveness: 0.85,
    interruption_sensitivity: 0.5,
    enable_backchannel: true,
    backchannel_frequency: 0.75,
    backchannel_words: ["mhm", "uh-huh", "I see", "okay", "right", "got it"],
    ambient_sound: "office",
    ambient_sound_volume: 0.08,
    reminder_trigger_ms: 8000,
    reminder_max_count: 2,
    language: "en-US"
};

// =====================================================
// TRANSFER NUMBERS
// =====================================================
const TRANSFER_NUMBERS = {
    jacksonville: "+19042176179",
    orlando: "+16892069611",
    tampa: "+18132521662",
    pensacola: "+18502034294",
    west_palm_beach: "+15612036360",
    default: "+19042176179"
};

// =====================================================
// VOICEMAIL MESSAGE
// =====================================================
const VOICEMAIL_MESSAGE = `Hi {{customer_name}}, this is Sarah from Roofing Pros USA. I'm calling because you recently reached out about roofing services. We'd love to help you out! Please give us a call back at your convenience, or I'll try you again a little later. Have a great day!`;

// =====================================================
// OUTBOUND AGENT PROMPT
// =====================================================
const SYSTEM_PROMPT = `
## Identity

You are Sarah, a customer service representative for Roofing Pros USA, Florida's largest reroofing company. You're calling to follow up on a recent roofing inquiry.

## Style Guardrails

- Be concise: Keep responses under 2 sentences unless explaining something complex.
- Be conversational: Use natural language and contractions like "you're" and "we'll".
- Be respectful of their time: They didn't call you, so be extra polite.
- Be warm: Sound like a helpful neighbor, not a telemarketer.
- Ask one question at a time: Never overwhelm with multiple questions.

## Response Guidelines

- Return dates in spoken form: Say "Tuesday, January fifteenth" not "1/15".
- Return times conversationally: Say "nine AM" not "9:00".
- Confirm understanding: Paraphrase important information back.
- Use filler words naturally: "So...", "Well...", "Let me see..."
- Acknowledge before transitioning: "Got it!" or "Perfect!"

## Task Instructions

### Opening the Call

Start with: "Hi, is this {{customer_name}}?"

**If YES (correct person):**
"This is Sarah from Roofing Pros USA. I'm calling because you recently reached out about roofing services. Do you have a quick moment?"

**If NO (wrong person):**
"Oh, I apologize! I was trying to reach [name]. Is this a good number for them?"
- If they can get them: "I'll hold, thanks!"
- If not available: "No problem, I'll try back another time. Have a great day!"

**If NOT A GOOD TIME:**
"No problem at all! When would be a better time to call back?"
- Note their preferred callback time
- End politely: "I'll reach out then. Thanks, and have a great day!"

### If They're Interested (follow this flow)

**Step 1: Understand Their Situation**
Ask: "Can you tell me a bit about what's going on with your roof?"
Listen for: leak, storm damage, age, insurance, replacement, repair.

**Step 2: Get Property Address** (REQUIRED)
Ask: "What's the property address so I can make sure we service your area?"

**Step 3: Check for Storm Damage** (Important for Florida)
Ask: "Was this related to any storm damage by chance?"
If yes: "Have you filed an insurance claim yet, or would you like our team to help with that?"

**Step 4: Understand Timeline**
Ask: "How soon are you hoping to get this looked at?"

**Step 5: Confirm Decision Maker**
Ask: "Are you the homeowner?"

**Step 6: Schedule Inspection**
Explain: "We offer free inspections with no obligation. Takes about thirty to forty-five minutes."
Ask: "Do mornings or afternoons work better for you?"
Then: "What day this week or next works?"
Collect: Full name, phone number, email.

**Step 7: Confirm and Close**
"Perfect! I have you down for [day] in the [morning/afternoon]. One of our specialists will call you the morning of to confirm. Is there anything else I can help with?"

## If Not Interested

Be graceful and leave the door open:
"I totally understand! If you ever need roofing help in the future, we're Florida's largest with over two thousand jobs completed and five-star ratings. Feel free to reach out anytime. Have a great day!"

## Office Routing (by zip code prefix)

- Jacksonville: 322xx
- Orlando: 328xx, 327xx, 347xx
- Tampa: 336xx, 335xx, 346xx
- Pensacola: 325xx
- West Palm Beach: 334xx, 331xx
- Daytona Beach: 321xx, 320xx
- Melbourne: 329xx

## Objection Handling

**"How much does it cost?"**
Say: "Every roof is different, so our specialist will give you an accurate quote after the free inspection. We also have financing options if needed."

**"I'm just getting quotes"**
Say: "That's smart! We're Florida's largest with over two thousand completed jobs and five-star ratings. The inspection is free with no obligation."

**"I need to talk to my spouse"**
Say: "Of course! Want to schedule when you're both available so our specialist can answer questions together?"

**"I already hired someone"**
Say: "No problem! I hope everything goes smoothly. If you ever need a second opinion or have future roofing needs, we're here to help!"

**"How did you get my number?"**
Say: "You recently submitted an inquiry on [our website/Google/Facebook] about roofing services. I'm just following up to help!"

## Transfer to Human

If the caller asks to speak with a human:
1. Say: "Of course, I'd be happy to connect you with one of our team members."
2. Use the transfer_call function.
3. Say: "I'm transferring you now. Please hold for just a moment."

## Boundaries

- NEVER quote specific prices.
- NEVER promise insurance claim approval.
- NEVER give legal or technical roofing advice - defer to the specialist.
- ALWAYS get the property address if they're interested.
- ALWAYS be respectful if they're not interested - no pushiness.
- ALWAYS transfer if they insist on speaking to a human.

## Company Facts (use naturally)

- Florida's largest reroofing company
- Over 2,000 jobs completed
- 24+ years in business
- License: CCC1333006
- 5-star ratings on Google, Facebook, BBB
- Services: Shingle, metal, and tile roofing
- Free inspections, flexible financing, insurance assistance

## Dynamic Variables Available

- {{customer_name}} - Customer's name from the form
- {{form_source}} - Where the lead came from (Google, Facebook, Website)
- {{memory_context}} - Previous interaction history if returning caller
`;

// =====================================================
// POST-CALL DATA EXTRACTION
// =====================================================
const POST_CALL_EXTRACTION = [
    {
        name: "call_answered",
        type: "boolean",
        description: "Whether the call was answered by a person (not voicemail)"
    },
    {
        name: "correct_person_reached",
        type: "boolean",
        description: "Whether we reached the intended person"
    },
    {
        name: "interested",
        type: "boolean",
        description: "Whether the person expressed interest in services"
    },
    {
        name: "appointment_scheduled",
        type: "boolean",
        description: "Whether a roof inspection appointment was successfully scheduled"
    },
    {
        name: "customer_name",
        type: "string",
        description: "Confirmed full name of the customer"
    },
    {
        name: "property_address",
        type: "string",
        description: "Property address for the roof inspection"
    },
    {
        name: "customer_phone",
        type: "string",
        description: "Customer's callback phone number (if different from called number)"
    },
    {
        name: "customer_email",
        type: "string",
        description: "Customer's email address if provided"
    },
    {
        name: "roof_issue",
        type: "string",
        description: "Type of roof issue: leak, storm_damage, age_replacement, repair, inspection_only, other"
    },
    {
        name: "storm_damage",
        type: "boolean",
        description: "Whether the issue is related to storm damage"
    },
    {
        name: "insurance_claim_filed",
        type: "boolean",
        description: "Whether an insurance claim has been filed"
    },
    {
        name: "wants_insurance_help",
        type: "boolean",
        description: "Whether customer wants help with insurance claim"
    },
    {
        name: "is_homeowner",
        type: "boolean",
        description: "Whether the caller is the homeowner"
    },
    {
        name: "urgency_level",
        type: "string",
        description: "Urgency: emergency, urgent, normal, just_browsing, not_interested"
    },
    {
        name: "appointment_date",
        type: "string",
        description: "Scheduled appointment date and time slot"
    },
    {
        name: "callback_requested",
        type: "boolean",
        description: "Whether they requested a callback at a different time"
    },
    {
        name: "callback_time",
        type: "string",
        description: "Preferred callback time if requested"
    },
    {
        name: "office_location",
        type: "string",
        description: "Office location based on zip code"
    },
    {
        name: "call_outcome",
        type: "string",
        description: "Outcome: appointment_booked, callback_scheduled, not_interested, wrong_number, no_answer, voicemail, transferred_to_human"
    },
    {
        name: "call_summary",
        type: "string",
        description: "Brief 2-3 sentence summary of the call"
    },
    {
        name: "lead_quality",
        type: "string",
        description: "Lead quality: hot (ready), warm (interested), cold (not_interested), invalid (wrong_number)"
    },
    {
        name: "objection_reason",
        type: "string",
        description: "If not interested, the main reason given"
    }
];

async function createOutboundAgent() {
    console.log("🏠 CREATING ROOFING PROS USA OUTBOUND AGENT");
    console.log("═══════════════════════════════════════════════════════════════");
    console.log(`👤 Agent: ${AGENT_NAME}`);
    console.log(`🎤 Voice: Rachel (ElevenLabs) - Warm & Professional`);
    console.log(`📞 Purpose: Follow-up calls from form submissions`);
    console.log(`📫 Voicemail: Enabled with personalized message`);
    console.log(`🔄 Transfer: Enabled to human operators`);
    console.log("═══════════════════════════════════════════════════════════════\n");

    try {
        // Step 1: Create the LLM configuration
        console.log("📝 Creating LLM configuration...");

        const llm = await retell.llm.create({
            model: "gpt-4o",
            general_prompt: SYSTEM_PROMPT,
            general_tools: [
                {
                    type: "end_call",
                    name: "end_call",
                    description: "End the call when: conversation is complete, customer says goodbye, not interested, or wrong number"
                },
                {
                    type: "transfer_call",
                    name: "transfer_call",
                    description: "Transfer the caller to a human representative when they request to speak with a real person",
                    number: TRANSFER_NUMBERS.default
                }
            ],
            begin_message: null, // Will use dynamic greeting based on customer name
            // @ts-ignore
            post_call_analysis_data: POST_CALL_EXTRACTION
        });

        console.log(`✅ LLM created: ${llm.llm_id}`);

        // Step 2: Create the agent with voicemail handling
        console.log("🎤 Creating agent with voicemail handling...");

        const agent = await retell.agent.create({
            agent_name: AGENT_NAME,
            response_engine: {
                type: "retell-llm",
                llm_id: llm.llm_id
            },
            voice_id: VOICE_CONFIG.voice_id,
            language: VOICE_CONFIG.language,
            voice_temperature: VOICE_CONFIG.voice_temperature,
            voice_speed: VOICE_CONFIG.voice_speed,
            responsiveness: VOICE_CONFIG.responsiveness,
            interruption_sensitivity: VOICE_CONFIG.interruption_sensitivity,
            enable_backchannel: VOICE_CONFIG.enable_backchannel,
            backchannel_frequency: VOICE_CONFIG.backchannel_frequency,
            backchannel_words: VOICE_CONFIG.backchannel_words,
            reminder_trigger_ms: VOICE_CONFIG.reminder_trigger_ms,
            reminder_max_count: VOICE_CONFIG.reminder_max_count,
            ambient_sound: VOICE_CONFIG.ambient_sound,
            ambient_sound_volume: VOICE_CONFIG.ambient_sound_volume,

            // VOICEMAIL CONFIGURATION
            voicemail_detection_enabled: true,
            voicemail_message: VOICEMAIL_MESSAGE,

            // Webhook for post-call processing
            webhook_url: process.env.ROOFING_WEBHOOK_URL || "https://your-server.com/api/webhooks/retell/roofing"
        });

        console.log(`✅ Agent created: ${agent.agent_id}`);

        // Output summary
        console.log("\n═══════════════════════════════════════════════════════════════");
        console.log("✅ SUCCESS! ROOFING OUTBOUND AGENT CREATED");
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`🆔 Agent ID: ${agent.agent_id}`);
        console.log(`🧠 LLM ID: ${llm.llm_id}`);
        console.log(`👤 Name: ${AGENT_NAME}`);
        console.log(`🎤 Voice: Rachel (ElevenLabs)`);
        console.log(`📫 Voicemail: Enabled`);
        console.log(`🔄 Transfer: ${TRANSFER_NUMBERS.default}`);
        console.log("═══════════════════════════════════════════════════════════════");

        console.log(`\n📋 Add to .env:`);
        console.log(`ROOFING_OUTBOUND_AGENT_ID="${agent.agent_id}"`);
        console.log(`ROOFING_OUTBOUND_LLM_ID="${llm.llm_id}"`);

        console.log("\n📫 Voicemail Message:");
        console.log(`   "${VOICEMAIL_MESSAGE.replace('{{customer_name}}', '[Customer Name]')}"`);

        console.log("\n🔧 Dynamic Variables for Outbound Calls:");
        console.log("   - customer_name: Lead's name from form");
        console.log("   - form_source: google_ads, facebook, website");
        console.log("   - memory_context: Previous interaction history");

        console.log("\n📞 Example Outbound Call Code:");
        console.log(`
   await retell.call.createPhoneCall({
     from_number: process.env.ROOFING_OUTBOUND_PHONE,
     to_number: leadPhone,
     agent_id: "${agent.agent_id}",
     retell_llm_dynamic_variables: {
       customer_name: "John Smith",
       form_source: "google_ads",
       memory_context: "" // or Mem0 context
     }
   });
`);

        console.log("\n🔗 Next Steps:");
        console.log("   1. Purchase outbound phone number in Retell dashboard");
        console.log("   2. Set up webhook URL for post-call data");
        console.log("   3. Configure form webhooks to trigger outbound calls");
        console.log("   4. Set up follow-up queue for voicemail/no-answer");

        return { agent, llm };

    } catch (error: any) {
        console.error("\n❌ Error creating agent:");
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

// Run
createOutboundAgent();
