import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger, logger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import { handleVoiceToolCall } from "@/lib/voice/tool-handlers";
import { INBOUND_SQUAD_CONFIG } from "@/lib/voice/assistant-configs";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 30;

// Supabase is optional — webhook works without it
function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function dbInsert(table: string, data: Record<string, unknown>): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from(table).insert(data);
  if (error) logger.warn({ table, error: error.message }, "Supabase insert failed");
}

async function dbUpdate(
  table: string,
  data: Record<string, unknown>,
  match: Record<string, string>
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  let query = sb.from(table).update(data);
  for (const [col, val] of Object.entries(match)) {
    query = query.eq(col, val);
  }
  const { error } = await query;
  if (error) logger.warn({ table, error: error.message }, "Supabase update failed");
}

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "voice-webhook" });

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const message = body.message as Record<string, unknown> | undefined;
    const messageType = (message?.type as string) ?? "unknown";

    log.info({ messageType }, "VAPI webhook received");

    switch (messageType) {
      // ── Inbound call: return the squad config ──
      case "assistant-request": {
        const call = message?.call as Record<string, unknown> | undefined;
        const customer = call?.customer as Record<string, unknown> | undefined;

        log.info(
          { callId: call?.id, from: customer?.number },
          "Inbound call — returning squad config"
        );

        await dbInsert("voice_calls", {
          call_id: (call?.id as string) ?? corrId,
          direction: "inbound",
          caller_number: (customer?.number as string) ?? null,
          status: "ringing",
          started_at: new Date().toISOString(),
        });

        return NextResponse.json({ squad: INBOUND_SQUAD_CONFIG });
      }

      // ── Tool calls: execute and return results ──
      case "tool-calls": {
        const call = message?.call as Record<string, unknown> | undefined;
        const callId = (call?.id as string) ?? "";
        const toolCalls =
          (message?.toolCallList as Array<Record<string, unknown>>) ??
          (message?.toolWithToolCallList as Array<Record<string, unknown>>) ??
          [];

        log.info(
          { callId, toolCount: toolCalls.length },
          "Processing tool calls"
        );

        const results = await Promise.all(
          toolCalls.map(async (tc) => {
            const toolName =
              (tc.name as string) ??
              ((tc.function as Record<string, unknown> | undefined)
                ?.name as string) ??
              "";
            const params =
              (tc.parameters as Record<string, unknown>) ??
              ((tc.toolCall as Record<string, unknown> | undefined)
                ?.parameters as Record<string, unknown>) ??
              {};
            const toolCallId =
              (tc.id as string) ??
              ((tc.toolCall as Record<string, unknown> | undefined)
                ?.id as string) ??
              "";

            const result = await handleVoiceToolCall(
              callId,
              toolName,
              params,
              corrId
            );

            return {
              name: toolName,
              toolCallId,
              result: JSON.stringify(result),
            };
          })
        );

        return NextResponse.json({ results });
      }

      // ── Status updates: track call lifecycle ──
      case "status-update": {
        const call = message?.call as Record<string, unknown> | undefined;
        const callId = (call?.id as string) ?? "";
        const status = (message?.status as string) ?? "";

        log.info({ callId, status }, "Call status update");

        if (status === "in-progress") {
          await dbUpdate("voice_calls", { status: "active" }, { call_id: callId });
        }

        if (status === "ended") {
          await dbUpdate(
            "voice_calls",
            { status: "completed", ended_at: new Date().toISOString() },
            { call_id: callId }
          );
        }

        return NextResponse.json({ ok: true });
      }

      // ── End-of-call report: store full transcript + cost ──
      case "end-of-call-report": {
        const call = message?.call as Record<string, unknown> | undefined;
        const callId = (call?.id as string) ?? "";
        const endedReason = (message?.endedReason as string) ?? "unknown";
        const artifact = (message?.artifact as Record<string, unknown>) ?? {};
        const cost = (message?.cost as number) ?? (call?.cost as number) ?? 0;

        log.info({ callId, endedReason, cost }, "End-of-call report received");

        await dbUpdate(
          "voice_calls",
          {
            status: "completed",
            ended_at: new Date().toISOString(),
            ended_reason: endedReason,
            transcript: (artifact.transcript as string) ?? null,
            recording_url: (artifact.recordingUrl as string) ?? null,
            cost_usd: cost,
            duration_seconds: (call?.duration as number) ?? 0,
          },
          { call_id: callId }
        );

        const messages =
          (artifact.messages as Array<Record<string, unknown>>) ?? [];
        if (messages.length > 0) {
          const sb = getSupabase();
          if (sb) {
            await sb.from("voice_utterances").insert(
              messages.map((msg, idx) => ({
                call_id: callId,
                role: (msg.role as string) ?? "unknown",
                text: (msg.message as string) ?? (msg.content as string) ?? "",
                sequence: idx,
              }))
            );
          }
        }

        return NextResponse.json({ ok: true });
      }

      // ── Transcript: real-time updates (informational) ──
      case "transcript": {
        return NextResponse.json({ ok: true });
      }

      // ── Hang: agent failed to respond ──
      case "hang": {
        const call = message?.call as Record<string, unknown> | undefined;
        const callId = (call?.id as string) ?? "";
        log.warn({ callId }, "Agent hang detected — response timeout");

        await dbInsert("voice_events", {
          call_id: callId,
          event_type: "hang_detected",
          payload: {},
        });

        return NextResponse.json({ ok: true });
      }

      default:
        log.warn({ messageType }, "Unknown VAPI webhook event");
        return NextResponse.json({ ok: true });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Voice webhook handler failed");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
