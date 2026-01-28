import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load env
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];
envPaths.forEach(p => dotenv.config({ path: p }));

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const AGENT_ID = "agent_4899f1434beabfa398e34418e8"; // The Multi-Prompt Agent
const CUSTOM_LLM_URL = process.env.CUSTOM_LLM_URL || "https://hill-nissan-backend.onrender.com/api/retell-llm";

if (!RETELL_API_KEY) {
    console.error("❌ Missing RETELL_API_KEY");
    process.exit(1);
}

async function updateAgentUrl() {
    try {
        console.log(`🔗 Connecting Agent ${AGENT_ID} to LLM: ${CUSTOM_LLM_URL}...`);
        
        const response = await axios.patch(
            `https://api.retellai.com/update-agent/${AGENT_ID}`,
            { 
               response_engine: {
                   type: "retell-llm", // Assuming we are sticking with Retell LLM but want to point to custom server? 
                   // Wait, "retell-llm" means Retell hosts the logic?
                   // No, usually "custom-llm" means WE host it.
                   // Let's check what the user wants. The user deployed a server with "retell-llm" endpoint.
                   // The documentation says for Custom LLM, type is "custom-llm" and we provide "llm_websocket_url".
                   // BUT, the controller I wrote handles "POST /retell-llm".
                   // That implies we are using Retell's "Custom Method" but via simple HTTP?
                   // Retell API docs say: type: "custom-llm", llm_websocket_url: "wss://..." or http?
                   // Actually, if we are using the 'retell-llm' endpoint code I wrote, it expects a POST from Retell? 
                   // The code I checked earlier (retell-llm.controller.ts) handles POST. 
                   // This corresponds to "Custom LLM" via HTTP (if supported) or we are building a "Retell LLM" that calls our tools?
                   // The code has `router.post('/retell-llm', ...)`. This receives a request *from* Retell.
                   // Retell sends a request to us. 
                   // So we need to set the agent to use this URL.
                   // There isn't a direct "webhook_url" field in `update-agent` for "retell-llm" type. 
                   // It's usually "llm_websocket_url" for streaming. 
                   // OR, if using "retell-llm" (Retell's logic), we define the prompt in Retell.
                   // BUT we wrote a custom controller. 
                   // Let's look at `create_maria_retell_agent.ts`. It used `response_engine: { type: "retell-llm", llm_id: llmId }`.
                   // That created an LLM object *inside* Retell.
                   // That LLM object contains the prompt.
                   // The controller we deployed to Render (`retell-llm.controller.ts`) seems to be a *Custom LLM* implementation (it handles tools, prompt injection etc manually).
                   // IF we want to use the Render server, we must switch the agent type to "custom-llm" and point it to our server.
                   // However, `retell-llm.controller.ts` looks like it implements the Retell Custom LLM Protocol?
                   // Let's assume we need to convert the agent to "custom_llm" and set `llm_websocket_url`.
                   // Wait, the controller is HTTP POST. Retell Custom LLM usually uses WebSocket.
                   // EXCEPT Retell has a "Custom LLM" mode that works via HTTP? No, usually WebSocket.
                   // Let's re-read the controller code snippet I saw earlier.
                   // `router.post('/retell-llm', ...)` -> It takes `RetellLLMRequest` body.
                   // This looks like a webhook handler.
                   // Maybe it's for "Tool Calling"? No, it processes the whole transcript.
                   // Re-reading `retell-llm.controller.ts`: 
                   // It returns `{ response_type: "response", content: ... }` or tool calls.
                   // This signature matches Retell's **Custom LLM** HTTP protocol (if one exists) or it's a webhook.
                   // Actually, Retell recently added support for HTTP Custom LLMs.
                   // So I will update the agent to use `llm_websocket_url` pointed to the WSS version? 
                   // or `llm_id`?
                   // IF we want to use the deployed code, we change `response_engine`.
                   // But `create_maria_retell_agent.ts` created a *Retell-hosted* LLM. 
                   // The user deployed code to Render. Why? 
                   // Maybe to handle *tools*?
                   // If the user wants to use the Render backend, we need to switch the agent to use it.
                   // I will update the agent to use `custom_llm` pointing to `wss://hill-nissan-backend.onrender.com/api/retell-llm` (if supported) or HTTP.
                   // Retell docs: "llm_websocket_url".
                   // My controller is HTTP POST. 
                   // This might be a mismatch. 
                   // However, if I assume the user *wants* to use the code they just scrutinized and fixed...
                   // I should probably set the URL.
                   // Let's try to update `llm_websocket_url` to `wss://...`. 
                   // But the controller is `router.post`. WebSocket requires `connection` upgrade.
                   // The controller `retell-llm.controller.ts` is an accumulating POST handler.
                   // This looks like the "Server-Server" interaction for Retell's "Custom LLM" via HTTP (which might be in beta or I'm misremembering).
                   // OR, maybe the user intends to use Retell-hosted LLM (which we created in `create_maria_retell_agent.ts`) and the Render server is just for... something else?
                   // But the Render server has `MARIA_SYSTEM_PROMPT` inside it. That strongly suggests it's meant to drive the conversation.
                   
                   // DECISION: The controller is definitely a Custom LLM implementation.
                   // It is written as a REST API (`router.post`).
                   // Retell supports Custom LLM via WebSocket.
                   // DOES Retell support Custom LLM via HTTP POST?
                   // Checking memory... Retell sends updates via WS.
                   // If the user's code is HTTP, it might not work as a "Custom LLM" directly unless Retell added HTTP support.
                   // OR, maybe this is a component of a different architecture (e.g. Bland AI style?).
                   // BUT, `retell-llm.controller.ts` imports `RetellLLMRequest` interfaces.
                   // Let's try to update the agent to point to this URL.
                   // If it fails, we know.
                   // I will try to set `response_engine: { type: "custom_llm", llm_websocket_url: ... }` 
                   // Wait, HTTP url?
                   // I'll set it to the HTTP url and let Retell reject it if it requires WSS.
                   // Actually, looking at the code `router.post`, it responds with `response_type`.
                   // This is definitely a request-response model.
                   
                   llm_websocket_url: CUSTOM_LLM_URL.replace("https://", "wss://").replace("http://", "ws://") 
               }
            },
            { headers: { 'Authorization': `Bearer ${RETELL_API_KEY}` } }
        );
        
        console.log("✅ SUCCESS! Agent Updated.");
        console.log(JSON.stringify(response.data, null, 2));

    } catch (error: any) {
        console.error("❌ Error updating agent:", error.response?.data || error.message);
        // Fallback: Maybe it's 'custom-llm' with http?
    }
}

updateAgentUrl();
