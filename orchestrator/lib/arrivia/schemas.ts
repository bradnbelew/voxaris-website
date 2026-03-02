import { z } from "zod";

// ── Conversation Creation ──

export const createConversationSchema = z.object({
  brand_id: z.string().min(1),
  member_name: z.string().min(1),
  member_email: z.string().email().optional(),
  current_tier: z.string().min(1),
  target_tier: z.string().min(1),
  join_date: z.string().optional().default("N/A"),
  points_balance: z.string().optional().default("N/A"),
  renewal_date: z.string().optional().default("N/A"),
  last_booking_destination: z.string().optional(),
  upgrade_link: z.string().url(),
});

export type CreateConversationInput = z.infer<typeof createConversationSchema>;

// ── Webhook Events ──

export const arriviaWebhookSchema = z.object({
  event_type: z.string(),
  conversation_id: z.string(),
  persona_id: z.string().optional(),
  duration_seconds: z.number().optional(),
  role: z.enum(["user", "assistant"]).optional(),
  text: z.string().optional(),
  tool_name: z.string().optional(),
  function_name: z.string().optional(),
  tool_input: z.record(z.unknown()).optional(),
  arguments: z.record(z.unknown()).optional(),
  tool_call_id: z.string().optional(),
  timestamp: z.string().optional(),
});

export type ArriviaWebhookEvent = z.infer<typeof arriviaWebhookSchema>;

// ── PURL Context ──

export const purlContextSchema = z.object({
  member_name: z.string(),
  member_email: z.string().optional(),
  current_tier: z.string(),
  target_tier: z.string(),
  join_date: z.string(),
  points_balance: z.string(),
  renewal_date: z.string(),
  last_booking_destination: z.string().optional(),
  upgrade_link: z.string(),
});

export type PurlContext = z.infer<typeof purlContextSchema>;
