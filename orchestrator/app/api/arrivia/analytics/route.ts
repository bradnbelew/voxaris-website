import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

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

export async function GET(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "arrivia-analytics" });

  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brand_id");
    const days = parseInt(searchParams.get("days") ?? "30", 10);
    const since = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();

    log.info({ brandId, days }, "Fetching Arrivia analytics");

    const supabase = getSupabase();

    // Base query for conversations in the date range
    let query = supabase
      .from("arrivia_conversations")
      .select("*")
      .gte("created_at", since);

    if (brandId) {
      query = query.eq("brand_id", brandId);
    }

    const { data: conversations, error: convError } = await query;

    if (convError) {
      log.error({ error: convError.message }, "Failed to fetch conversations");
      return NextResponse.json({ error: convError.message }, { status: 500 });
    }

    const all = conversations ?? [];
    const completed = all.filter((c) => c.status === "completed");

    // Outcome breakdown
    const outcomes = {
      upgrade_intent: all.filter((c) => c.outcome === "upgrade_intent").length,
      declined: all.filter((c) => c.outcome === "declined").length,
      follow_up: all.filter((c) => c.outcome === "follow_up").length,
      no_outcome: all.filter((c) => !c.outcome).length,
    };

    // Duration stats
    const totalDuration = completed.reduce(
      (sum, c) => sum + (c.duration_seconds ?? 0),
      0
    );
    const avgDuration =
      completed.length > 0 ? Math.round(totalDuration / completed.length) : 0;

    // Cost data
    let costQuery = supabase
      .from("arrivia_conversation_costs")
      .select("cost_usd")
      .gte("created_at", since);

    if (brandId) {
      // Join through conversation_id to filter by brand
      const conversationIds = all.map((c) => c.conversation_id);
      costQuery = costQuery.in("conversation_id", conversationIds);
    }

    const { data: costs } = await costQuery;
    const totalCost = (costs ?? []).reduce(
      (sum, c) => sum + parseFloat(c.cost_usd ?? "0"),
      0
    );

    // Top objections
    let objectionQuery = supabase
      .from("arrivia_events")
      .select("payload")
      .eq("event_type", "objection")
      .gte("created_at", since);

    if (brandId) {
      const conversationIds = all.map((c) => c.conversation_id);
      objectionQuery = objectionQuery.in("conversation_id", conversationIds);
    }

    const { data: objections } = await objectionQuery;
    const objectionCounts: Record<string, number> = {};
    for (const obj of objections ?? []) {
      const type =
        (obj.payload as Record<string, string>)?.objection_type ?? "other";
      objectionCounts[type] = (objectionCounts[type] ?? 0) + 1;
    }

    const topObjections = Object.entries(objectionCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    // Conversion rate
    const conversionRate =
      completed.length > 0
        ? ((outcomes.upgrade_intent / completed.length) * 100).toFixed(1) + "%"
        : "0%";

    const costPerConversation =
      completed.length > 0
        ? parseFloat((totalCost / completed.length).toFixed(2))
        : 0;

    const costPerConversion =
      outcomes.upgrade_intent > 0
        ? parseFloat((totalCost / outcomes.upgrade_intent).toFixed(2))
        : 0;

    return NextResponse.json({
      total_conversations: all.length,
      completed_conversations: completed.length,
      avg_duration_seconds: avgDuration,
      outcomes,
      conversion_rate: conversionRate,
      total_cost_usd: parseFloat(totalCost.toFixed(2)),
      cost_per_conversation: costPerConversation,
      cost_per_conversion: costPerConversion,
      top_objections: topObjections,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Analytics endpoint failed");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
