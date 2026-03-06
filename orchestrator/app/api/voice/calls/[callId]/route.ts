import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { voiceCalls, voiceUtterances, voiceEvents } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ callId: string }> }
) {
  const { callId } = await params;

  try {
    const [call, utterances, events] = await Promise.all([
      db
        .select()
        .from(voiceCalls)
        .where(eq(voiceCalls.callId, callId))
        .limit(1),
      db
        .select({
          id: voiceUtterances.id,
          role: voiceUtterances.role,
          text: voiceUtterances.text,
          sequence: voiceUtterances.sequence,
          createdAt: voiceUtterances.createdAt,
        })
        .from(voiceUtterances)
        .where(eq(voiceUtterances.callId, callId))
        .orderBy(asc(voiceUtterances.sequence)),
      db
        .select({
          id: voiceEvents.id,
          eventType: voiceEvents.eventType,
          payload: voiceEvents.payload,
          createdAt: voiceEvents.createdAt,
        })
        .from(voiceEvents)
        .where(eq(voiceEvents.callId, callId))
        .orderBy(asc(voiceEvents.createdAt)),
    ]);

    if (call.length === 0) {
      return NextResponse.json({ error: "Call not found" }, { status: 404 });
    }

    const c = call[0]!;

    return NextResponse.json({
      call: {
        id: c.id,
        callId: c.callId,
        direction: c.direction,
        callerNumber: c.callerNumber,
        memberName: c.memberName,
        memberEmail: c.memberEmail,
        currentTier: c.currentTier,
        targetTier: c.targetTier,
        campaignId: c.campaignId,
        status: c.status,
        outcome: c.outcome,
        endedReason: c.endedReason,
        transcript: c.transcript,
        recordingUrl: c.recordingUrl,
        durationSeconds: c.durationSeconds,
        costUsd: c.costUsd,
        startedAt: c.startedAt?.toISOString() || null,
        endedAt: c.endedAt?.toISOString() || null,
        createdAt: c.createdAt?.toISOString() || null,
      },
      utterances: utterances.map((u) => ({
        id: u.id,
        role: u.role,
        text: u.text,
        sequence: u.sequence,
        createdAt: u.createdAt?.toISOString() || null,
      })),
      events: events.map((e) => ({
        id: e.id,
        eventType: e.eventType,
        payload: e.payload,
        createdAt: e.createdAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
