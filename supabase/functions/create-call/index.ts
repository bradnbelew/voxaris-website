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
    console.log('Create call request:', JSON.stringify(body, null, 2));

    const { 
      phone, 
      firstName, 
      lastName, 
      email, 
      company, 
      industry,
      challenge,
      agentId 
    } = body;

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format phone number for Retell (E.164 format)
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = '+1' + formattedPhone;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Build the full caller name
    const callerName = `${firstName || ''} ${lastName || ''}`.trim() || 'there';

    // Map challenge value to readable text
    const challengeMap: Record<string, string> = {
      'missed-calls': 'Missed calls',
      'slow-lead-response': 'Slow lead response',
      'messy-crm': 'Messy CRM',
      'after-hours-leads': 'After-hours leads',
      'all-of-the-above': 'All of the above',
    };
    const challengeText = challengeMap[challenge] || challenge || '';

    // Dynamic LLM variables that will be injected into Maria's prompt
    // Use these in your Retell agent prompt: {{caller_name}}, {{caller_first_name}}, 
    // {{caller_email}}, {{caller_phone}}, {{caller_company}}, {{caller_industry}}, {{caller_challenge}}
    const retellVariables = {
      caller_name: callerName,
      caller_first_name: firstName || '',
      caller_last_name: lastName || '',
      caller_email: email || '',
      caller_phone: formattedPhone,
      caller_company: company || '',
      caller_industry: industry || '',
      caller_challenge: challengeText,
    };

    console.log('Retell dynamic variables:', retellVariables);

    // Create the outbound call via Retell API
    const retellPayload: Record<string, unknown> = {
      from_number: '+14072891565', // Voxaris outbound phone number
      to_number: formattedPhone,
      retell_llm_dynamic_variables: retellVariables,
    };

    // Add agent_id if provided
    if (agentId) {
      retellPayload.override_agent_id = agentId;
    }

    console.log('Calling Retell API with payload:', JSON.stringify(retellPayload, null, 2));

    const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RETELL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retellPayload),
    });

    const responseText = await response.text();
    console.log('Retell API response status:', response.status);
    console.log('Retell API response:', responseText);

    if (!response.ok) {
      console.error('Retell API error:', response.status, responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create call',
          status: response.status,
          details: responseText 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const callData = JSON.parse(responseText);
    console.log('Call created successfully:', callData.call_id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        call_id: callData.call_id,
        message: 'Call initiated successfully'
      }),
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
