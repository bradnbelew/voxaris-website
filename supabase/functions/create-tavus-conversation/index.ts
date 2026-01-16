import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TAVUS_API_KEY = Deno.env.get("TAVUS_API_KEY");
    if (!TAVUS_API_KEY) {
      throw new Error("TAVUS_API_KEY is not configured");
    }

    const { replica_id, persona_id, custom_greeting, conversational_context } = await req.json();

    if (!replica_id || !persona_id) {
      return new Response(
        JSON.stringify({ error: "replica_id and persona_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "x-api-key": TAVUS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replica_id,
        persona_id,
        custom_greeting: custom_greeting || "Hello! How can I help you today?",
        conversational_context: conversational_context || "",
      }),
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
    
    return new Response(
      JSON.stringify({
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
