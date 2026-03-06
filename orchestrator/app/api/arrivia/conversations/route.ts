import { NextRequest, NextResponse } from "next/server";
import { getArriviaTavusClient } from "@/lib/clients/tavus";
import { createConversationSchema } from "@/lib/arrivia/schemas";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId } from "@/lib/utils/id";

export const runtime = "nodejs";
export const maxDuration = 30;

const BRANDS: Record<
  string,
  { name: string; logo: string; primaryColor: string; accentColor: string }
> = {
  usaa: {
    name: "USAA Member Travel Privileges",
    logo: "/brands/usaa-logo.svg",
    primaryColor: "#003B5C",
    accentColor: "#C5A55A",
  },
  "govt-vacation": {
    name: "Government Vacation Rewards",
    logo: "/brands/gvr-logo.svg",
    primaryColor: "#1B3A5C",
    accentColor: "#D4AF37",
  },
  default: {
    name: "Arrivia Travel Club",
    logo: "/brands/arrivia-logo.svg",
    primaryColor: "#1B2A4A",
    accentColor: "#C5A55A",
  },
};

function getPersonalizedGreeting(
  name: string,
  currentTier: string,
  targetTier: string
): string {
  const greetings = [
    `Hey ${name}, welcome! I'm your membership advisor and I've been looking at your ${currentTier} account. The ${targetTier} upgrade is honestly a game changer — we're talking bigger discounts, way more points, and access to deals most members never see. So tell me, where are you dreaming about traveling next?`,
    `${name}, so glad you clicked through! I'm here to walk you through what ${targetTier} looks like compared to your current ${currentTier} plan. Spoiler — it's a pretty massive upgrade. But first, what kind of trips do you love most? Beach, cruise, city exploring?`,
    `Hey ${name}! Welcome, I'm really excited to chat with you. I've been putting together what the ${targetTier} upgrade means for a ${currentTier} member like you and the benefits are incredible. Before I get into it though — what's been your favorite trip so far?`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)]!;
}

export async function POST(request: NextRequest) {
  const corrId = correlationId();
  const log = createRequestLogger(corrId, { route: "arrivia-conversations" });

  try {
    const body = await request.json();
    const parsed = createConversationSchema.safeParse(body);

    if (!parsed.success) {
      log.warn({ errors: parsed.error.flatten() }, "Invalid request body");
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      brand_id,
      member_name,
      member_email,
      current_tier,
      target_tier,
      join_date,
      points_balance,
      renewal_date,
      last_booking_destination,
      upgrade_link,
    } = parsed.data;

    const brand = BRANDS[brand_id] ?? BRANDS.default!;
    const tavus = getArriviaTavusClient();

    const conversationalContext = `
## Personalization Variables
brand_name: ${brand.name}
member_name: ${member_name}
current_tier: ${current_tier}
target_tier: ${target_tier}
join_date: ${join_date}
points_balance: ${points_balance}
renewal_date: ${renewal_date}
last_booking_destination: ${last_booking_destination ?? "not available"}
upgrade_link: ${upgrade_link}

## Session Context
You are on a live video call with ${member_name}. They clicked a personalized link to connect with you about upgrading from ${current_tier} to ${target_tier}. When they're ready to upgrade, tell them to click the upgrade button on the page.
`.trim();

    log.info(
      { brand_id, member_name, current_tier, target_tier },
      "Creating Arrivia conversation"
    );

    // Memory store key: per-member + per-persona for persistent context across sessions
    const memberKey = (member_email ?? member_name).toLowerCase().replace(/[^a-z0-9]/g, "_");
    const personaId = process.env.TAVUS_ARRIVIA_UPGRADE_PERSONA_ID!;
    const memoryStores = [
      `user_${memberKey}_persona_${personaId}`,
    ];

    const conversation = await tavus.createArriviaConversation(
      {
        personaId,
        replicaId: process.env.TAVUS_REPLICA_ID,
        conversationName: `arrivia-upgrade-${brand_id}-${Date.now()}`,
        customGreeting: getPersonalizedGreeting(member_name, current_tier, target_tier),
        // callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/arrivia/webhooks/tavus`, // disabled — no tools for now
        conversationalContext,
        memoryStores,
        documentTags: ["arrivia-upgrade"],
      },
      corrId
    );

    log.info(
      { conversation_id: conversation.conversation_id },
      "Arrivia conversation created"
    );

    return NextResponse.json({
      conversation_id: conversation.conversation_id,
      conversation_url: conversation.conversation_url,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    log.error({ error: msg }, "Failed to create Arrivia conversation");
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
