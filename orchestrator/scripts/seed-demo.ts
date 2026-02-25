/**
 * Seed script — creates the "voxaris-demo" hotel config for the self-demo on voxaris.io.
 *
 * Usage:
 *   npx tsx scripts/seed-demo.ts
 *
 * Prerequisites:
 *   - DATABASE_URL set in .env.local
 *   - Tables already migrated via `npm run db:push`
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { hotelConfigs, embeds } from "../db/schema";
import { eq } from "drizzle-orm";

const DEMO_SLUG = "voxaris-demo";

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not set. Add it to .env.local");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  console.log("Seeding voxaris-demo hotel config...\n");

  // Check if already exists
  const existing = await db
    .select()
    .from(hotelConfigs)
    .where(eq(hotelConfigs.slug, DEMO_SLUG))
    .limit(1);

  if (existing.length > 0) {
    console.log("Demo config already exists:", existing[0]!.id);
    console.log("  Name:", existing[0]!.name);
    console.log("  Domain:", existing[0]!.domain);
    console.log("  Persona:", existing[0]!.personaId || "(not set)");
    console.log("\nTo re-seed, delete the existing record first.");
    return;
  }

  // Create hotel config
  const [hotel] = await db
    .insert(hotelConfigs)
    .values({
      clerkOrgId: "org_voxaris_demo",
      name: "Voxaris",
      slug: DEMO_SLUG,
      domain: "www.voxaris.io",
      startingUrl: "https://www.voxaris.io",
      personaId: process.env.TAVUS_PERSONA_ID || null,
      brandColor: "#d4a843",
      greeting:
        "Hey there! I'm the Voxaris AI agent. I can walk you through our products, show you features on the page, and answer any questions. What would you like to see?",
      systemPromptOverride:
        "You are demonstrating Voxaris AI capabilities on the voxaris.io website itself. " +
        "You can scroll to different sections, highlight features, and navigate between pages. " +
        "Be enthusiastic but professional. This is a self-demo — show off what AI agents can do.",
      maxActionsPerSession: 100,
      isActive: true,
    })
    .returning();

  console.log("Created hotel config:", hotel!.id);

  // Create embed key
  const [embed] = await db
    .insert(embeds)
    .values({
      hotelConfigId: hotel!.id,
      embedKey: "emb_voxaris_demo_2026",
      allowedOrigins: [
        "https://www.voxaris.io",
        "https://voxaris.io",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      isActive: true,
    })
    .returning();

  console.log("Created embed key:", embed!.embedKey);

  console.log("\n── Demo Config Summary ──");
  console.log("Hotel ID:  ", hotel!.id);
  console.log("Slug:      ", hotel!.slug);
  console.log("Domain:    ", hotel!.domain);
  console.log("Embed Key: ", embed!.embedKey);
  console.log("Persona:   ", hotel!.personaId || "(run create-persona.ts first)");
  console.log("\nAdd this to voxaris.io:");
  console.log(
    `<script src="https://orchestrator.voxaris.io/voxaris-loader.js" data-hotel-id="${hotel!.id}" data-embed-key="${embed!.embedKey}" async></script>`
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
