import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import { handleVoiceToolCall } from "@/lib/voice/tool-handlers";
import { INBOUND_SUPPORT_CONFIG } from "@/lib/voice/assistant-configs";
import { db } from "@/db";
import { voiceCalls, voiceUtterances, voiceEvents } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "voice-webhook" });

  try {
    const body = await request.json();
    const messageType = body.message?.type || "unknown";

    log.info({ messageType }, "VAPI webhook received");

    switch (messageType) {
      // ── Inbound call: return the squad config ──
      case "assistant-request": {
        const call = body.message.call;
        const phoneNumberId = call?.phoneNumberId || "";
        log.info(
          { callId: call?.id, from: call?.customer?.number, phoneNumberId },
          "Inbound call — routing to correct assistant"
        );

        await db.insert(voiceCalls).values({
          callId: call?.id || corrId,
          direction: "inbound",
          callerNumber: call?.customer?.number,
          status: "ringing",
          startedAt: new Date(),
        });

        return NextResponse.json({ assistant: INBOUND_SUPPORT_CONFIG });
      }

      // ── Tool calls: execute and return results ──
      case "tool-calls": {
        const callId = body.message.call?.id || "";
        const toolCalls =
          body.message.toolCallList ||
          body.message.toolWithToolCallList ||
          [];

        log.info(
          { callId, toolCount: toolCalls.length },
          "Processing tool calls"
        );

        const results = await Promise.all(
          toolCalls.map(async (tc: any) => {
            const toolName = tc.name || tc.function?.name || "";
            const params = tc.parameters || tc.toolCall?.parameters || {};
            const toolCallId = tc.id || tc.toolCall?.id || "";

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
        const callId = body.message.call?.id || "";
        const status = body.message.status || "";
        log.info({ callId, status }, "Call status update");

        if (status === "in-progress") {
          await db
            .update(voiceCalls)
            .set({ status: "active" })
            .where(eq(voiceCalls.callId, callId));
        }

        if (status === "ended") {
          await db
            .update(voiceCalls)
            .set({
              status: "completed",
              endedAt: new Date(),
            })
            .where(eq(voiceCalls.callId, callId));
        }

        return NextResponse.json({ ok: true });
      }

      // ── End-of-call report: store full transcript + cost ──
      case "end-of-call-report": {
        const callId = body.message.call?.id || "";
        const endedReason = body.message.endedReason || "unknown";
        const artifact = body.message.artifact || {};
        const cost =
          body.message.cost || body.message.call?.cost || 0;

        log.info({ callId, endedReason, cost }, "End-of-call report received");

        await db
          .update(voiceCalls)
          .set({
            status: "completed",
            endedAt: new Date(),
            endedReason,
            transcript: artifact.transcript || null,
            recordingUrl: artifact.recordingUrl || null,
            costUsd: String(cost),
            durationSeconds: body.message.call?.duration || 0,
          })
          .where(eq(voiceCalls.callId, callId));

        // Store individual messages for analysis
        const messages = artifact.messages || [];
        if (messages.length > 0) {
          await db.insert(voiceUtterances).values(
            messages.map((msg: any, idx: number) => ({
              callId,
              role: msg.role,
              text: msg.message || msg.content || "",
              sequence: idx,
            }))
          );
        }

        return NextResponse.json({ ok: true });
      }

      // ── Transcript: real-time updates (informational) ──
      case "transcript": {
        return NextResponse.json({ ok: true });
      }

      // ── Hang: agent failed to respond ──
      case "hang": {
        const callId = body.message.call?.id || "";
        log.warn({ callId }, "Agent hang detected — response timeout");

        await db.insert(voiceEvents).values({
          callId,
          eventType: "hang_detected",
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
