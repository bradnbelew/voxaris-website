import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/ToDoGRzP16rnhpDlWK19/webhook-trigger/d5b4954a-6dd7-4047-ae2d-c692719e0017';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Received request with body:', JSON.stringify(body, null, 2));

    // Format phone number - GHL often expects E.164 format
    let phone = body.phone?.replace(/\D/g, '');
    if (phone && !phone.startsWith('1') && phone.length === 10) {
      phone = '1' + phone;
    }
    if (phone && !phone.startsWith('+')) {
      phone = '+' + phone;
    }

    const ghlPayload = {
      firstName: body.firstName || body.name?.split(' ')[0] || '',
      lastName: body.lastName || body.name?.split(' ').slice(1).join(' ') || '',
      name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim(),
      phone: phone,
      email: body.email || '',
      companyName: body.company || '',
      source: 'Voxaris Demo',
      tags: body.tags || ['demo_request', 'maria_live_demo', 'source_website'],
      customField: {
        demo_requested: new Date().toISOString(),
        interest: body.interest || '',
        lead_volume: body.leadVolume || '',
      }
    };

    console.log('Sending to GHL:', JSON.stringify(ghlPayload, null, 2));

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ghlPayload),
    });

    const responseText = await response.text();
    console.log('GHL Response Status:', response.status);
    console.log('GHL Response Body:', responseText);

    if (!response.ok) {
      console.error('GHL webhook failed:', response.status, responseText);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'GHL webhook failed',
          status: response.status,
          details: responseText 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact sent to GHL',
        ghlResponse: responseText 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
