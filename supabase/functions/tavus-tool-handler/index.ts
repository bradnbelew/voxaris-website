import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Antigravity n8n webhook URL
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL") || "https://voxaris.app.n8n.cloud/webhook/a81af492-6e82-453e-9dc9-52184864cdd9";

// Helper to call the Antigravity n8n workflow
async function callAntigravityWorkflow(toolName: string, args: Record<string, unknown>, conversationId: string) {
  console.log(`Calling Antigravity n8n workflow: ${toolName}`, args);
  
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tool_name: toolName,
      args: args,
      conversation_id: conversationId,
      source: "tavus-cvi",
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("n8n webhook error:", errorText);
    throw new Error(`n8n webhook failed: ${response.status}`);
  }

  return response.json();
}

// Format date for display
function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Parse natural language date to ISO format
function parseDate(dateStr: string): string {
  const now = new Date();
  const lowered = dateStr.toLowerCase();

  // Handle relative dates
  if (lowered.includes("today")) {
    return now.toISOString().split("T")[0];
  }
  if (lowered.includes("tomorrow")) {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  }

  // Handle day names
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < days.length; i++) {
    if (lowered.includes(days[i])) {
      const target = new Date(now);
      const currentDay = now.getDay();
      let daysUntil = i - currentDay;
      if (daysUntil <= 0) daysUntil += 7;
      target.setDate(target.getDate() + daysUntil);
      return target.toISOString().split("T")[0];
    }
  }

  // Try to parse as a date string
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  // Default to today
  return now.toISOString().split("T")[0];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { tool_name, tool_args, conversation_id } = body;

    console.log("Tavus tool call received:", { tool_name, tool_args, conversation_id });

    // Route all tool calls through Antigravity n8n workflow
    if (tool_name === "check_availability") {
      const date = parseDate(tool_args.date || "today");
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      console.log(`Checking availability for ${date} via Antigravity`);

      try {
        const result = await callAntigravityWorkflow("check_availability", {
          date: date,
          start_time: `${date}T09:00:00Z`,
          end_time: `${endDate.toISOString().split("T")[0]}T17:00:00Z`,
        }, conversation_id);

        // n8n workflow returns availability info
        if (result.output || result.response) {
          return new Response(
            JSON.stringify({
              result: result.output || result.response,
              data: result.data || {},
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Fallback response
        return new Response(
          JSON.stringify({
            result: `I found some availability on ${formatDate(date)}. What time works best for you?`,
            data: result,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Availability check error:", error);
        return new Response(
          JSON.stringify({
            result: `I'm having trouble checking availability right now. Would you like to tell me your preferred time and I'll work with that?`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (tool_name === "book_appointment") {
      const { name, email, phone, datetime, service_type } = tool_args;

      if (!name || !email || !datetime) {
        return new Response(
          JSON.stringify({
            result: `I need a few more details to book your appointment. Could you please provide your name, email, and preferred time?`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Booking appointment for ${name} at ${datetime} via Antigravity`);

      try {
        const result = await callAntigravityWorkflow("book_appointment", {
          name,
          email,
          phone: phone || "",
          booking_time: datetime,
          service_type: service_type || "consultation",
        }, conversation_id);

        if (result.output || result.response) {
          return new Response(
            JSON.stringify({
              result: result.output || result.response,
              data: result.data || {},
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            result: `Perfect! I've booked your appointment for ${formatDate(datetime)}. A confirmation email will be sent to ${email}. Is there anything else I can help you with?`,
            data: result,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Booking error:", error);
        return new Response(
          JSON.stringify({
            result: `I'm having trouble completing the booking right now. Let me take your details and we'll confirm shortly.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (tool_name === "cancel_appointment") {
      const { booking_id, reason } = tool_args;

      if (!booking_id) {
        return new Response(
          JSON.stringify({
            result: `I need the booking reference to cancel your appointment. Could you provide that?`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      try {
        const result = await callAntigravityWorkflow("cancel_appointment", {
          event_id: booking_id,
          reason: reason || "Cancelled via Voxaris CVI",
        }, conversation_id);

        if (result.output || result.response) {
          return new Response(
            JSON.stringify({
              result: result.output || result.response,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            result: `Your appointment has been cancelled. Would you like to reschedule?`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Cancel error:", error);
        return new Response(
          JSON.stringify({
            result: `I couldn't cancel that appointment right now. Please contact us directly for assistance.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Handle any unknown tools by routing to n8n as well
    console.log("Routing unknown tool to n8n:", tool_name);
    try {
      const result = await callAntigravityWorkflow(tool_name, tool_args || {}, conversation_id);
      
      return new Response(
        JSON.stringify({
          result: result.output || result.response || `I've processed your request. Is there anything else I can help with?`,
          data: result,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Unknown tool error:", error);
      return new Response(
        JSON.stringify({
          result: `I'm not sure how to help with that specific request. Is there something else I can assist you with?`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Tavus tool handler error:", error);
    return new Response(
      JSON.stringify({
        result: `I encountered an issue processing your request. Let me try to help you another way.`,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
