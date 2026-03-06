import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { voiceCalls, voiceEvents } from "@/db/schema";
import { eq, gte, and, inArray, like } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const direction = searchParams.get("direction") || "all";
  const days = parseInt(searchParams.get("days") || "30", 10);
  const campaignId = searchParams.get("campaign_id");

  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    // Build conditions
    const conditions = [gte(voiceCalls.startedAt, since)];

    if (direction !== "all") {
      conditions.push(eq(voiceCalls.direction, direction));
    }
    if (campaignId) {
      conditions.push(eq(voiceCalls.campaignId, campaignId));
    }

    const calls = await db
      .select()
      .from(voiceCalls)
      .where(and(...conditions));

    const completed = calls.filter((c) => c.status === "completed");

    const totalDurationSecs = completed.reduce(
      (sum, c) => sum + (c.durationSeconds || 0),
      0
    );
    const totalCost = completed.reduce(
      (sum, c) => sum + parseFloat(c.costUsd || "0"),
      0
    );

    // Count outcomes
    const outcomes: Record<string, number> = {};
    for (const c of completed) {
      const outcome = c.outcome || "no_outcome";
      outcomes[outcome] = (outcomes[outcome] || 0) + 1;
    }

    // ── Daily trend ──
    const dailyMap: Record<
      string,
      {
        total_calls: number;
        completed_calls: number;
        total_duration: number;
        total_cost: number;
        outcomes: Record<string, number>;
      }
    > = {};

    for (const c of calls) {
      const date = c.startedAt
        ? new Date(c.startedAt).toISOString().split("T")[0]!
        : "unknown";
      if (!dailyMap[date]) {
        dailyMap[date] = {
          total_calls: 0,
          completed_calls: 0,
          total_duration: 0,
          total_cost: 0,
          outcomes: {},
        };
      }
      const day = dailyMap[date]!;
      day.total_calls++;
      if (c.status === "completed") {
        day.completed_calls++;
        day.total_duration += c.durationSeconds || 0;
        day.total_cost += parseFloat(c.costUsd || "0");
        const outcome = c.outcome || "no_outcome";
        day.outcomes[outcome] = (day.outcomes[outcome] || 0) + 1;
      }
    }

    const daily_trend = Object.entries(dailyMap)
      .filter(([d]) => d !== "unknown")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, d]) => ({
        date,
        total_calls: d.total_calls,
        completed_calls: d.completed_calls,
        avg_duration_seconds:
          d.completed_calls > 0
            ? Math.round(d.total_duration / d.completed_calls)
            : 0,
        total_cost_usd: parseFloat(d.total_cost.toFixed(2)),
        outcomes: d.outcomes,
      }));

    // ── Event summary ──
    const callIds = calls.map((c) => c.callId);
    const objectionCounts: Record<string, number> = {};
    const transferCounts: Record<string, number> = {};
    const cruiseDestinations: Record<string, number> = {};
    let upgradeLinks = 0;
    let signupLinks = 0;
    let cruiseLinks = 0;

    if (callIds.length > 0) {
      const allEvents = await db
        .select()
        .from(voiceEvents)
        .where(inArray(voiceEvents.callId, callIds));

      for (const e of allEvents) {
        const payload = e.payload as Record<string, unknown> | null;

        switch (e.eventType) {
          case "objection": {
            const type = (payload?.objection_type as string) || "other";
            objectionCounts[type] = (objectionCounts[type] || 0) + 1;
            break;
          }
          case "transfer_to_human": {
            const dept = (payload?.department as string) || "general";
            transferCounts[dept] = (transferCounts[dept] || 0) + 1;
            break;
          }
          case "cruise_link_sent": {
            cruiseLinks++;
            const dest =
              (payload?.destination_interest as string) || "unspecified";
            cruiseDestinations[dest] =
              (cruiseDestinations[dest] || 0) + 1;
            break;
          }
          case "upgrade_link_sent":
            upgradeLinks++;
            break;
          case "signup_link_sent":
            signupLinks++;
            break;
        }
      }
    }

    const upgradeIntents = outcomes["upgrade_intent"] || 0;
    const conversionRate =
      completed.length > 0
        ? ((upgradeIntents / completed.length) * 100).toFixed(1) + "%"
        : "0%";

    return NextResponse.json({
      period_days: days,
      direction,
      campaign_id: campaignId || "all",
      total_calls: calls.length,
      completed_calls: completed.length,
      avg_duration_seconds:
        completed.length > 0
          ? Math.round(totalDurationSecs / completed.length)
          : 0,
      outcomes,
      conversion_rate: conversionRate,
      total_cost_usd: parseFloat(totalCost.toFixed(2)),
      cost_per_call:
        completed.length > 0
          ? parseFloat((totalCost / completed.length).toFixed(2))
          : 0,
      cost_per_conversion:
        upgradeIntents > 0
          ? parseFloat((totalCost / upgradeIntents).toFixed(2))
          : 0,
      top_objections: Object.entries(objectionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([type, count]) => ({ type, count })),
      daily_trend,
      event_summary: {
        objections: Object.entries(objectionCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([type, count]) => ({ type, count })),
        transfers: Object.entries(transferCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([department, count]) => ({ department, count })),
        cruise_destinations: Object.entries(cruiseDestinations)
          .sort((a, b) => b[1] - a[1])
          .map(([destination, count]) => ({ destination, count })),
        links_sent: {
          upgrade: upgradeLinks,
          signup: signupLinks,
          cruise: cruiseLinks,
        },
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
