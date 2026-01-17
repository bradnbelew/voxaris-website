import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to call the Cal.com booking function
async function callCalcomBooking(action: string, params: Record<string, unknown>) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const response = await fetch(`${supabaseUrl}/functions/v1/calcom-booking`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...params }),
  });

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

    if (tool_name === "check_availability") {
      const date = parseDate(tool_args.date || "today");
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      console.log(`Checking availability for ${date}`);

      const availability = await callCalcomBooking("get_availability", {
        startDate: `${date}T00:00:00Z`,
        endDate: `${endDate.toISOString().split("T")[0]}T23:59:59Z`,
      });

      if (availability.error) {
        return new Response(
          JSON.stringify({
            result: `I'm sorry, I couldn't check availability right now. Please try again in a moment.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const slots = availability.data?.slots || [];
      if (slots.length === 0) {
        return new Response(
          JSON.stringify({
            result: `I don't see any available times on ${formatDate(date)}. Would you like to check another day?`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const formattedSlots = slots.slice(0, 5).map((slot: { time: string }) => {
        const time = new Date(slot.time);
        return time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
      });

      return new Response(
        JSON.stringify({
          result: `I have these times available on ${formatDate(date)}: ${formattedSlots.join(", ")}. Which one works best for you?`,
          data: { date, slots: slots.slice(0, 5) },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

      console.log(`Booking appointment for ${name} at ${datetime}`);

      const booking = await callCalcomBooking("create_booking", {
        name,
        email,
        phone: phone || "",
        startTime: datetime,
        serviceType: service_type || "",
      });

      if (booking.error) {
        console.error("Booking error:", booking);
        return new Response(
          JSON.stringify({
            result: `I'm sorry, I couldn't complete the booking. ${booking.details || "Please try again."} `,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          result: `Perfect! I've booked your appointment for ${formatDate(datetime)}. A confirmation email has been sent to ${email}. Is there anything else I can help you with?`,
          data: { booking },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

      const result = await callCalcomBooking("cancel_booking", {
        bookingId: booking_id,
        cancellationReason: reason || "Cancelled via Voxaris CVI",
      });

      if (result.error) {
        return new Response(
          JSON.stringify({
            result: `I couldn't cancel that appointment. Please contact us directly for assistance.`,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          result: `Your appointment has been cancelled. You should receive a confirmation email shortly. Would you like to reschedule?`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unknown tool
    console.log("Unknown tool:", tool_name);
    return new Response(
      JSON.stringify({
        result: `I'm not sure how to help with that specific request. Is there something else I can assist you with?`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

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
