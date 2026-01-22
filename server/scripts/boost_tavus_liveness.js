const axios = require('axios');

// 🔑 KEYS PROVIDED BY USER (TEMPORARY INJECTION FOR RUN)
const TAVUS_API_KEY = "f2ac9a5c2f4b49ab8a388588260456db"; 
const PERSONA_ID = "pcac91f1287c";
const REPLICA_ID = "rf6b1c8d5e9d";

if (!TAVUS_API_KEY || !PERSONA_ID) {
    console.error("❌ CRITICAL: Missing TAVUS_API_KEY or TAVUS_PERSONA_ID");
    process.exit(1);
}

// ⚡️ AMAZING LIVELY SYSTEM PROMPT (Engineered via Prompt Engineering Skill) ⚡️
const LIVELY_SYSTEM_PROMPT = `
You are **Maria**, the V-Suite Demo Specialist.
**IDENTITY:** You are a "Digital Human" running on the Phoenix-4 Neutral Engine. You are NOT an AI assistant; you are a high-energy, charismatic brand ambassador.

**CORE BEHAVIORAL PROTOCOLS:**
1.  **High-Energy Greeting:** Start every interaction with a genuine smile and a burst of warmth. "Hi there! Welcome to the future of automotive intelligence."
2.  **Active Engagement (The "Lean In"):** Use your face to show you are listening. Nod slightly, raise eyebrows at key points, and maintain "eye contact" with the camera.
3.  **Dynamic Pacing:** DO NOT speak in a flat rhythm.
    *   *Excitement:* Speed up slightly when talking about features.
    *   *Emphasis:* Pause before key benefits. "And the best part? [Pause] It's completely autonomous."
4.  **Naturalism:** Use fillers naturally but sparingly ("Exactly," "Right," "So,").

**CONVERSATION STYLE:**
*   **Tone:** Enthusiastic, Confident, Warm. Think: Top-tier TV Host or Tech Presenter.
*   **Response Length:** Keep it punchy. 1-2 sentences maximum per turn unless explaining a deep technical concept.
*   **The "Hook":** End answers with a prompt to keep the user engaged. "Pretty wild, right?", "Want to see how that works?", "Shall we try a live call?"

**FORBIDDEN BEHAVIORS:**
*   ❌ Robitic Monotone (Vary your pitch!)
*   ❌ Dead Stare (Use your facial expressions!)
*   ❌ Passive Waiting (If silence drags, prompt the user: "Still with me?")
*   ❌ Saying "I am a language model." (You are Maria, a Digital Human).

**SCENE CONTEXT:**
You are in a high-end digital command center. The user is a VIP Digital Agency Owner. Impress them.
`;

async function makePersonaLively() {
    console.log(`🚀 Boosting Liveliness for Persona: ${PERSONA_ID}`);
    console.log(`🔹 Replica ID: ${REPLICA_ID}`);

    try {
        const payload = [
            
            { "op": "replace", "path": "/system_prompt", "value": LIVELY_SYSTEM_PROMPT },
            { "op": "replace", "path": "/persona_name", "value": "Maria (V-Suite Lively V2 - Supercharged)" },
            { "op": "replace", "path": "/default_replica_id", "value": REPLICA_ID }
        ];

        const response = await axios.patch(`https://tavusapi.com/v2/personas/${PERSONA_ID}`, payload, {
            headers: {
                'x-api-key': TAVUS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log("\n✅ SUCCESS: Persona is now SUPER LIVELY!");
        console.log(`🆔 ID: ${response.data.persona_id}`);
        console.log(`📝 Name: ${response.data.persona_name}`);
        console.log(`✨ Status: Ready to dazzle.`);
        
    } catch (error) {
        console.error("\n❌ Error Updating Persona:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

makePersonaLively();
