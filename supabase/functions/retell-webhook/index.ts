import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RETELL_API_KEY = Deno.env.get('RETELL_API_KEY');
    
    if (!RETELL_API_KEY) {
      console.error('RETELL_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Retell API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    console.log('Retell webhook received:', JSON.stringify(body, null, 2));

    const { event, call } = body;

    // Handle different Retell webhook events
    switch (event) {
      case 'call_started':
        console.log('Call started:', call?.call_id);
        break;
      
      case 'call_ended':
        console.log('Call ended:', call?.call_id);
        // You can log call data, save to database, etc.
        break;
      
      case 'call_analyzed':
        console.log('Call analyzed:', call?.call_id);
        // Handle post-call analysis data
        break;
      
      default:
        console.log('Unknown event:', event);
    }

    return new Response(
      JSON.stringify({ success: true, event }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
