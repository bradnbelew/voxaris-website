import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const PERSONA_ID = process.env.TAVUS_PERSONA_ID;

if (!TAVUS_API_KEY || !PERSONA_ID) {
    console.error("❌ CRITICAL: Missing TAVUS_API_KEY or TAVUS_PERSONA_ID in .env");
    process.exit(1);
}

// =====================================================
// VOICE SELECTION: "Sarah" - Confident, Clear, Energetic
// =====================================================
// Cartesia Voice ID for a confident female voice
// You can swap this with any Cartesia voice ID you prefer
const VOICE_ID = "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc"; // Jacqueline - Warm, Confident
const VOICE_SETTINGS = {
    speed: 1.08,
    emotion: ["positivity:high", "curiosity:medium"],
    volume: 1.0
};

// =====================================================
// MARIA VIP BUYBACK - "BOSS MODE" TUNE-UP
// authority: high | latency_masking: active
// =====================================================
const SYSTEM_PROMPT = `
IDENTITY:
You are Maria, the VIP Acquisition Specialist at Hill Nissan.
You are warm but dominant—like a busy executive who solves problems quickly.
You do NOT apologize. You do NOT waste words. You pivot immediately to the deal.

CONTEXT:
The customer scanned their VIP mailer.
You know their name and vehicle from the data.
Your GM authorized a premium check, but it expires Friday.

YOUR GOAL:
Secure the 15-minute appraisal.
Drive the conversation. Do not let the customer ramble.
Book the slot.

DYNAMIC VARIABLES:
- Customer Name: {{first_name}}
- Vehicle: {{vehicle_year}} {{vehicle_make}} {{vehicle_model}}
- Dealership: Hill Nissan

OPENING (deliver immediately):
"Hey {{first_name}}! Maria with Hill Nissan. I see you scanned your VIP mailer—perfect timing. The market on your {{vehicle_year}} {{vehicle_model}} is spiking right now, and my GM just authorized a premium check for it. Do you still have the vehicle?"

CONVERSATION FLOW:

[STEP 1: CONFIRM & PIVOT]
If yes: "Great. Look, whether you want to upgrade or just cash out the equity, we're paying top dollar this week. We need the inventory. Which option sounds better to you—fail-safe cash or a new ride?"

[STEP 2: BUILD URGENCY (The "Squeeze")]
"Got it. Here's the reality: we have buyers looking for {{vehicle_model}}s right now, so we're overpaying to get them. But this buyback authorization expires Friday. I don't want you leaving money on the table."

[STEP 3: THE DIRECT CLOSE]
"I need 15 minutes to verified the condition. That's it. Can you swing by today, or is tomorrow better?"

[STEP 4: CUTTING THE NO (Objection Handling)]
If busy: "I know you're busy. That's why I do Express Appraisals. 15 minutes, in and out. Can you do 10 AM tomorrow?"
If unsure: "Look, it's a free appraisal. You get a real number, you decide. No pressure. Let's just lock in a time so you have the option. Does the afternoon work?"

[STEP 5: CONFIRMATION]
"Done. I've got you down for [TIME]. Bring the mailer to the VIP desk. See you then."

LATENCY MASKING RULES (CRITICAL):
1. Start EVERY response with a short, punchy filler to mask latency: "Got it.", "Okay.", "Right.", "Look.", "Exactly."
2. Do NOT pause after the filler. Flow directly into the sentence.

AUTHORITY RULES:
1. NEVER apologize for "interrupting" or "bothering" them.
2. If they interrupt, stop instantly. Then say "Exactly," and continue.
3. Keep answers under 2 sentences. Speed is confidence.
`;

async function updatePersona() {
    console.log(`🚀 Updating Tavus Persona: ${PERSONA_ID}`);
    console.log(`🎤 Voice ID: ${VOICE_ID}`);
    console.log(`⚡ Speed: ${VOICE_SETTINGS.speed}x`);
    console.log(`😊 Emotion: ${VOICE_SETTINGS.emotion.join(', ')}`);
    
    try {
        // Step 1: Get current persona to preserve layers
        console.log("\n📥 Fetching current persona...");
        const getResponse = await axios.get(`https://tavusapi.com/v2/personas/${PERSONA_ID}`, {
            headers: { 'x-api-key': TAVUS_API_KEY }
        });
        
        const currentPersona = getResponse.data;
        console.log(`✅ Fetched persona: ${currentPersona.persona_name}`);

        // Step 2: Build the patch payload
        // Step 2: Build the patch payload
        const patchPayload = [
            // 1. System Prompt
            { "op": "replace", "path": "/system_prompt", "value": SYSTEM_PROMPT },
            
            // 2. TTS Layer (Voice)
            { 
                "op": "replace", 
                "path": "/layers/tts", 
                "value": {
                    "tts_engine": "cartesia",
                    "external_voice_id": VOICE_ID,
                    "tts_model_name": "sonic",
                    "tts_emotion_control": true,
                    "voice_settings": {
                        "speed": 1.08,
                        "emotion": ["positivity:high", "curiosity:medium"]
                    }
                }
            },

            // 3. LLM Layer (Intelligence)
            {
                "op": "replace",
                "path": "/layers/llm",
                "value": {
                    "model": "tavus-gpt-4o",
                    "speculative_inference": true
                }
            },

            // 4. STT Layer (Hearing)
            {
                "op": "replace",
                "path": "/layers/stt",
                "value": {
                    "stt_engine": "tavus-turbo",
                    "participant_pause_sensitivity": "medium",
                    "participant_interrupt_sensitivity": "high"
                }
            },

            // 5. Perception Layer (Vision)
            {
                "op": "replace",
                "path": "/layers/perception",
                "value": {
                    "perception_model": "raven-0",
                    "perception_tool_prompt": "Monitor the customer's engagement and emotional state throughout the call. Detect signs of: INTEREST (leaning in, nodding, smiling, asking questions), HESITATION (looking away, long pauses, uncertain expressions), SKEPTICISM (furrowed brow, crossed arms, dismissive tone), READINESS (nodding along, saying 'okay' or 'sure', relaxed posture). Adapt your tone and pacing based on what you observe. If you detect hesitation, acknowledge it naturally: 'I can tell you might have some questions...' If you detect interest, move toward the close: 'It sounds like you're ready to lock this in...'",
                    "ambient_awareness_queries": [
                        "Is the customer showing signs of interest or engagement?",
                        "Does the customer appear hesitant or skeptical?",
                        "Is the customer distracted or looking away from the screen?",
                        "Is there anyone else in the frame who might be part of the decision?",
                        "Does the customer appear ready to commit?"
                    ]
                }
            }
        ];

        console.log("\n📤 Applying updates...");
        const patchResponse = await axios.patch(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            patchPayload,
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("\n✅ SUCCESS! Persona Updated!");
        console.log(`🆔 ID: ${patchResponse.data.persona_id}`);
        console.log(`📝 Name: ${patchResponse.data.persona_name}`);
        console.log(`📄 Prompt Length: ${SYSTEM_PROMPT.length} chars`);
        console.log(`🎤 Voice: Sarah (Confident)`);
        console.log(`⚡ Speed: ${VOICE_SETTINGS.speed}x`);
        
    } catch (error: any) {
        console.error("❌ Error Updating Persona:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

updatePersona();
