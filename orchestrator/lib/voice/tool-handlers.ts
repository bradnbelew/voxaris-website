import { createRequestLogger } from "@/lib/utils/logger";
import { logger } from "@/lib/utils/logger";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase is optional — agent works without it, just no persistence
function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Fire-and-forget Supabase insert — never blocks the agent */
async function dbInsert(table: string, data: Record<string, unknown>): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    logger.debug({ table, data }, "Supabase not configured, skipping insert");
    return;
  }
  const { error } = await sb.from(table).insert(data);
  if (error) logger.warn({ table, error: error.message }, "Supabase insert failed");
}

async function dbUpdate(
  table: string,
  data: Record<string, unknown>,
  match: Record<string, string>
): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    logger.debug({ table, data }, "Supabase not configured, skipping update");
    return;
  }
  let query = sb.from(table).update(data);
  for (const [col, val] of Object.entries(match)) {
    query = query.eq(col, val);
  }
  const { error } = await query;
  if (error) logger.warn({ table, error: error.message }, "Supabase update failed");
}

export async function handleVoiceToolCall(
  callId: string,
  toolName: string,
  params: Record<string, unknown>,
  correlationId: string
): Promise<Record<string, unknown>> {
  const log = createRequestLogger(correlationId, { tool: toolName });

  switch (toolName) {
    case "lookup_member": {
      const phoneNumber = params.phone_number as string | undefined;
      const memberId = params.member_id as string | undefined;
      log.info({ phoneNumber, memberId }, "Looking up member");
      return getMockMemberData(phoneNumber, memberId);
    }

    case "lookup_member_benefits": {
      const currentTier = params.current_tier as string;
      const targetTier = params.target_tier as string;
      log.info({ currentTier, targetTier }, "Looking up tier comparison");
      return getTierComparison(currentTier, targetTier);
    }

    case "check_upgrade_pricing": {
      const currentTier = params.current_tier as string;
      const targetTier = params.target_tier as string;
      log.info({ currentTier, targetTier }, "Checking upgrade pricing");
      return getUpgradePricing(currentTier, targetTier);
    }

    case "log_objection": {
      log.info({ type: params.objection_type }, "Logging objection");
      await dbInsert("voice_events", {
        call_id: callId,
        event_type: "objection",
        payload: {
          objection_type: params.objection_type,
          objection_text: params.objection_text,
        },
      });
      return { success: true };
    }

    case "mark_upgrade_intent": {
      log.info({ confidence: params.confidence }, "Marking upgrade intent");
      await dbUpdate("voice_calls", { outcome: "upgrade_intent" }, { call_id: callId });
      await dbInsert("voice_events", {
        call_id: callId,
        event_type: "upgrade_intent",
        payload: { confidence: params.confidence },
      });
      return {
        success: true,
        message: "Great! I'll send over the upgrade link right now.",
      };
    }

    case "schedule_follow_up": {
      const preference = params.follow_up_preference as string;
      log.info({ preference }, "Scheduling follow-up");
      await dbInsert("voice_events", {
        call_id: callId,
        event_type: "follow_up_requested",
        payload: { preference },
      });
      await dbUpdate("voice_calls", { outcome: "follow_up" }, { call_id: callId });
      return { success: true, message: `Follow-up noted: ${preference}` };
    }

    case "send_upgrade_link": {
      const method = params.method as string;
      const memberEmail = params.member_email as string | undefined;
      log.info({ method, memberEmail, callId }, "Sending upgrade link");
      await dbInsert("voice_events", {
        call_id: callId,
        event_type: "upgrade_link_sent",
        payload: { method, member_email: memberEmail },
      });
      return {
        success: true,
        message:
          method === "sms"
            ? "I've sent a text with your personalized upgrade link."
            : "I've sent an email with your upgrade link and a summary of the benefits we discussed.",
      };
    }

    case "transfer_to_human": {
      const reason = params.reason as string;
      const department = (params.department as string) || "general";
      log.info({ reason, department }, "Transferring to human");
      await dbInsert("voice_events", {
        call_id: callId,
        event_type: "transfer_to_human",
        payload: { reason, department },
      });
      return {
        success: true,
        transferNumber: process.env.ARRIVIA_TRANSFER_NUMBER ?? "+18001234567",
        message: `Transferring to ${department} team.`,
      };
    }

    default: {
      log.warn({ toolName }, "Unknown voice tool call");
      return { success: false, error: `Unknown tool: ${toolName}` };
    }
  }
}

// ── Mock Data (replace with real API) ──

function getMockMemberData(
  _phoneNumber?: string,
  memberId?: string
): Record<string, unknown> {
  return {
    found: true,
    member_name: "Sarah",
    member_id: memberId ?? "ARR-12345",
    current_tier: "Standard",
    points_balance: "2,450",
    join_date: "2024-03-15",
    renewal_date: "2026-03-15",
    last_booking: "Cancun All-Inclusive, November 2025",
    lifetime_bookings: 3,
    preferred_destinations: ["beach", "caribbean"],
  };
}

function getTierComparison(
  currentTier: string,
  targetTier: string
): Record<string, unknown> {
  const tiers: Record<string, Record<string, unknown>> = {
    Standard: {
      points_multiplier: "1x",
      exclusive_deals: false,
      cruise_discount: "0%",
      hotel_discount: "up to 10%",
      concierge: false,
      friends_family_sharing: false,
    },
    Silver: {
      points_multiplier: "1.5x",
      exclusive_deals: true,
      cruise_discount: "up to 5%",
      hotel_discount: "up to 15%",
      concierge: false,
      friends_family_sharing: false,
    },
    Gold: {
      points_multiplier: "2x",
      exclusive_deals: true,
      cruise_discount: "up to 10%",
      hotel_discount: "up to 25%",
      concierge: true,
      friends_family_sharing: true,
    },
    Platinum: {
      points_multiplier: "3x",
      exclusive_deals: true,
      cruise_discount: "up to 15%",
      hotel_discount: "up to 40%",
      concierge: true,
      friends_family_sharing: true,
    },
  };

  return {
    current: {
      tier: currentTier,
      benefits: tiers[currentTier] ?? tiers["Standard"],
    },
    target: {
      tier: targetTier,
      benefits: tiers[targetTier] ?? tiers["Gold"],
    },
    key_upgrades: getUpgradeHighlights(currentTier, targetTier),
  };
}

function getUpgradeHighlights(from: string, to: string): string[] {
  const highlights: string[] = [];

  if (from === "Standard" && (to === "Gold" || to === "Platinum")) {
    highlights.push(
      `Points earning jumps from 1x to ${to === "Gold" ? "2x" : "3x"}`
    );
    highlights.push(
      `Hotel savings go from 10% to up to ${to === "Gold" ? "25%" : "40%"}`
    );
    highlights.push(
      `Exclusive cruise discounts up to ${to === "Gold" ? "10%" : "15%"}`
    );
    highlights.push("Dedicated travel concierge access");
    highlights.push("Share benefits with friends and family");
  }

  if (from === "Standard" && to === "Silver") {
    highlights.push("Points earning jumps from 1x to 1.5x");
    highlights.push("Hotel savings increase to up to 15%");
    highlights.push("Access to exclusive deals and quarterly specials");
  }

  if (from === "Silver" && to === "Gold") {
    highlights.push("Points earning jumps from 1.5x to 2x");
    highlights.push("Cruise discounts double from 5% to up to 10%");
    highlights.push("Hotel savings increase from 15% to up to 25%");
    highlights.push("Dedicated travel concierge access");
    highlights.push("Friends & Family benefit sharing");
  }

  return highlights;
}

function getUpgradePricing(
  currentTier: string,
  targetTier: string
): Record<string, unknown> {
  const pricing: Record<string, Record<string, unknown>> = {
    "Standard→Silver": {
      annual_difference: "typically $49-99/year",
      promo: "First year at 50% off with renewal upgrade",
    },
    "Standard→Gold": {
      annual_difference: "typically $149-199/year",
      promo: "Lock in current pricing before renewal increase",
    },
    "Standard→Platinum": {
      annual_difference: "typically $299-399/year",
      promo: "Includes bonus 5,000 points on upgrade",
    },
    "Silver→Gold": {
      annual_difference: "typically $99-149/year",
      promo: "Upgrade before renewal and keep Silver pricing for 6 months",
    },
    "Gold→Platinum": {
      annual_difference: "typically $149-199/year",
      promo: "VIP event access included for first year",
    },
  };

  const key = `${currentTier}\u2192${targetTier}`;
  return (
    pricing[key] ?? {
      annual_difference: "Contact a membership specialist for pricing",
      promo: null,
    }
  );
}
