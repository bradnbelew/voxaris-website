import { z } from "zod";

// ── Tavus Webhook Event Schemas ──

export const tavusWebhookEventSchema = z.discriminatedUnion("event_type", [
  z.object({
    event_type: z.literal("conversation.started"),
    conversation_id: z.string(),
    persona_id: z.string(),
    timestamp: z.string(),
  }),
  z.object({
    event_type: z.literal("conversation.ended"),
    conversation_id: z.string(),
    duration_seconds: z.number(),
    timestamp: z.string(),
  }),
  z.object({
    event_type: z.literal("conversation.utterance"),
    conversation_id: z.string(),
    role: z.enum(["user", "assistant"]),
    text: z.string(),
    timestamp: z.string(),
  }),
  z.object({
    event_type: z.literal("conversation.tool_call"),
    conversation_id: z.string(),
    tool_name: z.string(),
    tool_input: z.record(z.unknown()),
    timestamp: z.string(),
  }),
]);

export type TavusWebhookEvent = z.infer<typeof tavusWebhookEventSchema>;

// ── Rover Event Schemas ──

export const roverActionResultSchema = z.object({
  trajectory_id: z.string(),
  action_id: z.string(),
  status: z.enum(["success", "error", "timeout"]),
  result: z.record(z.unknown()).optional(),
  screenshot_url: z.string().url().optional(),
  current_url: z.string().url().optional(),
  error: z.string().optional(),
  duration_ms: z.number(),
});

export type RoverActionResult = z.infer<typeof roverActionResultSchema>;

// ── Embed Config Response ──

export const embedConfigSchema = z.object({
  hotelId: z.string(),
  hotelName: z.string(),
  personaId: z.string(),
  startingUrl: z.string().url(),
  brandColor: z.string(),
  greeting: z.string(),
  orchestrateEndpoint: z.string().url(),
  websocketUrl: z.string().optional(),
});

export type EmbedConfig = z.infer<typeof embedConfigSchema>;
