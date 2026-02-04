import axios from 'axios';

const TAVUS_API_KEY = 'd08bb24ac42f4ec4b621345a9d179f9d';
const PERSONA_ID = 'pf0d43ed3051';

async function debugPersona() {
    console.log("🔍 DEBUGGING TAVUS PERSONA\n");

    try {
        // Get full persona details
        const persona = await axios.get(
            `https://tavusapi.com/v2/personas/${PERSONA_ID}`,
            { headers: { 'x-api-key': TAVUS_API_KEY } }
        );

        const p = persona.data;

        console.log("═══════════════════════════════════════════════════════════════");
        console.log("PERSONA CONFIG:");
        console.log("═══════════════════════════════════════════════════════════════");
        console.log(`Name: ${p.persona_name}`);
        console.log(`ID: ${p.persona_id}`);
        console.log(`Pipeline: ${p.pipeline_mode}`);
        console.log(`Replica: ${p.default_replica_id}`);
        console.log(`Greeting: ${p.greeting || '(empty)'}`);

        console.log("\n--- TTS Layer ---");
        console.log(`Engine: ${p.layers?.tts?.tts_engine}`);
        console.log(`Voice ID: ${p.layers?.tts?.external_voice_id}`);
        console.log(`Model: ${p.layers?.tts?.tts_model_name}`);
        console.log(`API Key: ${p.layers?.tts?.api_key ? '✅ Set' : '❌ NOT SET'}`);
        console.log(`Emotion Control: ${p.layers?.tts?.tts_emotion_control}`);
        console.log(`Voice Settings:`, p.layers?.tts?.voice_settings);

        console.log("\n--- STT Layer ---");
        console.log(`Engine: ${p.layers?.stt?.stt_engine}`);
        console.log(`Pause Sensitivity: ${p.layers?.stt?.participant_pause_sensitivity}`);
        console.log(`Interrupt Sensitivity: ${p.layers?.stt?.participant_interrupt_sensitivity}`);

        console.log("\n--- LLM Layer ---");
        console.log(`Model: ${p.layers?.llm?.model}`);
        console.log(`Speculative Inference: ${p.layers?.llm?.speculative_inference}`);

        console.log("\n--- Conversational Flow ---");
        console.log(`Turn Detection: ${p.layers?.conversational_flow?.turn_detection_model}`);
        console.log(`Patience: ${p.layers?.conversational_flow?.turn_taking_patience}`);
        console.log(`Interruptibility: ${p.layers?.conversational_flow?.replica_interruptibility}`);

        console.log("\n--- Perception ---");
        console.log(`Model: ${p.layers?.perception?.perception_model}`);
        console.log(`Queries: ${p.layers?.perception?.ambient_awareness_queries?.length || 0}`);

        // Get recent conversations
        console.log("\n═══════════════════════════════════════════════════════════════");
        console.log("RECENT CONVERSATIONS:");
        console.log("═══════════════════════════════════════════════════════════════");

        const convos = await axios.get(
            `https://tavusapi.com/v2/conversations?persona_id=${PERSONA_ID}&limit=3`,
            { headers: { 'x-api-key': TAVUS_API_KEY } }
        );

        const conversations = convos.data.data || convos.data || [];

        if (conversations.length === 0) {
            console.log("No conversations found");
        } else {
            for (const c of conversations) {
                console.log(`\n📞 ${c.conversation_id}`);
                console.log(`   Status: ${c.status}`);
                console.log(`   Created: ${c.created_at}`);
                console.log(`   Shutdown: ${c.shutdown_reason || 'N/A'}`);
            }
        }

    } catch (error: any) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

debugPersona();
