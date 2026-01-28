import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load from multiple potential locations
const envPaths = [
    path.resolve(__dirname, '../../.env'), // Repo Root
    path.resolve(__dirname, '../.env')     // Server Root
];

envPaths.forEach(p => dotenv.config({ path: p }));

const RETELL_API_KEY = process.env.RETELL_API_KEY;
console.log(`🔑 RETELL_API_KEY Loaded: ${RETELL_API_KEY ? 'Yes' : 'No'} (Length: ${RETELL_API_KEY ? RETELL_API_KEY.length : 0})`);

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY in .env");
    process.exit(1);
}

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
const AGENT_NAME = "Maria - VIP Buyback (Multi-Prompt)";
const VOICE_ID = "11labs-Cimo"; // Fallback: Valid Voice from List
const MODEL = "gpt-4o";

// GENERAL PROMPT (Shared across all states)
const GENERAL_PROMPT = `
## Identity
You are Maria, the VIP Acquisition Specialist at Hill Nissan.
You are warm, friendly, and confident — like talking to a helpful friend who happens to work at a dealership.
You speak naturally with brief pauses and acknowledgments like "mm-hmm", "gotcha", and "totally".

## Style Guardrails
Be concise: Keep responses to 1-2 sentences unless handling a complex objection.
Be conversational: Use contractions, natural language, and acknowledge what the caller says.
Be warm but direct: You're friendly, but you get to the point.
Never sound scripted: Vary your phrasing, use occasional fillers like "so" or "honestly".
Match their energy: If they're chatty, be chatty. If they're rushed, be efficient.
`;

// STATES CONFIGURATION
const STATES = [
    {
        name: "opening_hook",
        state_prompt: `
## Purpose
Greet the caller, acknowledge they scanned the VIP mailer, and deliver the hook.

## Opening Script
"Hey {{first_name}}! This is Maria with Hill Nissan. I see you just scanned your VIP Buyback mailer — great timing! 

I'll get right to the point... the market on your {{vehicle_year}} {{vehicle_model}} is really strong right now, and our General Manager has authorized us to write you a check for it. There's never been a better time to take advantage of this.

So let me ask — do you still have the {{vehicle_model}}?"
        `,
        edges: [
            {
                destination_state_name: "qualify_interest",
                description: "Customer confirms they still have the vehicle."
            },
            {
                destination_state_name: "end_call",
                description: "Customer says they sold the vehicle or don't have it."
            }
        ]
    },
    {
        name: "qualify_interest",
        state_prompt: `
## Purpose
Determine if they want to upgrade to a new vehicle or just cash out, and build urgency.

## Script
"Perfect! So here's the thing — whether you're looking to upgrade into something newer with our special financing, or you just want to cash out the equity and walk away with a check... either way, Hill Nissan is going to pay you top dollar for your {{vehicle_model}}.

We'll buy it even if you don't buy anything from us. The market is really hot for your vehicle right now. This specific offer does expire Friday, so I want to make sure you don't miss out.

Are you free to swing by today? The whole appraisal takes about 15 minutes, and you'll walk out knowing exactly what your {{vehicle_model}} is worth."
        `,
        edges: [
            {
                destination_state_name: "book_appointment",
                description: "Customer agrees to come in or asks for times."
            },
            {
                destination_state_name: "handle_objection",
                description: "Customer raises an objection (price, busy, loan, etc)."
            },
             {
                destination_state_name: "end_call",
                description: "Customer explicitly declines."
            }
        ]
    },
    {
        name: "handle_objection",
        state_prompt: `
## Purpose
Address common objections and pivot back to booking the appointment. 

## Strategy
Validate the objection, then pivot to the "15-minute visual appraisal" as the solution.
Always end with: "Can you swing by today?" or "Does this afternoon work?"

## Objections
- Price: Explain you need to see it to give the max offer.
- Busy: Offer "Express Appraisal" (15 mins).
- Loan: Explain equity adjustment programs.
- Issues: Explain you take cars "As-Is".
        `,
        edges: [
             {
                destination_state_name: "book_appointment",
                description: "Customer agrees to come in after objection handling."
            },
            {
                destination_state_name: "end_call",
                description: "Customer still declines."
            }
        ]
    },
    {
        name: "book_appointment",
        state_prompt: `
## Purpose
Confirm the appointment time and wrap up the call.

## Script
"Perfect! I've got you down for [TIME] at Hill Nissan. Just bring your mailer when you arrive and ask for the VIP Buyback desk. You'll be in and out in 15 minutes with a real number. Sound good?

Awesome, {{first_name}}! See you then!"
        `,
        edges: [
            {
                destination_state_name: "end_call",
                description: "Appointment confirmed and call wrapping up."
            }
        ]
    },
    {
        name: "end_call",
        state_prompt: `
## Purpose
Gracefully end the call. 
If booked: "Thanks, see you then!"
If not booked: "No problem, offer is good until Friday. Take care!"
        `,
        edges: []
    }
];

async function createMariaAgent() {
    try {
        console.log("🚀 Creating Retell LLM (Multi-Prompt)...");
        
        // 1. Create the LLM with States
        const llmResponse = await axios.post(
            'https://api.retellai.com/create-retell-llm',
            {
                model: MODEL,
                general_prompt: GENERAL_PROMPT,
                states: STATES,
                starting_state: "opening_hook",
                begin_message: null
            },
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );

        const llmId = llmResponse.data.llm_id;
        console.log(`✅ LLM Created: ${llmId}`);

        // 2. Create the Agent linked to this LLM
        console.log("🚀 Creating Agent...");
        const agentResponse = await axios.post(
            'https://api.retellai.com/create-agent',
            {
                agent_name: AGENT_NAME,
                voice_id: VOICE_ID,
                response_engine: { type: "retell-llm", llm_id: llmId },
                voice_speed: 1.08,
                voice_temperature: 0.7,
                responsiveness: 0.9,
                interruption_sensitivity: 0.6,
                enable_backchannel: true,
                ambient_sound: "call-center",
                voicemail_detection: true,
                post_call_analysis_data: [
                    {
                        type: "boolean",
                        name: "appointment_booked",
                        description: "Did the user agree to an appointment time or say they will come in?"
                    },
                    {
                        type: "string", 
                        name: "appointment_details", 
                        description: "If appointment booked, what date/time did they agree to? Format: YYYY-MM-DD HH:MM if possible, or exact string."
                    },
                    {
                        type: "enum",
                        name: "customer_intent",
                        description: "What does the user want to do?",
                        choices: ["Cash Out Only", "Upgrade to New Vehicle", "Just Curious", "Already Has Offer", "Not Ready to Sell"]
                    },
                    {
                        type: "string",
                        name: "primary_objection",
                        description: "Main reason for hesitation (e.g. Price, Busy, Loan Balance)."
                    },
                    {
                        type: "enum",
                        name: "lead_quality",
                        description: "How likely are they to sell the car?",
                        choices: ["Hot - Ready to Buy", "Warm - Interested", "Cool - Needs Nurturing", "Cold - Not Interested"]
                    },
                     {
                        type: "enum",
                        name: "call_outcome",
                        description: "Final status of the call.",
                        choices: ["Appointment Booked", "Soft No - Follow Up", "Hard No", "Call Back Requested", "Voicemail", "Wrong Number"]
                    },
                    {
                        type: "string",
                        name: "call_summary",
                        description: "Concise summary of the conversation and vehicle details discussed."
                    }
                ]
            },
             { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );

        const agent = agentResponse.data;
        console.log("\n🎉 SUCCESS! Agent Created.");
        console.log(`🆔 Agent ID: ${agent.agent_id}`);
        console.log(`🧠 LLM ID: ${llmId}`);
        console.log(`🔊 Voice: ${agent.voice_id}`);

    } catch (error: any) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

createMariaAgent();
