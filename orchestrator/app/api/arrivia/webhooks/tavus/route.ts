import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import { handleArriviaToolCall } from "@/lib/arrivia/tool-handlers";

export const runtime = "nodejs";
export const maxDuration = 30;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY are required");
  }
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "arrivia-webhook" });

  try {
    const body = await request.json();
    const eventType = body.event_type ?? body.type ?? "unknown";
    const conversationId = body.conversation_id ?? "";

    log.info({ eventType, conversationId }, "Arrivia webhook received");

    const supabase = getSupabase();

    switch (eventType) {
      case "conversation_started":
      case "conversation.started": {
        await supabase.from("arrivia_conversations").upsert({
          conversation_id: conversationId,
          status: "active",
          started_at: new Date().toISOString(),
          persona_id: body.persona_id,
        });
        break;
      }

      case "conversation_ended":
      case "conversation.ended": {
        const durationSeconds: number = body.duration_seconds ?? 0;
        await supabase
          .from("arrivia_conversations")
          .update({
            status: "completed",
            ended_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
          })
          .eq("conversation_id", conversationId);

        // Calculate cost at $0.37/minute
        const costUsd = (durationSeconds / 60) * 0.37;
        await supabase.from("arrivia_conversation_costs").insert({
          conversation_id: conversationId,
          duration_seconds: durationSeconds,
          cost_usd: costUsd,
        });

        break;
      }

      case "conversation.utterance":
      case "utterance": {
        await supabase.from("arrivia_utterances").insert({
          conversation_id: conversationId,
          role: body.role,
          text: body.text,
          timestamp: body.timestamp ?? new Date().toISOString(),
        });
        break;
      }

      case "conversation.tool_call":
      case "tool_call": {
        const toolName: string = body.tool_name ?? body.function_name ?? "";
        const toolInput: Record<string, unknown> =
          body.tool_input ?? body.arguments ?? {};

        log.info({ toolName, conversationId }, "Tool call from Arrivia agent");

        const result = await handleArriviaToolCall(
          conversationId,
          toolName,
          toolInput,
          corrId
        );

        return NextResponse.json({
          tool_call_id: body.tool_call_id,
          result,
        });
      }

      default:
        log.warn({ eventType }, "Unknown webhook event type");
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Webhook handler failed");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
