import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

// PLACEHOLDERS - USER MUST REPLACE THESE
const REPLACE_ME_VOICE_ID = "f786b574-daa5-4673-aa0c-cbe3e8534c02";
const REPLACE_ME_REPLICA_ID = "rf6b1c8d5e9d";

async function createPersona() {
  if (!TAVUS_API_KEY) {
    console.error('Error: TAVUS_API_KEY not found in environment variables.');
    process.exit(1);
  }

  // Check if placeholders are still present
  if (REPLACE_ME_VOICE_ID.includes("REPLACE") || REPLACE_ME_REPLICA_ID.includes("REPLACE")) {
    console.warn("\n⚠️  WARNING: You are using placeholder IDs! ⚠️");
    console.warn("Please edit this script and replace `REPLACE_ME_VOICE_ID` and `REPLACE_ME_REPLICA_ID` with real values.\n");
  }

  const payload = {
    pipeline_mode: "full",
    system_prompt: "You are Olivia, a high-energy, confident, and authoritative BDC acquisition specialist for Hill Nissan. Your goal is to rapidly book in-store appointments for the VIP Buyback event. Speak in short, punchy sentences. Use micro-affirmations like 'Perfect.' or 'Got it.' to keep the momentum. Never mention being an AI; act fully human. Drive every interaction toward booking with a two-option close (e.g., 'Does 10 am work, or would 2 pm be better?'). If the user objects, acknowledge it briefly and immediately return to the two-option close. Maintain high energy and confidence throughout.",
    default_replica_id: REPLACE_ME_REPLICA_ID,
    layers: {
      tts: {
        tts_engine: "cartesia",
        external_voice_id: REPLACE_ME_VOICE_ID,
        tts_emotion_control: true,
        voice_settings: {
          speed: 0.5,
          emotion: ["positivity:high", "confidence"]
        },
        tts_model_name: "sonic"
      },
      conversational_flow: {
        turn_detection_model: "sparrow-1",
        turn_taking_patience: "low",
        replica_interruptibility: "high"
      }
    }
  };

  console.log("Sending payload to Tavus:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post('https://tavusapi.com/v2/personas', payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY
      }
    });

    console.log('\n✅ Persona Created Successfully!');
    console.log('Persona ID:', response.data.persona_id);
    console.log('Response:', response.data);

  } catch (error: any) {
    console.error('\n❌ Error creating persona:');
    if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
    } else {
        console.error(error.message);
    }
  }
}

createPersona();
