import { z } from "zod";

// ── Outbound Call Request ──

export const outboundCallSchema = z.object({
  member_name: z.string().min(1),
  member_phone: z
    .string()
    .min(10)
    .regex(/^\+?[1-9]\d{1,14}$/, "Must be a valid E.164 phone number"),
  member_email: z.string().email().optional(),
  current_tier: z.string().min(1),
  target_tier: z.string().min(1),
  member_id: z.string().optional(),
  campaign_id: z.string().optional(),
});

export type OutboundCallInput = z.infer<typeof outboundCallSchema>;

// ── Batch Call Request ──

export const batchCallSchema = z.object({
  members: z
    .array(
      z.object({
        name: z.string().min(1),
        phone: z
          .string()
          .min(10)
          .regex(/^\+?[1-9]\d{1,14}$/),
        current_tier: z.string().min(1),
        target_tier: z.string().min(1),
        member_id: z.string().optional(),
        email: z.string().email().optional(),
      })
    )
    .min(1)
    .max(100),
  campaign_id: z.string().optional(),
  delay_between_ms: z.number().min(500).max(30000).optional(),
});

export type BatchCallInput = z.infer<typeof batchCallSchema>;

// ── VAPI Webhook Event (for validation) ──

export const vapiWebhookSchema = z.object({
  message: z.object({
    type: z.string(),
    call: z
      .object({
        id: z.string().optional(),
        orgId: z.string().optional(),
        type: z.string().optional(),
        status: z.string().optional(),
        customer: z
          .object({
            number: z.string().optional(),
          })
          .optional(),
        cost: z.number().optional(),
        duration: z.number().optional(),
      })
      .optional(),
    status: z.string().optional(),
    endedReason: z.string().optional(),
    artifact: z
      .object({
        transcript: z.string().optional(),
        messages: z.array(z.any()).optional(),
        recordingUrl: z.string().optional(),
      })
      .optional(),
    toolCallList: z.array(z.any()).optional(),
    toolWithToolCallList: z.array(z.any()).optional(),
    role: z.string().optional(),
    transcript: z.string().optional(),
    transcriptType: z.string().optional(),
  }),
});

export type VapiWebhookEvent = z.infer<typeof vapiWebhookSchema>;
