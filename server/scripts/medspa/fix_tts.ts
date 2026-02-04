import axios from 'axios';

const TAVUS_API_KEY = 'd08bb24ac42f4ec4b621345a9d179f9d';
const PERSONA_ID = 'pf0d43ed3051';
const CARTESIA_API_KEY = 'sk_car_r21FsScPtF8m7pruUbsV2R';

async function fixTTS() {
    console.log("🔧 Fixing TTS configuration with full layer replacement...");

    // Replace entire TTS layer to ensure API key is set
    const payload = [
        {
            op: "replace",
            path: "/layers/tts",
            value: {
                tts_engine: "cartesia",
                external_voice_id: "9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
                tts_model_name: "sonic-3",
                tts_emotion_control: true,
                api_key: CARTESIA_API_KEY,
                voice_settings: {
                    speed: 1,
                    volume: 1,
                    emotion: ["excited"]
                }
            }
        }
    ];

    try {
        const response = await axios.patch(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            payload,
            {
                headers: {
                    'x-api-key': TAVUS_API_KEY,
                    'Content-Type': 'application/json-patch+json'
                }
            }
        );

        console.log("✅ Cartesia API key added to TTS layer!");
        console.log("TTS Config:", JSON.stringify(response.data.layers?.tts, null, 2));
    } catch (error: any) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

fixTTS();
