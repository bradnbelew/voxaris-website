import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================
// VOXARIS TOOL HANDLER
// Handles tool calls from both Retell (voice) and Tavus (video) agents
// Primary integration: Cal.com for meeting booking
// ============================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CAL_API_KEY = Deno.env.get("CAL_COM_API_KEY");
    const CAL_EVENT_TYPE_ID = Deno.env.get("VOXARIS_CAL_EVENT_TYPE_ID") || Deno.env.get("CAL_EVENT_TYPE_ID");

    if (!CAL_API_KEY || !CAL_EVENT_TYPE_ID) {
      console.error("Missing Cal.com configuration");
      return new Response(
        JSON.stringify({ error: "Cal.com not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    console.log("🔧 Voxaris Tool Handler received:", JSON.stringify(body, null, 2));

    // Handle both Retell and Tavus formats
    const toolName = body.name || body.function_name || body.tool_name;
    const toolArgs = body.arguments || body.args || body.parameters || {};
    const args = typeof toolArgs === 'string' ? JSON.parse(toolArgs) : toolArgs;

    console.log(`📞 Tool: ${toolName}`);
    console.log(`📋 Args: ${JSON.stringify(args)}`);

    // ===================
    // CHECK AVAILABILITY
    // ===================
    if (toolName === "check_availability") {
      const { date } = args;

      // Parse date input
      let startDate: string;
      let endDate: string;
      const now = new Date();

      if (date === "today") {
        startDate = now.toISOString().split('T')[0];
        endDate = startDate;
      } else if (date === "tomorrow") {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        startDate = tomorrow.toISOString().split('T')[0];
        endDate = startDate;
      } else if (date === "this week") {
        startDate = now.toISOString().split('T')[0];
        const endOfWeek = new Date(now);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        endDate = endOfWeek.toISOString().split('T')[0];
      } else {
        startDate = date;
        endDate = date;
      }

      // Add time component
      const startTime = `${startDate}T09:00:00Z`;
      const endTime = `${endDate}T23:59:59Z`;

      console.log(`📅 Checking availability: ${startTime} to ${endTime}`);

      // Use v1 API for availability (more reliable)
      const response = await fetch(
        `https://api.cal.com/v1/slots?apiKey=${CAL_API_KEY}&eventTypeId=${CAL_EVENT_TYPE_ID}&startTime=${startTime}&endTime=${endTime}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cal.com error:", response.status, errorText);
        return new Response(
          JSON.stringify({
            result: "I'm having trouble checking the calendar right now. Let me try a different approach - what time works best for you, and I'll confirm it's available?"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      // v1 API returns slots directly, v2 returns data.slots
      const slots = data.slots || data.data?.slots || {};

      // Format slots for natural language
      const availableTimes: string[] = [];
      Object.entries(slots).forEach(([dateKey, daySlots]: [string, any]) => {
        if (Array.isArray(daySlots)) {
          daySlots.slice(0, 5).forEach((slot: any) => {
            const time = new Date(slot.time);
            availableTimes.push(
              time.toLocaleString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
              })
            );
          });
        }
      });

      let resultMessage: string;
      if (availableTimes.length === 0) {
        resultMessage = `I don't see any available slots for ${date}. Would you like me to check a different day?`;
      } else if (availableTimes.length <= 3) {
        resultMessage = `Here are the available times: ${availableTimes.join(', ')}. Which one works best for you?`;
      } else {
        resultMessage = `Great news! I have several slots available including ${availableTimes.slice(0, 3).join(', ')}, and a few more. What time works best for you?`;
      }

      return new Response(
        JSON.stringify({ result: resultMessage, slots: availableTimes }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ===================
    // BOOK MEETING
    // ===================
    if (toolName === "book_meeting") {
      const { name, email, datetime, notes } = args;

      if (!name || !email || !datetime) {
        return new Response(
          JSON.stringify({
            result: "I need your name, email, and preferred time to book the demo. Could you provide those?"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`📅 Booking meeting for ${name} at ${datetime}`);

      // Use v1 API for booking (more reliable)
      const response = await fetch(`https://api.cal.com/v1/bookings?apiKey=${CAL_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTypeId: parseInt(CAL_EVENT_TYPE_ID),
          start: datetime,
          responses: {
            name,
            email,
            notes: notes || "",
            location: {
              optionValue: "",
              value: "integrations:google:meet"
            }
          },
          timeZone: "America/New_York",
          language: "en",
          metadata: {
            source: "voxaris-ai-agent",
            agent_type: body.source === "retell" ? "voice" : "video"
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cal.com booking error:", response.status, errorText);
        return new Response(
          JSON.stringify({
            result: "I ran into an issue booking that time slot. It might have just been taken. Can we try a different time?"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const booking = await response.json();
      console.log("✅ Booking created:", booking.data?.uid);

      // Format confirmation
      const meetingTime = new Date(datetime).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      });

      return new Response(
        JSON.stringify({
          result: `Perfect! You're all set, ${name}! I've booked your demo for ${meetingTime}. You'll receive a calendar invite at ${email} shortly. Is there anything else I can help you with?`,
          booking_id: booking.data?.uid,
          success: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unknown tool
    return new Response(
      JSON.stringify({
        error: `Unknown tool: ${toolName}`,
        supported_tools: ["check_availability", "book_meeting"]
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Tool handler error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        result: "I'm having a technical difficulty. Could you try again?"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
