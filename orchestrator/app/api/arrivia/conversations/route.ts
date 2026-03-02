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

function getPersonalizedGreeting(name: string, currentTier: string): string {
  const greetings = [
    `Oh hey ${name}! So glad you clicked through — I've been looking forward to chatting with you about some really exciting upgrades we have for our ${currentTier} members.`,
    `${name}! Welcome, welcome. Okay so I have some amazing news about your ${currentTier} membership that I honestly think you're going to love.`,
    `Hey ${name}! Oh my gosh, perfect timing. I was just putting together some incredible upgrade options for ${currentTier} members like you and I cannot wait to walk you through them.`,
    `Hi ${name}! So happy you're here. Listen, I've got some really cool stuff to share with you about taking your ${currentTier} membership to the next level — you're going to want to hear this.`,
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

    const conversation = await tavus.createArriviaConversation(
      {
        personaId: process.env.TAVUS_ARRIVIA_UPGRADE_PERSONA_ID!,
        replicaId: process.env.TAVUS_REPLICA_ID,
        conversationName: `arrivia-upgrade-${brand_id}-${Date.now()}`,
        customGreeting: getPersonalizedGreeting(member_name, current_tier),
        callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/arrivia/webhooks/tavus`,
        conversationalContext,
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
