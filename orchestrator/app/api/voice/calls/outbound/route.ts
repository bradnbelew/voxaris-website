import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger, logger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import { getVapiClient } from "@/lib/clients/vapi";
import { getOutboundGreeting } from "@/lib/voice/assistant-configs";
import { outboundCallSchema } from "@/lib/voice/schemas";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 30;

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "outbound-call" });

  try {
    const body = await request.json();
    const parsed = outboundCallSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      member_name,
      member_phone,
      member_email,
      current_tier,
      target_tier,
      member_id,
      campaign_id,
    } = parsed.data;

    const vapi = getVapiClient();

    log.info(
      { memberName: member_name, phone: member_phone },
      "Initiating outbound upgrade call"
    );

    const call = await vapi.createCall(
      {
        assistantId: process.env.VAPI_OUTBOUND_ASSISTANT_ID ?? "",
        phoneNumberId: process.env.VAPI_OUTBOUND_PHONE_NUMBER_ID ?? "",
        customer: {
          number: member_phone,
          name: member_name,
        },
        assistantOverrides: {
          firstMessage: getOutboundGreeting(member_name),
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `[MEMBER CONTEXT]
Name: ${member_name}
Current Tier: ${current_tier}
Target Tier: ${target_tier}
Member ID: ${member_id ?? "unknown"}
Use this context throughout the conversation. Refer to the member by first name. When discussing benefits, compare ${current_tier} vs ${target_tier} specifically.`,
              },
            ],
          },
        } as Partial<import("@/lib/clients/vapi").VapiAssistantConfig>,
        metadata: {
          campaign_id: campaign_id ?? "manual",
          member_id: member_id ?? "",
          current_tier,
          target_tier,
        },
      },
      corrId
    );

    // Store call record if Supabase is configured
    const sb = getSupabase();
    if (sb) {
      const { error } = await sb.from("voice_calls").insert({
        call_id: call.id,
        direction: "outbound",
        caller_number: member_phone,
        member_name,
        member_email: member_email ?? null,
        current_tier,
        target_tier,
        campaign_id: campaign_id ?? "manual",
        status: "initiated",
        started_at: new Date().toISOString(),
      });
      if (error) logger.warn({ error: error.message }, "Failed to log call to Supabase");
    }

    log.info({ callId: call.id }, "Outbound call created successfully");

    return NextResponse.json({
      call_id: call.id,
      status: call.status,
      message: `Outbound call initiated to ${member_name}`,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Outbound call creation failed");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
