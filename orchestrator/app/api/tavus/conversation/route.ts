import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "nodejs";
export const maxDuration = 15;

/**
 * Creates a Tavus CVI conversation.
 * Called by voxaris-loader.js when the user clicks the trigger button.
 *
 * POST /api/tavus/conversation
 *   { persona_id, mode: "self-demo" }        ← voxaris.io self-demo
 *   { hotel_id, embed_key }                  ← hotel integration
 *
 * Returns:
 *   { conversation_id, conversation_url }
 */

const selfDemoSchema = z.object({
  persona_id: z.string().optional(),
  mode: z.literal("self-demo"),
});

const hotelSchema = z.object({
  hotel_id: z.string(),
  embed_key: z.string(),
});

const requestSchema = z.union([selfDemoSchema, hotelSchema]);

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "tavus-conversation" });

  try {
    const raw = await request.json();
    const parsed = requestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const apiKey = process.env.TAVUS_API_KEY;
    if (!apiKey) {
      log.error("TAVUS_API_KEY not set");
      return NextResponse.json(
        { error: "Tavus API not configured" },
        { status: 500 }
      );
    }

    // Determine persona ID
    let personaId: string;
    if ("mode" in data && data.mode === "self-demo") {
      personaId = data.persona_id || process.env.TAVUS_PERSONA_ID || "";
    } else {
      // Hotel mode — look up persona from hotel config
      // For now, fall back to env var
      personaId = process.env.TAVUS_PERSONA_ID || "";
    }

    if (!personaId) {
      return NextResponse.json(
        { error: "No persona configured. Set TAVUS_PERSONA_ID in env." },
        { status: 400 }
      );
    }

    log.info({ personaId }, "Creating Tavus conversation");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://orchestrator.voxaris.io";

    const tavusResponse = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        persona_id: personaId,
        conversation_name: `voxaris-${corrId}`,
        properties: {
          max_call_duration: 1200,
          enable_recording: true,
          enable_transcription: true,
          language: "english",
        },
        // Tool call callback — Tavus sends tool_call events here
        callback_url: `${appUrl}/api/execute`,
      }),
    });

    if (!tavusResponse.ok) {
      const errText = await tavusResponse.text();
      log.error({ status: tavusResponse.status, body: errText }, "Tavus API error");
      return NextResponse.json(
        { error: "Failed to create conversation", detail: errText },
        { status: tavusResponse.status }
      );
    }

    const conversation = await tavusResponse.json();

    log.info(
      { conversationId: conversation.conversation_id },
      "Tavus conversation created"
    );

    return NextResponse.json({
      conversation_id: conversation.conversation_id,
      conversation_url: conversation.conversation_url,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Failed to create conversation");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
