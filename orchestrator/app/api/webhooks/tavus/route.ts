import { NextRequest, NextResponse } from "next/server";
import { tavusWebhookEventSchema } from "@/lib/schemas/events";
import { TavusClient } from "@/lib/clients/tavus";
import { db } from "@/db";
import { sessions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Tavus webhook handler — receives events from Tavus CVI.
 *
 * In BRAIN_MODE=tavus (default):
 *   - conversation.tool_call events are routed directly to /api/execute
 *     by Tavus via the callback_url. This webhook just logs them.
 *   - conversation.utterance events are logged but NOT sent to Claude.
 *
 * In BRAIN_MODE=claude:
 *   - conversation.utterance (user) events trigger the full Claude ReAct loop.
 */

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "tavus-webhook" });
  const brainMode = process.env.BRAIN_MODE ?? "tavus";

  try {
    // Verify webhook signature
    const signature = request.headers.get("x-tavus-signature") ?? "";
    const rawBody = await request.text();
    const secret = process.env.TAVUS_WEBHOOK_SECRET ?? "";

    if (secret && !TavusClient.verifyWebhookSignature(rawBody, signature, secret)) {
      log.warn("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse event
    const rawEvent = JSON.parse(rawBody);
    const parsed = tavusWebhookEventSchema.safeParse(rawEvent);

    if (!parsed.success) {
      log.warn({ errors: parsed.error.issues }, "Invalid webhook event");
      return NextResponse.json(
        { error: "Invalid event format" },
        { status: 400 }
      );
    }

    const event = parsed.data;
    log.info(
      { eventType: event.event_type, conversationId: event.conversation_id, brainMode },
      "Tavus webhook received"
    );

    switch (event.event_type) {
      case "conversation.started": {
        await db
          .update(sessions)
          .set({ status: "active" })
          .where(eq(sessions.tavusConversationId, event.conversation_id));
        break;
      }

      case "conversation.ended": {
        await db
          .update(sessions)
          .set({
            status: "completed",
            endedAt: new Date(),
          })
          .where(eq(sessions.tavusConversationId, event.conversation_id));
        break;
      }

      case "conversation.utterance": {
        // Look up session
        const [session] = await db
          .select()
          .from(sessions)
          .where(eq(sessions.tavusConversationId, event.conversation_id))
          .limit(1);

        // Log all utterances
        if (session) {
          await db.insert(auditLogs).values({
            sessionId: session.id,
            hotelConfigId: session.hotelConfigId,
            correlationId: corrId,
            eventType: event.role === "user" ? "utterance_in" : "utterance_out",
            actor: event.role === "user" ? "user" : "agent",
            payload: { text: event.text, source: "tavus_webhook", brainMode },
          });
        }

        // In Claude mode, route user utterances through Claude orchestrator
        if (brainMode === "claude" && event.role === "user" && session) {
          try {
            const { orchestrate } = await import("@/lib/orchestrator");
            await orchestrate(
              session.sessionKey,
              session.hotelConfigId,
              event.text
            );
          } catch (err) {
            log.error(
              { err, conversationId: event.conversation_id },
              "Claude orchestration from webhook failed"
            );
          }
        }
        // In Tavus mode, Raven handles everything — utterances are just logged
        break;
      }

      case "conversation.tool_call": {
        log.info(
          {
            toolName: event.tool_name,
            conversationId: event.conversation_id,
            brainMode,
          },
          "Tool call from Tavus"
        );

        // In Tavus-native mode, tool calls go directly to /api/execute
        // via the callback_url set during conversation creation.
        // This webhook event is just for logging/audit.

        const [session] = await db
          .select({ id: sessions.id, hotelConfigId: sessions.hotelConfigId })
          .from(sessions)
          .where(eq(sessions.tavusConversationId, event.conversation_id))
          .limit(1);

        if (session) {
          await db.insert(auditLogs).values({
            sessionId: session.id,
            hotelConfigId: session.hotelConfigId,
            correlationId: corrId,
            eventType: "tool_call",
            actor: "agent",
            payload: {
              tool_name: event.tool_name,
              source: "tavus_webhook",
              brainMode,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    log.error({ error }, "Webhook processing failed");
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
