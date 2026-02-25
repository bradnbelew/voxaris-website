import { NextRequest, NextResponse } from "next/server";
import { optionalAuth } from "@/lib/auth";
import { db } from "@/db";
import { hotelConfigs, embeds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { embedKey as genEmbedKey } from "@/lib/utils/id";

const createHotelSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  domain: z.string().min(1),
  startingUrl: z.string().url(),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  greeting: z.string().max(500).optional(),
  systemPromptOverride: z.string().max(2000).optional(),
  allowedOrigins: z.array(z.string()).optional(),
});

export async function GET() {
  const { orgId } = await optionalAuth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hotels = await db
    .select()
    .from(hotelConfigs)
    .where(eq(hotelConfigs.clerkOrgId, orgId));

  return NextResponse.json({ hotels });
}

export async function POST(request: NextRequest) {
  const { orgId } = await optionalAuth();
  if (!orgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = await request.json();
  const parsed = createHotelSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Create hotel config
  const [hotel] = await db
    .insert(hotelConfigs)
    .values({
      clerkOrgId: orgId,
      name: data.name,
      slug: data.slug,
      domain: data.domain,
      startingUrl: data.startingUrl,
      brandColor: data.brandColor,
      greeting: data.greeting,
      systemPromptOverride: data.systemPromptOverride,
    })
    .returning();

  // Create default embed key
  const [embed] = await db
    .insert(embeds)
    .values({
      hotelConfigId: hotel!.id,
      embedKey: genEmbedKey(),
      allowedOrigins: data.allowedOrigins ?? [],
    })
    .returning();

  return NextResponse.json(
    {
      hotel,
      embed: {
        embedKey: embed!.embedKey,
        scriptTag: `<script src="${process.env.NEXT_PUBLIC_APP_URL}/voxaris-loader.js" data-hotel-id="${hotel!.id}" data-embed-key="${embed!.embedKey}" async></script>`,
      },
    },
    { status: 201 }
  );
}
