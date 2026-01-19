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
    const RETELL_API_KEY = Deno.env.get("RETELL_API_KEY");
    const RETELL_AGENT_ID_DEMO = Deno.env.get("RETELL_AGENT_ID_DEMO");
    const RETELL_CALLER_ID = Deno.env.get("RETELL_CALLER_ID");

    if (!RETELL_API_KEY) {
      throw new Error("RETELL_API_KEY is not configured");
    }
    if (!RETELL_AGENT_ID_DEMO) {
      throw new Error("RETELL_AGENT_ID_DEMO is not configured");
    }
    if (!RETELL_CALLER_ID) {
      throw new Error("RETELL_CALLER_ID is not configured");
    }

    const { name, phone, company } = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Phone required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Define the Intake Persona Context
    const demoContext = `
**IDENTITY:** You are the **Voxaris Intake System**.

**GOAL:** Demonstrate speed and logging capabilities.

**FLOW:**
1. Greeting: "Hi ${name || 'there'}, this is Voxaris AI. I see you're with ${company || 'a company'}..."
2. The Flex: "I am logging this call with 0% hallucination rate..."
`;

    console.log("Triggering Retell voice demo call to:", phone);

    const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: RETELL_AGENT_ID_DEMO,
        from_number: RETELL_CALLER_ID,
        to_number: phone,
        retell_llm_dynamic_variables: {
          customer_name: name || "Valued Customer",
          campaign_context: demoContext,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Retell API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create call", details: errorText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Retell voice demo call created:", data.call_id);

    return new Response(
      JSON.stringify({ success: true, call_id: data.call_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in retell-voice-demo:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
