import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Tool definitions for scheduling capabilities
const schedulingTools = [
  {
    type: "function",
    function: {
      name: "check_availability",
      description: "Check available appointment slots for a given date. Use this when a customer asks about availability or wants to schedule an appointment.",
      parameters: {
        type: "object",
        properties: {
          date: {
            type: "string",
            description: "The date to check availability for. Can be natural language like 'today', 'tomorrow', 'next Tuesday', or a specific date like '2024-01-20'"
          }
        },
        required: ["date"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "book_appointment",
      description: "Book an appointment for the customer. Use this after confirming the customer's preferred time slot and collecting their contact information.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Customer's full name"
          },
          email: {
            type: "string",
            description: "Customer's email address for confirmation"
          },
          phone: {
            type: "string",
            description: "Customer's phone number (optional)"
          },
          datetime: {
            type: "string",
            description: "The appointment datetime in ISO format (e.g., 2024-01-20T14:00:00Z)"
          },
          service_type: {
            type: "string",
            description: "Type of service requested (e.g., 'oil change', 'demo call', 'consultation')"
          }
        },
        required: ["name", "email", "datetime"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cancel_appointment",
      description: "Cancel an existing appointment. Use this when a customer wants to cancel their booking.",
      parameters: {
        type: "object",
        properties: {
          booking_id: {
            type: "string",
            description: "The booking reference ID to cancel"
          },
          reason: {
            type: "string",
            description: "Reason for cancellation (optional)"
          }
        },
        required: ["booking_id"]
      }
    }
  }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TAVUS_API_KEY = Deno.env.get("TAVUS_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    
    if (!TAVUS_API_KEY) {
      throw new Error("TAVUS_API_KEY is not configured");
    }

    const { replica_id, persona_id, custom_greeting, conversational_context, enable_scheduling = true } = await req.json();

    if (!replica_id || !persona_id) {
      return new Response(
        JSON.stringify({ error: "replica_id and persona_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build the conversation payload
    const conversationPayload: Record<string, unknown> = {
      replica_id,
      persona_id,
      custom_greeting: custom_greeting || "Hello! How can I help you today?",
      conversational_context: conversational_context || "",
    };

    // Add tools configuration if scheduling is enabled
    if (enable_scheduling && SUPABASE_URL) {
      conversationPayload.tools = schedulingTools;
      conversationPayload.tool_webhook_url = `${SUPABASE_URL}/functions/v1/tavus-tool-handler`;
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
        conversation_id: data.conversation_id,
        conversation_url: data.conversation_url,
        status: data.status,
        tools_enabled: enable_scheduling,
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
