import { createClient } from "@supabase/supabase-js";
import { createRequestLogger } from "@/lib/utils/logger";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY are required");
  }
  return createClient(url, key);
}

export async function handleArriviaToolCall(
  conversationId: string,
  toolName: string,
  toolInput: Record<string, unknown>,
  correlationId: string
): Promise<Record<string, unknown>> {
  const log = createRequestLogger(correlationId, { handler: "arrivia-tools" });

  switch (toolName) {
    case "lookup_member_benefits": {
      const currentTier = toolInput.current_tier as string;
      const targetTier = toolInput.target_tier as string;
      log.info({ currentTier, targetTier }, "Looking up member benefits");
      return getTierComparison(currentTier, targetTier);
    }

    case "check_upgrade_pricing": {
      const currentTier = toolInput.current_tier as string;
      const targetTier = toolInput.target_tier as string;
      log.info({ currentTier, targetTier }, "Checking upgrade pricing");
      return getUpgradePricing(currentTier, targetTier);
    }

    case "log_objection": {
      log.info({ objection_type: toolInput.objection_type }, "Logging objection");
      await supabase.from("arrivia_events").insert({
        conversation_id: conversationId,
        event_type: "objection",
        payload: {
          objection_type: toolInput.objection_type,
          objection_text: toolInput.objection_text,
        },
      });
      return { success: true, message: "Objection noted" };
    }

    case "mark_upgrade_intent": {
      log.info({ confidence: toolInput.confidence }, "Marking upgrade intent");
      await supabase
        .from("arrivia_conversations")
        .update({ outcome: "upgrade_intent" })
        .eq("conversation_id", conversationId);
      return {
        success: true,
        message:
          "Upgrade intent recorded. Direct the member to the upgrade button on the page.",
      };
    }

    case "schedule_follow_up": {
      const preference = toolInput.follow_up_preference as string;
      log.info({ preference }, "Scheduling follow-up");
      await supabase.from("arrivia_events").insert({
        conversation_id: conversationId,
        event_type: "follow_up_requested",
        payload: { preference },
      });
      await supabase
        .from("arrivia_conversations")
        .update({ outcome: "follow_up" })
        .eq("conversation_id", conversationId);
      return { success: true, message: `Follow-up scheduled: ${preference}` };
    }

    case "get_destination_recommendations": {
      const targetTier = toolInput.target_tier as string;
      const interests = toolInput.interests as string;
      log.info({ targetTier, interests }, "Getting destination recommendations");
      return getDestinationRecommendations(targetTier, interests);
    }

    default: {
      log.warn({ toolName }, "Unknown Arrivia tool call");
      return { success: false, error: `Unknown tool: ${toolName}` };
    }
  }
}

// ── Tier Comparison Data (hardcoded for MVP) ──

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
      quarterly_specials: false,
    },
    Silver: {
      points_multiplier: "1.5x",
      exclusive_deals: true,
      cruise_discount: "up to 5%",
      hotel_discount: "up to 15%",
      concierge: false,
      friends_family_sharing: false,
      quarterly_specials: true,
    },
    Gold: {
      points_multiplier: "2x",
      exclusive_deals: true,
      cruise_discount: "up to 10%",
      hotel_discount: "up to 25%",
      concierge: true,
      friends_family_sharing: true,
      quarterly_specials: true,
    },
    Platinum: {
      points_multiplier: "3x",
      exclusive_deals: true,
      cruise_discount: "up to 15%",
      hotel_discount: "up to 40%",
      concierge: true,
      friends_family_sharing: true,
      quarterly_specials: true,
      vip_events: true,
    },
  };

  return {
    current: { tier: currentTier, benefits: tiers[currentTier] ?? tiers.Standard },
    target: { tier: targetTier, benefits: tiers[targetTier] ?? tiers.Gold },
    upgrade_highlights: getUpgradeHighlights(currentTier, targetTier),
  };
}

function getUpgradeHighlights(from: string, to: string): string[] {
  const highlights: string[] = [];

  if (from === "Standard" && (to === "Gold" || to === "Platinum")) {
    highlights.push(
      "Points earning rate jumps from 1x to " + (to === "Gold" ? "2x" : "3x")
    );
    highlights.push(
      "Unlock exclusive cruise discounts up to " + (to === "Gold" ? "10%" : "15%")
    );
    highlights.push(
      "Hotel savings increase from 10% to up to " + (to === "Gold" ? "25%" : "40%")
    );
    highlights.push("Access to quarterly travel specials and exclusive deals");
    highlights.push("Share benefits with friends and family");
  }
  if (from === "Standard" && to === "Silver") {
    highlights.push("Points earning rate jumps from 1x to 1.5x");
    highlights.push("Unlock exclusive cruise discounts up to 5%");
    highlights.push("Hotel savings increase from 10% to up to 15%");
    highlights.push("Access to quarterly travel specials");
  }
  if (from === "Silver" && to === "Gold") {
    highlights.push("Points earning rate jumps from 1.5x to 2x");
    highlights.push("Cruise discounts double from 5% to up to 10%");
    highlights.push("Hotel savings increase from 15% to up to 25%");
    highlights.push("Dedicated travel concierge access");
    highlights.push("Friends & Family benefit sharing unlocked");
  }
  if (from === "Silver" && to === "Platinum") {
    highlights.push("Points earning rate jumps from 1.5x to 3x");
    highlights.push("Cruise discounts triple from 5% to up to 15%");
    highlights.push("Hotel savings increase from 15% to up to 40%");
    highlights.push("Dedicated travel concierge access");
    highlights.push("VIP event access");
  }
  if (from === "Gold" && to === "Platinum") {
    highlights.push("Points earning rate jumps from 2x to 3x");
    highlights.push("Cruise discounts increase from 10% to up to 15%");
    highlights.push("Hotel savings increase from 25% to up to 40%");
    highlights.push("Exclusive VIP event access");
  }

  return highlights;
}

function getUpgradePricing(
  currentTier: string,
  targetTier: string
): Record<string, unknown> {
  const pricing: Record<string, Record<string, unknown>> = {
    "Standard\u2192Silver": {
      annual_cost_difference: "typically $49-99/year",
      promotional_offer: "First year at 50% off with renewal upgrade",
    },
    "Standard\u2192Gold": {
      annual_cost_difference: "typically $149-199/year",
      promotional_offer: "Lock in current-year pricing before renewal increase",
    },
    "Standard\u2192Platinum": {
      annual_cost_difference: "typically $299-399/year",
      promotional_offer: "Includes bonus 5,000 points on upgrade",
    },
    "Silver\u2192Gold": {
      annual_cost_difference: "typically $99-149/year",
      promotional_offer:
        "Upgrade before renewal and keep Silver pricing for 6 months",
    },
    "Silver\u2192Platinum": {
      annual_cost_difference: "typically $199-299/year",
      promotional_offer: "Includes bonus 10,000 points on upgrade",
    },
    "Gold\u2192Platinum": {
      annual_cost_difference: "typically $149-199/year",
      promotional_offer: "VIP event access included for first year",
    },
  };

  const key = `${currentTier}\u2192${targetTier}`;
  return (
    pricing[key] ?? {
      annual_cost_difference: "Contact a membership specialist for pricing",
      promotional_offer: null,
    }
  );
}

function getDestinationRecommendations(
  targetTier: string,
  _interests: string
): Record<string, unknown> {
  return {
    recommendations: [
      {
        destination: "Caribbean Cruise \u2014 7-Night Eastern",
        exclusive_to_tier: targetTier,
        typical_savings: "up to $800 per cabin with upgrade tier pricing",
      },
      {
        destination: "Cancun All-Inclusive \u2014 5 Nights",
        exclusive_to_tier: "Gold+",
        typical_savings: "up to 40% off retail rates",
      },
      {
        destination: "Hawaii Resort Package \u2014 Maui 7 Nights",
        exclusive_to_tier: targetTier,
        typical_savings: "up to $1,200 with tier discount + points",
      },
    ],
    note: "These are example destinations based on current availability. Actual deals change weekly.",
  };
}
