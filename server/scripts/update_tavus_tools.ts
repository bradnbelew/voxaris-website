import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const PERSONA_ID = process.env.TAVUS_PERSONA_ID;
// Infer function URL from Supabase URL, or let user set it
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://psiscvlfkpkytfdcpdma.supabase.co";
const TOOL_HANDLER_URL = `${SUPABASE_URL}/functions/v1/tavus-tool-handler`;

if (!TAVUS_API_KEY || !PERSONA_ID) {
    console.error("❌ CRITICAL: Missing TAVUS_API_KEY or TAVUS_PERSONA_ID in .env");
    process.exit(1);
}

// DEFINING TOOLS FOR GOOGLE CALENDAR (Function Calling)
const TOOLS_DEFINITIONS = [
  {
    "type": "function",
    "function": {
      "name": "check_availability",
      "description": "Check if a specific date and time is available for an appointment. ALWAYS call this before booking.",
      "parameters": {
        "type": "object",
        "properties": {
          "date": {
              "type": "string",
              "description": "The date to check in YYYY-MM-DD format, or 'today'/'tomorrow'."
          }
        },
        "required": ["date"]
      }
    }
  },
  {
    "type": "function",
    "function": {
      "name": "book_appointment",
      "description": "Book a firm appointment after availability is confirmed.",
      "parameters": {
        "type": "object",
        "properties": {
          "name": {
              "type": "string",
              "description": "The customer's full name."
          },
          "email": {
              "type": "string",
              "description": "The customer's email address."
          },
          "datetime": {
              "type": "string",
              "description": "The confirmed ISO 8601 datetime for the appointment (e.g. 2024-06-15T14:15:00Z)."
          }
        },
        "required": ["name", "email", "datetime"]
      }
    }
  }
];

async function updateTools() {
    console.log(`🚀 Updating Tavus Tools for Persona: ${PERSONA_ID}`);
    // console.log(`🔗 Tool Handler URL: ${TOOL_HANDLER_URL}`); // Not used in API directly, client handles it or global webhook
    
    try {
        // Step 1: Fetch current persona
        console.log("📥 Fetching current persona...");
        const currentPersona = await axios.get(`https://tavusapi.com/v2/personas/${PERSONA_ID}`, {
            headers: { 'x-api-key': TAVUS_API_KEY }
        });
        
        const layers = currentPersona.data.layers || {};
        const llmLayer = layers.llm || {};

        console.log("🔹 Current LLM Config:", JSON.stringify(llmLayer, null, 2));

        // Step 2: Merge tools
        const updatedLLM = {
            ...llmLayer,
            tools: TOOLS_DEFINITIONS
        };

        // Step 3: Send Update
        // We replace the entire 'llm' layer. If it didn't exist, this creates it.
        const payload = [
            { 
               "op": "replace", 
               "path": "/layers/llm", 
               "value": updatedLLM 
            }
        ];

        console.log("📤 Sending update payload...");
        const response = await axios.patch(`https://tavusapi.com/v2/personas/${PERSONA_ID}`, payload, {
            headers: {
                'x-api-key': TAVUS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ SUCCESS: Tools Registered!");
        console.log(`🆔 ID: ${response.data.persona_id}`);
        console.log(`🛠️ Tools Count: ${response.data.layers?.llm?.tools?.length}`);
        
    } catch (error: any) {
        console.error("❌ Error Updating Tools:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

updateTools();
