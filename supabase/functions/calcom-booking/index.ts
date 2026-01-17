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
    const CAL_API_KEY = Deno.env.get("CAL_COM_API_KEY");
    const CAL_EVENT_TYPE_ID = Deno.env.get("CAL_EVENT_TYPE_ID");

    if (!CAL_API_KEY) {
      console.error("CAL_COM_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Cal.com API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!CAL_EVENT_TYPE_ID) {
      console.error("CAL_EVENT_TYPE_ID is not configured");
      return new Response(
        JSON.stringify({ error: "Cal.com event type ID not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, ...params } = await req.json();
    console.log("Cal.com booking action:", action, "params:", params);

    if (action === "get_availability") {
      const { startDate, endDate } = params;
      
      if (!startDate || !endDate) {
        return new Response(
          JSON.stringify({ error: "startDate and endDate are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Fetching availability from ${startDate} to ${endDate}`);
      
      const response = await fetch(
        `https://api.cal.com/v2/slots?eventTypeId=${CAL_EVENT_TYPE_ID}&startTime=${startDate}&endTime=${endDate}`,
        {
          headers: {
            "Authorization": `Bearer ${CAL_API_KEY}`,
            "Content-Type": "application/json",
            "cal-api-version": "2024-08-13",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cal.com availability error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to fetch availability", details: errorText }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("Cal.com availability response:", JSON.stringify(data));
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create_booking") {
      const { name, email, phone, startTime, notes, serviceType } = params;

      if (!name || !email || !startTime) {
        return new Response(
          JSON.stringify({ error: "name, email, and startTime are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Creating booking for ${name} at ${startTime}`);

      const response = await fetch("https://api.cal.com/v2/bookings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CAL_API_KEY}`,
          "Content-Type": "application/json",
          "cal-api-version": "2024-08-13",
        },
        body: JSON.stringify({
          eventTypeId: parseInt(CAL_EVENT_TYPE_ID),
          start: startTime,
          attendee: {
            name,
            email,
            timeZone: "America/New_York",
            language: "en",
          },
          metadata: {
            phone: phone || "",
            notes: notes || "",
            serviceType: serviceType || "",
            source: "voxaris-cvi",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cal.com booking error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to create booking", details: errorText }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("Cal.com booking response:", JSON.stringify(data));

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "cancel_booking") {
      const { bookingId, cancellationReason } = params;

      if (!bookingId) {
        return new Response(
          JSON.stringify({ error: "bookingId is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Cancelling booking ${bookingId}`);

      const response = await fetch(`https://api.cal.com/v2/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CAL_API_KEY}`,
          "Content-Type": "application/json",
          "cal-api-version": "2024-08-13",
        },
        body: JSON.stringify({
          cancellationReason: cancellationReason || "Cancelled by user",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cal.com cancel error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Failed to cancel booking", details: errorText }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      console.log("Cal.com cancel response:", JSON.stringify(data));

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Unknown action. Supported: get_availability, create_booking, cancel_booking" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Cal.com booking error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
