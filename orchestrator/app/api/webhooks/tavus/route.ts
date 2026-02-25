import { NextRequest, NextResponse } from "next/server";
import { tavusWebhookEventSchema } from "@/lib/schemas/events";
import { TavusClient } from "@/lib/clients/tavus";
import { orchestrate } from "@/lib/orchestrator";
import { db } from "@/db";
import { sessions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "tavus-webhook" });

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
    log.info({ eventType: event.event_type, conversationId: event.conversation_id }, "Tavus webhook received");

    switch (event.event_type) {
      case "conversation.started": {
        // Find session by tavus conversation ID and mark active
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
        if (event.role === "user") {
          // Find the session for this conversation
          const [session] = await db
            .select()
            .from(sessions)
            .where(eq(sessions.tavusConversationId, event.conversation_id))
            .limit(1);

          if (session) {
            // Route user utterance through the orchestrator
            try {
              await orchestrate(
                session.sessionKey,
                session.hotelConfigId,
                event.text
              );
            } catch (err) {
              log.error({ err, conversationId: event.conversation_id }, "Orchestration from webhook failed");
            }
          }
        }

        // Log all utterances
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
            eventType: event.role === "user" ? "utterance_in" : "utterance_out",
            actor: event.role === "user" ? "user" : "agent",
            payload: { text: event.text, source: "tavus_webhook" },
          });
        }
        break;
      }

      case "conversation.tool_call": {
        log.info(
          { toolName: event.tool_name, conversationId: event.conversation_id },
          "Tool call from Tavus"
        );
        // Tool calls are handled by the orchestrator when routed through utterances
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
