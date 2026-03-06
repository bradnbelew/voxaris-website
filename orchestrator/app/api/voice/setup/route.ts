import { NextRequest, NextResponse } from "next/server";
import { getVapiClient } from "@/lib/clients/vapi";
import { correlationId } from "@/lib/utils/id";
import { createRequestLogger } from "@/lib/utils/logger";
import { OUTBOUND_UPGRADE_CONFIG } from "@/lib/voice/assistant-configs";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "voice-setup" });

  // Simple auth check — require a setup secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.SETUP_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const vapi = getVapiClient();
    log.info("Starting VAPI voice agent setup");

    // 1. Create outbound assistant
    const outbound = await vapi.createAssistant(
      OUTBOUND_UPGRADE_CONFIG,
      corrId
    );
    log.info({ id: outbound.id }, "Outbound assistant created");

    // Note: Inbound uses squad config returned dynamically via assistant-request webhook.
    // No need to pre-create inbound assistants unless you want persistent IDs.

    return NextResponse.json({
      message: "Voice agents configured successfully",
      outbound_assistant_id: outbound.id,
      instructions: {
        step_1: `Add VAPI_OUTBOUND_ASSISTANT_ID=${outbound.id} to .env.local`,
        step_2:
          "Import a Twilio phone number in VAPI dashboard",
        step_3:
          "Set the inbound phone number's server URL to your webhook endpoint",
        step_4:
          "Add VAPI_OUTBOUND_PHONE_NUMBER_ID=<phone-number-id> to .env.local",
        step_5:
          "Test inbound by calling the number, test outbound via POST /api/voice/calls/outbound",
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Voice setup failed");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
