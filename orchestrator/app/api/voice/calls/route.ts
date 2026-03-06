import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { voiceCalls, voiceEvents } from "@/db/schema";
import { eq, and, ilike, or, desc, asc, sql, count } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const status = searchParams.get("status");
  const outcome = searchParams.get("outcome");
  const search = searchParams.get("search");
  const sortField = searchParams.get("sort") || "startedAt";
  const order = searchParams.get("order") || "desc";
  const direction = searchParams.get("direction");

  try {
    // Build where conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(voiceCalls.status, status));
    }
    if (outcome) {
      conditions.push(eq(voiceCalls.outcome, outcome));
    }
    if (direction && direction !== "all") {
      conditions.push(eq(voiceCalls.direction, direction));
    }
    if (search) {
      conditions.push(
        or(
          ilike(voiceCalls.memberName, `%${search}%`),
          ilike(voiceCalls.callerNumber, `%${search}%`),
          ilike(voiceCalls.callId, `%${search}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const countResult = await db
      .select({ total: count() })
      .from(voiceCalls)
      .where(where);
    const total = countResult[0]?.total ?? 0;

    // Get sort column
    const sortColumn =
      sortField === "durationSeconds"
        ? voiceCalls.durationSeconds
        : sortField === "costUsd"
          ? voiceCalls.costUsd
          : sortField === "status"
            ? voiceCalls.status
            : voiceCalls.startedAt;

    const orderFn = order === "asc" ? asc : desc;

    // Fetch paginated calls
    const calls = await db
      .select({
        id: voiceCalls.id,
        callId: voiceCalls.callId,
        direction: voiceCalls.direction,
        callerNumber: voiceCalls.callerNumber,
        memberName: voiceCalls.memberName,
        status: voiceCalls.status,
        outcome: voiceCalls.outcome,
        endedReason: voiceCalls.endedReason,
        durationSeconds: voiceCalls.durationSeconds,
        costUsd: voiceCalls.costUsd,
        startedAt: voiceCalls.startedAt,
        endedAt: voiceCalls.endedAt,
      })
      .from(voiceCalls)
      .where(where)
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset((page - 1) * limit);

    // Get event counts per call
    const callIds = calls.map((c) => c.callId);
    const eventCounts: Record<string, number> = {};

    if (callIds.length > 0) {
      const eventRows = await db
        .select({
          callId: voiceEvents.callId,
          count: count(),
        })
        .from(voiceEvents)
        .where(sql`${voiceEvents.callId} IN (${sql.join(callIds.map((id) => sql`${id}`), sql`, `)})`)
        .groupBy(voiceEvents.callId);

      for (const row of eventRows) {
        eventCounts[row.callId] = row.count;
      }
    }

    return NextResponse.json({
      calls: calls.map((c) => ({
        ...c,
        startedAt: c.startedAt?.toISOString() || null,
        endedAt: c.endedAt?.toISOString() || null,
        eventCount: eventCounts[c.callId] || 0,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
