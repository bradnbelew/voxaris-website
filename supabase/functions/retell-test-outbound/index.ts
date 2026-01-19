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
    const RETELL_AGENT_ID_SALES = Deno.env.get("RETELL_AGENT_ID_SALES");
    const RETELL_CALLER_ID = Deno.env.get("RETELL_CALLER_ID");

    if (!RETELL_API_KEY) {
      throw new Error("RETELL_API_KEY is not configured");
    }
    if (!RETELL_AGENT_ID_SALES) {
      throw new Error("RETELL_AGENT_ID_SALES is not configured");
    }
    if (!RETELL_CALLER_ID) {
      throw new Error("RETELL_CALLER_ID is not configured");
    }

    const { phone, name } = await req.json();

    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Phone required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sales Agent Context for TRADE_IN campaign
    const salesContext = `
**IDENTITY:** You are a Voxaris Sales Agent.

**CAMPAIGN:** TRADE_IN

**GOAL:** Engage the customer about their trade-in opportunity and schedule an appointment.

**FLOW:**
1. Greeting: "Hi ${name || 'there'}, this is your personal sales assistant from Voxaris."
2. Value Prop: "I'm calling about an exclusive trade-in opportunity..."
3. Close: "Would you like to schedule a time to discuss this further?"
`;

    console.log("Triggering Retell sales outbound call to:", phone);

    const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: RETELL_AGENT_ID_SALES,
        from_number: RETELL_CALLER_ID,
        to_number: phone,
        retell_llm_dynamic_variables: {
          customer_name: name || "Valued Client",
          campaign: "TRADE_IN",
          campaign_context: salesContext,
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
    console.log("Retell sales outbound call created:", data.call_id);

    return new Response(
      JSON.stringify({ success: true, message: "Sales Agent dispatched.", call_id: data.call_id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in retell-test-outbound:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
