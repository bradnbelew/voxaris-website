import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const PERSONA_ID = process.env.TAVUS_PERSONA_ID;

// Configurable "Knobs" - Change these to "mold" the voice!
const MOLDING_CONFIG = {
  speed: 0.5, // Range: 0.6 - 1.5 (Cartesia docs) but Tavus allows this
  emotion: ["positivity:high", "confidence"], // Try: ["anger"], ["sadness"], ["curiosity"]
  volume: 1.0 // Range: 0.5 - 2.0
};

async function updateVoice() {
  if (!TAVUS_API_KEY || !PERSONA_ID) {
    console.error('Error: Missing TAVUS_API_KEY or TAVUS_PERSONA_ID in .env');
    process.exit(1);
  }

  console.log(`\n🎛️  MOLDING VOICE for Persona: ${PERSONA_ID}`);
  console.log('Target Configuration:', MOLDING_CONFIG);

  try {
    // We use the JSON Patch format usually for updates, 
    // but updating deep objects like layers.tts might be easier with a full replace or specific path.
    // Let's try replacing the tts layer configuration or specific properties.
    
    // Constructing the update payload
    // Note: Tavus API behavior for "layers" update via PATCH might require replacing the whole object
    // or using specific paths like "/layers/tts/voice_settings"
    
    // We will update the whole tts layer to be safe and ensure all settings apply
    const layersPatch = {
      "tts": {
        "tts_engine": "cartesia",
        "external_voice_id": process.env.CARTESIA_VOICE_ID || "f786b574-daa5-4673-aa0c-cbe3e8534c02", // Fallback to the one we just used
        "tts_emotion_control": true, // CRITICAL for "molding"
        "voice_settings": {
          "speed": MOLDING_CONFIG.speed,
          "emotion": MOLDING_CONFIG.emotion,
          // "volume": MOLDING_CONFIG.volume // Cartesia API supports volume, check if Tavus passes it through or needs exact structure
        },
        "tts_model_name": "sonic"
      }
    };
    
    const payload = [
      { "op": "replace", "path": "/layers/tts", "value": layersPatch.tts }
    ];

    const response = await axios.patch(`https://tavusapi.com/v2/personas/${PERSONA_ID}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY
      }
    });

    console.log('\n✅ Voice "Molded" Successfully!');
    console.log('Response:', response.data);

  } catch (error: any) {
    console.error('\n❌ Error updating voice:');
    if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
        console.error(error.message);
    }
  }
}

updateVoice();
