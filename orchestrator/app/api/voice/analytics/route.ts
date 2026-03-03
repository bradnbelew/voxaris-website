import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_KEY ?? ""
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const direction = searchParams.get("direction") ?? "all";
  const days = parseInt(searchParams.get("days") ?? "30", 10);
  const campaignId = searchParams.get("campaign_id");

  const since = new Date();
  since.setDate(since.getDate() - days);

  let query = supabase
    .from("voice_calls")
    .select("*")
    .gte("started_at", since.toISOString());

  if (direction !== "all") {
    query = query.eq("direction", direction);
  }

  if (campaignId) {
    query = query.eq("campaign_id", campaignId);
  }

  const { data: calls, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const allCalls = calls ?? [];
  const completed = allCalls.filter(
    (c: Record<string, unknown>) => c.status === "completed"
  );

  const totalDurationSecs = completed.reduce(
    (sum: number, c: Record<string, unknown>) =>
      sum + ((c.duration_seconds as number) ?? 0),
    0
  );

  const totalCost = completed.reduce(
    (sum: number, c: Record<string, unknown>) =>
      sum + ((c.cost_usd as number) ?? 0),
    0
  );

  // Count outcomes
  const outcomes: Record<string, number> = {};
  for (const c of completed) {
    const outcome = ((c as Record<string, unknown>).outcome as string) ?? "no_outcome";
    outcomes[outcome] = (outcomes[outcome] ?? 0) + 1;
  }

  // Get top objections
  const callIds = allCalls.map(
    (c: Record<string, unknown>) => c.call_id as string
  );

  const { data: events } = await supabase
    .from("voice_events")
    .select("payload")
    .eq("event_type", "objection")
    .in("call_id", callIds.length > 0 ? callIds : [""]);

  const objectionCounts: Record<string, number> = {};
  for (const e of events ?? []) {
    const payload = e.payload as Record<string, unknown> | null;
    const type = (payload?.objection_type as string) ?? "other";
    objectionCounts[type] = (objectionCounts[type] ?? 0) + 1;
  }

  const upgradeIntents = outcomes["upgrade_intent"] ?? 0;
  const conversionRate =
    completed.length > 0
      ? ((upgradeIntents / completed.length) * 100).toFixed(1) + "%"
      : "0%";

  return NextResponse.json({
    period_days: days,
    direction,
    campaign_id: campaignId ?? "all",
    total_calls: allCalls.length,
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
  });
}
