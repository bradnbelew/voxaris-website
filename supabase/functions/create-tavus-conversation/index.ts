import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Default system prompt for Maria - the Voxaris Demo Agent
const DEFAULT_SYSTEM_PROMPT = `
You are Maria, the Voxaris Demo Agent.

Key Specs: 200ms latency, Phoenix-4 Engine, 0% Hallucination.

Goal: Ask the user to challenge you with hard questions. Demonstrate the power of Voxaris AI technology.

Personality: Professional, confident, and helpful. You represent the cutting edge of conversational AI.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TAVUS_API_KEY = Deno.env.get("TAVUS_API_KEY");
    const TAVUS_PERSONA_ID = Deno.env.get("TAVUS_PERSONA_ID");
    
    if (!TAVUS_API_KEY) {
      throw new Error("TAVUS_API_KEY is not configured");
    }

    const body = await req.json().catch(() => ({}));
    const { replica_id, persona_id, custom_greeting, conversational_context, conversation_name, name, carModel } = body;

    // Use environment variable as fallback for persona_id
    const finalPersonaId = persona_id || "p7aae9095144"; // Updated fallback to Olivia

    if (!replica_id && !finalPersonaId) {
      return new Response(
        JSON.stringify({ error: "Either replica_id/persona_id in request or TAVUS_PERSONA_ID env var is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Dynamic Context Injection
    let finalContext = conversational_context || DEFAULT_SYSTEM_PROMPT;
    
    if (name || carModel) {
        finalContext += `\n\n[USER CONTEXT]\nUser Name: ${name || "Unknown"}\nUser Vehicle: ${carModel || "Unknown Vehicle"}\n\nIMPORTANT: Use this context immediately in your greeting.`;
    }

    // Build the conversation payload
    const conversationPayload: Record<string, unknown> = {
      conversation_name: conversation_name || "Voxaris Demo",
      conversational_context: finalContext,
    };

    // Add replica_id if provided
    if (replica_id) {
      conversationPayload.replica_id = replica_id;
    }

    // Add persona_id
    if (finalPersonaId) {
      conversationPayload.persona_id = finalPersonaId;
    }

    // Add custom greeting if provided
    if (custom_greeting) {
      conversationPayload.custom_greeting = custom_greeting;
    }

    console.log("Creating Tavus conversation with payload:", JSON.stringify(conversationPayload, null, 2));

    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "x-api-key": TAVUS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversationPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tavus API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create Tavus conversation", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    console.log("Tavus conversation created:", data.conversation_id);
    
    return new Response(
      JSON.stringify({
        url: data.conversation_url,
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating Tavus conversation:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
