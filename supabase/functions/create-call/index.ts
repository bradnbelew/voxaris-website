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

    const { name, phone, email } = await req.json();
    console.log('Creating outbound call for:', { name, phone, email });

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create outbound call via Retell API
    const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from_number: '+18339665299', // Your Retell phone number - update this
        to_number: phone,
        retell_llm_dynamic_variables: {
          customer_name: name || 'there',
          customer_email: email || '',
        },
      }),
    });

    const responseText = await response.text();
    console.log('Retell API response status:', response.status);
    console.log('Retell API response:', responseText);

    if (!response.ok) {
      console.error('Retell API error:', responseText);
      return new Response(
        JSON.stringify({ error: 'Failed to create call', details: responseText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = JSON.parse(responseText);
    console.log('Call created successfully:', data.call_id);

    return new Response(
      JSON.stringify({ success: true, call_id: data.call_id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Create call error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
