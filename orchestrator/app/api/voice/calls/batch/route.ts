import { NextRequest, NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";
import { getVapiClient } from "@/lib/clients/vapi";
import { getOutboundGreeting } from "@/lib/voice/assistant-configs";
import { batchCallSchema } from "@/lib/voice/schemas";
import { db } from "@/db";
import { voiceCalls } from "@/db/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_CONCURRENT_CALLS = 5;

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "batch-outbound" });

  try {
    const body = await request.json();
    const parsed = batchCallSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { members, campaign_id, delay_between_ms } = parsed.data;

    if (members.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 members per batch" },
        { status: 400 }
      );
    }

    const vapi = getVapiClient();
    const results: Array<{ member: string; call_id?: string; error?: string }> =
      [];
    const delayMs = delay_between_ms || 2000;

    log.info(
      { memberCount: members.length, campaignId: campaign_id },
      "Starting batch outbound calls"
    );

    // Process in chunks to respect concurrency limits
    for (let i = 0; i < members.length; i += MAX_CONCURRENT_CALLS) {
      const chunk = members.slice(i, i + MAX_CONCURRENT_CALLS);

      const chunkResults = await Promise.allSettled(
        chunk.map(async (member, idx) => {
          // Stagger within chunk
          if (idx > 0) {
            await new Promise((r) => setTimeout(r, delayMs * idx));
          }

          const call = await vapi.createCall(
            {
              assistantId: process.env.VAPI_OUTBOUND_ASSISTANT_ID!,
              phoneNumberId: process.env.VAPI_OUTBOUND_PHONE_NUMBER_ID!,
              customer: {
                number: member.phone,
                name: member.name,
              },
              assistantOverrides: {
                firstMessage: getOutboundGreeting(member.name),
              } as any,
              metadata: {
                campaign_id: campaign_id || "batch",
                member_id: member.member_id || "",
                current_tier: member.current_tier,
                target_tier: member.target_tier,
              },
            },
            corrId
          );

          await db.insert(voiceCalls).values({
            callId: call.id,
            direction: "outbound",
            callerNumber: member.phone,
            memberName: member.name,
            currentTier: member.current_tier,
            targetTier: member.target_tier,
            campaignId: campaign_id || "batch",
            status: "initiated",
            startedAt: new Date(),
          });

          return { member: member.name, call_id: call.id };
        })
      );

      for (const result of chunkResults) {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          results.push({
            member: "unknown",
            error: result.reason?.message || "Call creation failed",
          });
        }
      }

      // Wait between chunks
      if (i + MAX_CONCURRENT_CALLS < members.length) {
        await new Promise((r) => setTimeout(r, 5000));
      }
    }

    const succeeded = results.filter((r) => r.call_id).length;
    const failed = results.filter((r) => r.error).length;

    log.info(
      { succeeded, failed, total: members.length },
      "Batch outbound calls completed"
    );

    return NextResponse.json({
      total: members.length,
      succeeded,
      failed,
      results,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Batch call creation failed");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
