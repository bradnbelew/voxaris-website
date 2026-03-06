import {
  pgTable,
  text,
  uuid,
  timestamp,
  jsonb,
  integer,
  boolean,
  index,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

// ── Hotel Configurations (multi-tenant) ──
export const hotelConfigs = pgTable(
  "hotel_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkOrgId: text("clerk_org_id").notNull().unique(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    domain: text("domain").notNull(),
    startingUrl: text("starting_url").notNull(),
    personaId: text("persona_id"),
    brandColor: varchar("brand_color", { length: 7 }).default("#d4a843"),
    greeting: text("greeting").default(
      "Welcome! I can help you explore rooms, check availability, and make reservations."
    ),
    systemPromptOverride: text("system_prompt_override"),
    maxActionsPerSession: integer("max_actions_per_session").default(50),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("hotel_configs_slug_idx").on(t.slug)]
);

// ── Embed Installations ──
export const embeds = pgTable(
  "embeds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelConfigId: uuid("hotel_config_id")
      .notNull()
      .references(() => hotelConfigs.id, { onDelete: "cascade" }),
    embedKey: text("embed_key").notNull().unique(),
    allowedOrigins: text("allowed_origins").array().notNull().default([]),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("embeds_key_idx").on(t.embedKey)]
);

// ── Session Records ──
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hotelConfigId: uuid("hotel_config_id")
      .notNull()
      .references(() => hotelConfigs.id, { onDelete: "cascade" }),
    sessionKey: text("session_key").notNull().unique(),
    trajectoryId: text("trajectory_id"),
    tavusConversationId: text("tavus_conversation_id"),
    status: varchar("status", { length: 32 })
      .notNull()
      .default("active"),
    currentUrl: text("current_url"),
    actionCount: integer("action_count").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    endedAt: timestamp("ended_at", { withTimezone: true }),
  },
  (t) => [
    index("sessions_hotel_idx").on(t.hotelConfigId),
    index("sessions_status_idx").on(t.status),
  ]
);

// ── Audit Logs (immutable append-only) ──
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    hotelConfigId: uuid("hotel_config_id")
      .notNull()
      .references(() => hotelConfigs.id, { onDelete: "cascade" }),
    correlationId: text("correlation_id").notNull(),
    eventType: varchar("event_type", { length: 64 }).notNull(),
    // Event types: utterance_in, utterance_out, tool_call, tool_result,
    // rover_action, rover_result, booking_attempt, booking_confirmed,
    // consent_requested, consent_granted, consent_denied,
    // error, session_start, session_end, handoff_requested
    actor: varchar("actor", { length: 32 }).notNull(), // user | agent | system
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("audit_session_idx").on(t.sessionId),
    index("audit_hotel_idx").on(t.hotelConfigId),
    index("audit_type_idx").on(t.eventType),
    index("audit_created_idx").on(t.createdAt),
  ]
);

// ── Voice Calls (VAPI-powered agents) ──
export const voiceCalls = pgTable(
  "voice_calls",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    callId: text("call_id").notNull().unique(),
    direction: varchar("direction", { length: 16 }).notNull(),
    callerNumber: text("caller_number"),
    memberName: text("member_name"),
    memberEmail: text("member_email"),
    currentTier: text("current_tier"),
    targetTier: text("target_tier"),
    campaignId: text("campaign_id"),
    status: varchar("status", { length: 32 }).notNull().default("initiated"),
    outcome: text("outcome"),
    endedReason: text("ended_reason"),
    transcript: text("transcript"),
    recordingUrl: text("recording_url"),
    durationSeconds: integer("duration_seconds").default(0),
    costUsd: numeric("cost_usd", { precision: 10, scale: 4 }).default("0"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    endedAt: timestamp("ended_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("voice_calls_direction_idx").on(t.direction),
    index("voice_calls_status_idx").on(t.status),
    index("voice_calls_outcome_idx").on(t.outcome),
    index("voice_calls_campaign_idx").on(t.campaignId),
    index("voice_calls_started_idx").on(t.startedAt),
  ]
);

// ── Voice Utterances (from end-of-call report) ──
export const voiceUtterances = pgTable(
  "voice_utterances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    callId: text("call_id")
      .notNull()
      .references(() => voiceCalls.callId, { onDelete: "cascade" }),
    role: varchar("role", { length: 16 }).notNull(),
    text: text("text").notNull(),
    sequence: integer("sequence").default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("voice_utterances_call_idx").on(t.callId)]
);

// ── Voice Events (objections, intents, follow-ups, transfers) ──
export const voiceEvents = pgTable(
  "voice_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    callId: text("call_id")
      .notNull()
      .references(() => voiceCalls.callId, { onDelete: "cascade" }),
    eventType: varchar("event_type", { length: 64 }).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("voice_events_call_idx").on(t.callId),
    index("voice_events_type_idx").on(t.eventType),
  ]
);

// ── Type Exports ──
export type HotelConfig = typeof hotelConfigs.$inferSelect;
export type NewHotelConfig = typeof hotelConfigs.$inferInsert;
export type Embed = typeof embeds.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type VoiceCall = typeof voiceCalls.$inferSelect;
export type NewVoiceCall = typeof voiceCalls.$inferInsert;
export type VoiceEvent = typeof voiceEvents.$inferSelect;
export type VoiceUtterance = typeof voiceUtterances.$inferSelect;

// ── Booking Schema (re-export) ──
export * from "./schema-booking";
