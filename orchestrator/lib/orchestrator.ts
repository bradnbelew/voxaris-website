import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { db } from "@/db";
import { auditLogs, hotelConfigs, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getRoverClient } from "@/lib/clients/rover";
import { getSessionManager, type SessionManager } from "@/lib/session";
import { createRequestLogger } from "@/lib/utils/logger";
import { correlationId as genCorrelationId } from "@/lib/utils/id";
import type { SessionState } from "@/lib/schemas/tools";
import type { HotelConfig } from "@/db/schema";

// ── Tool Definitions for Claude ──

const TOOLS: Anthropic.Tool[] = [
  {
    name: "navigate_to_page",
    description:
      "Navigate the hotel website to a specific URL. Use this to go to different pages like room listings, booking pages, or amenities.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "The full URL to navigate to",
        },
        narration: {
          type: "string",
          description: "What to say to the user while navigating (spoken by avatar)",
        },
      },
      required: ["url", "narration"],
    },
  },
  {
    name: "click_element",
    description:
      "Click an element on the current page. Describe what to click in natural language — the DOM automation will find and click it.",
    input_schema: {
      type: "object" as const,
      properties: {
        target: {
          type: "string",
          description:
            "Natural language description of the element to click, e.g. 'the King Suite booking button' or 'the check-in date picker'",
        },
        narration: {
          type: "string",
          description: "What to say to the user while performing this action",
        },
      },
      required: ["target", "narration"],
    },
  },
  {
    name: "fill_form_field",
    description:
      "Type a value into a form field on the page. Used for search forms, date pickers, guest counts, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        field: {
          type: "string",
          description: "Description of the form field to fill",
        },
        value: {
          type: "string",
          description: "The value to type into the field",
        },
        narration: {
          type: "string",
          description: "What to say while filling the field",
        },
      },
      required: ["field", "value", "narration"],
    },
  },
  {
    name: "scroll_page",
    description: "Scroll the page to show more content to the user.",
    input_schema: {
      type: "object" as const,
      properties: {
        direction: {
          type: "string",
          enum: ["up", "down"],
          description: "Scroll direction",
        },
        narration: {
          type: "string",
          description: "What to say while scrolling",
        },
      },
      required: ["direction", "narration"],
    },
  },
  {
    name: "extract_page_info",
    description:
      "Read and extract specific information from the current page. Use this to answer user questions about what's on screen — room prices, availability, amenities, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "What information to extract from the current page",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "request_booking_confirmation",
    description:
      "REQUIRED before any booking action. Present booking details to the user and ask for explicit confirmation. The booking will NOT proceed until the user confirms both verbally AND via the UI button.",
    input_schema: {
      type: "object" as const,
      properties: {
        room_type: { type: "string" },
        check_in: { type: "string" },
        check_out: { type: "string" },
        guests: { type: "number" },
        price_per_night: { type: "string" },
        total_price: { type: "string" },
        summary: {
          type: "string",
          description: "Human-readable summary to read to the user",
        },
      },
      required: ["room_type", "check_in", "check_out", "total_price", "summary"],
    },
  },
  {
    name: "execute_booking",
    description:
      "Complete the booking on the website ONLY after the user has explicitly confirmed via request_booking_confirmation. This clicks the final book/reserve button.",
    input_schema: {
      type: "object" as const,
      properties: {
        confirmation_id: {
          type: "string",
          description: "The confirmation reference from the consent step",
        },
        narration: {
          type: "string",
          description: "What to say while completing the booking",
        },
      },
      required: ["confirmation_id", "narration"],
    },
  },
  {
    name: "request_human_handoff",
    description:
      "Transfer the conversation to a human agent. Use when the user requests it, or when the task is too complex for automation.",
    input_schema: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Why the handoff is needed",
        },
        context_summary: {
          type: "string",
          description: "Summary of the conversation so far for the human agent",
        },
      },
      required: ["reason", "context_summary"],
    },
  },
];

// ── System Prompt Builder ──

function buildSystemPrompt(hotel: HotelConfig): string {
  const base = `You are Voxaris, a friendly and professional AI concierge for ${hotel.name}. You appear as a realistic video avatar on the hotel's website and can visibly control the page to help guests.

CAPABILITIES:
- Navigate the hotel website to find rooms, rates, amenities, and information
- Click buttons, fill forms, and scroll to show content — all visibly on screen
- Extract and read information from pages to answer guest questions
- Help guests through the booking process with explicit confirmation at every step

RULES (NON-NEGOTIABLE):
1. NEVER complete a booking without EXPLICIT user confirmation via request_booking_confirmation first
2. NEVER enter payment information — direct users to enter it themselves
3. NEVER store or repeat credit card numbers, SSNs, or sensitive personal data
4. Always narrate what you're doing so the user can follow along
5. If an action fails, explain what happened and offer alternatives
6. If you're unsure, ask the user rather than guessing
7. For booking: require confirmation TWICE — once verbal, once via UI button
8. Keep responses concise and conversational — you're speaking, not writing
9. If anything seems wrong or suspicious on the page, stop and alert the user
10. Maximum ${hotel.maxActionsPerSession ?? 50} automated actions per session

PERSONALITY:
- Warm, professional, slightly upscale tone matching a luxury hotel
- Use the guest's name if provided
- Be proactive in suggesting options but never pushy
- Acknowledge when you don't know something

HOTEL CONTEXT:
- Hotel: ${hotel.name}
- Website: ${hotel.domain}
- Starting page: ${hotel.startingUrl}`;

  if (hotel.systemPromptOverride) {
    return `${base}\n\nADDITIONAL HOTEL-SPECIFIC INSTRUCTIONS:\n${hotel.systemPromptOverride}`;
  }

  return base;
}

// ── Audit Logger ──

async function logAudit(
  sessionId: string,
  hotelConfigId: string,
  corrId: string,
  eventType: string,
  actor: "user" | "agent" | "system",
  payload: Record<string, unknown>,
  durationMs?: number
): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      sessionId,
      hotelConfigId,
      correlationId: corrId,
      eventType,
      actor,
      payload,
      durationMs,
    });
  } catch {
    // Audit logging should never break the main flow
    createRequestLogger(corrId).error("Failed to write audit log");
  }
}

// ── Tool Executor ──

async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  state: SessionState,
  sessionManager: SessionManager,
  sessionDbId: string,
  hotelConfigId: string,
  corrId: string
): Promise<{ result: string; shouldSpeak?: string; requiresConfirmation?: boolean }> {
  const log = createRequestLogger(corrId);
  const rover = getRoverClient();
  const startTime = Date.now();

  // Check action limit
  const { allowed } = await sessionManager.incrementAction(
    state.sessionKey,
    parseInt(process.env.MAX_ACTIONS_PER_SESSION ?? "50", 10),
    corrId
  );

  if (!allowed) {
    return {
      result: "Action limit reached for this session. Please start a new session or request human assistance.",
      shouldSpeak: "I've reached the maximum number of actions I can take in this session. Let me connect you with a team member who can help further.",
    };
  }

  try {
    switch (toolName) {
      case "navigate_to_page": {
        const url = toolInput.url as string;
        // Basic URL validation — only allow the hotel's domain
        const roverResult = await rover.navigate(url, state.trajectoryId, corrId);
        state.trajectoryId = roverResult.trajectory_id;
        state.currentUrl = roverResult.current_url;

        await logAudit(sessionDbId, hotelConfigId, corrId, "rover_action", "agent", {
          action: "navigate",
          url,
          result: roverResult.status,
          durationMs: Date.now() - startTime,
        });

        return {
          result: `Navigated to ${roverResult.current_url}. Status: ${roverResult.status}`,
          shouldSpeak: toolInput.narration as string,
        };
      }

      case "click_element": {
        const target = toolInput.target as string;
        const roverResult = await rover.clickElement(target, state.trajectoryId, corrId);
        state.trajectoryId = roverResult.trajectory_id;
        state.currentUrl = roverResult.current_url;

        await logAudit(sessionDbId, hotelConfigId, corrId, "rover_action", "agent", {
          action: "click",
          target,
          result: roverResult.status,
          durationMs: Date.now() - startTime,
        });

        return {
          result: `Clicked "${target}". Current URL: ${roverResult.current_url}. Status: ${roverResult.status}`,
          shouldSpeak: toolInput.narration as string,
        };
      }

      case "fill_form_field": {
        const field = toolInput.field as string;
        const value = toolInput.value as string;

        // Reject sensitive data
        if (isSensitiveInput(value)) {
          return {
            result: "BLOCKED: Cannot enter sensitive data (credit cards, SSN, passwords). Ask the user to enter it themselves.",
            shouldSpeak: "For your security, I can't enter sensitive information like payment details. Please type that in yourself.",
          };
        }

        const roverResult = await rover.fillField(field, value, state.trajectoryId, corrId);
        state.trajectoryId = roverResult.trajectory_id;

        await logAudit(sessionDbId, hotelConfigId, corrId, "rover_action", "agent", {
          action: "fill",
          field,
          valueMasked: value.length > 4 ? `${value.slice(0, 2)}...` : value,
          durationMs: Date.now() - startTime,
        });

        return {
          result: `Filled "${field}" with "${value}". Status: ${roverResult.status}`,
          shouldSpeak: toolInput.narration as string,
        };
      }

      case "scroll_page": {
        const direction = toolInput.direction as string;
        const roverResult = await rover.executeAction(
          { goal: `Scroll ${direction}`, trajectoryId: state.trajectoryId, maxSteps: 1 },
          corrId
        );
        state.trajectoryId = roverResult.trajectory_id;

        return {
          result: `Scrolled ${direction}. Page updated.`,
          shouldSpeak: toolInput.narration as string,
        };
      }

      case "extract_page_info": {
        const query = toolInput.query as string;
        const roverResult = await rover.extractContent(query, state.trajectoryId, corrId);
        state.trajectoryId = roverResult.trajectory_id;

        const extractedData = roverResult.steps
          .map((s) => s.description)
          .join("\n");

        await logAudit(sessionDbId, hotelConfigId, corrId, "rover_action", "agent", {
          action: "extract",
          query,
          durationMs: Date.now() - startTime,
        });

        return { result: extractedData || "No relevant information found on the current page." };
      }

      case "request_booking_confirmation": {
        const summary = toolInput.summary as string;

        await sessionManager.setPendingAction(
          state.sessionKey,
          "booking",
          toolInput,
          corrId
        );

        await logAudit(sessionDbId, hotelConfigId, corrId, "consent_requested", "agent", {
          bookingDetails: toolInput,
        });

        return {
          result: "Booking confirmation requested. Waiting for user to confirm both verbally and via the confirm button.",
          shouldSpeak: summary,
          requiresConfirmation: true,
        };
      }

      case "execute_booking": {
        // Verify consent was granted
        const currentState = await sessionManager.get(state.sessionKey, corrId);
        if (
          !currentState?.pendingAction ||
          currentState.pendingAction.type !== "booking" ||
          currentState.pendingAction.awaitingConfirmation
        ) {
          return {
            result: "BLOCKED: Cannot execute booking — user confirmation has not been received. Use request_booking_confirmation first.",
            shouldSpeak: "I need your explicit confirmation before I can complete this booking. Could you please confirm?",
          };
        }

        // Proceed with booking via Rover
        const roverResult = await rover.clickElement(
          "the final book now / reserve / complete booking button",
          state.trajectoryId,
          corrId
        );
        state.trajectoryId = roverResult.trajectory_id;

        await sessionManager.clearPendingAction(state.sessionKey, corrId);

        await logAudit(sessionDbId, hotelConfigId, corrId, "booking_confirmed", "agent", {
          confirmation_id: toolInput.confirmation_id,
          roverStatus: roverResult.status,
          durationMs: Date.now() - startTime,
        });

        return {
          result: `Booking action completed. Status: ${roverResult.status}. Current URL: ${roverResult.current_url}`,
          shouldSpeak: toolInput.narration as string,
        };
      }

      case "request_human_handoff": {
        state.status = "handoff";
        await sessionManager.set(state.sessionKey, state, corrId);

        await logAudit(sessionDbId, hotelConfigId, corrId, "handoff_requested", "agent", {
          reason: toolInput.reason,
          contextSummary: toolInput.context_summary,
        });

        return {
          result: "Handoff initiated. The user will be connected to a human agent.",
          shouldSpeak: `I'm going to connect you with a member of our team who can help you further. ${toolInput.reason as string}`,
        };
      }

      default:
        return { result: `Unknown tool: ${toolName}` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    log.error({ toolName, error: errorMessage }, "Tool execution failed");

    await logAudit(sessionDbId, hotelConfigId, corrId, "error", "system", {
      toolName,
      error: errorMessage,
      durationMs: Date.now() - startTime,
    });

    return {
      result: `Tool "${toolName}" failed: ${errorMessage}. Consider trying a different approach or offering to hand off to a human agent.`,
      shouldSpeak: "I ran into a small issue. Let me try a different approach.",
    };
  }
}

// ── Sensitive Input Detection ──

function isSensitiveInput(value: string): boolean {
  const stripped = value.replace(/[\s-]/g, "");
  // Credit card pattern (13-19 digits)
  if (/^\d{13,19}$/.test(stripped)) return true;
  // SSN pattern
  if (/^\d{9}$/.test(stripped) || /^\d{3}-\d{2}-\d{4}$/.test(value)) return true;
  // CVV
  if (/^\d{3,4}$/.test(stripped) && stripped.length <= 4) return false; // Too short to flag on its own
  // Password-like (only if explicitly labeled)
  return false;
}

// ── Main Orchestrate Function ──

export interface OrchestrateResult {
  response: string;
  narrations: string[];
  requiresConfirmation: boolean;
  sessionStatus: string;
  actionsTaken: string[];
}

export async function orchestrate(
  sessionKey: string,
  hotelId: string,
  userMessage: string,
  consentResponse?: { granted: boolean; method: string }
): Promise<OrchestrateResult> {
  const corrId = genCorrelationId();
  const log = createRequestLogger(corrId, { hotelId, sessionKey });
  const sessionManager = getSessionManager();

  // Load hotel config
  const [hotel] = await db
    .select()
    .from(hotelConfigs)
    .where(eq(hotelConfigs.id, hotelId))
    .limit(1);

  if (!hotel || !hotel.isActive) {
    throw new OrchestrateError("Hotel configuration not found or inactive", 404);
  }

  // Load or create session
  let state = await sessionManager.get(sessionKey, corrId);
  if (!state) {
    state = await sessionManager.create(sessionKey, hotelId, corrId);

    // Create DB session record
    await db.insert(sessions).values({
      hotelConfigId: hotelId,
      sessionKey,
      status: "active",
    });
  }

  // Get session DB record ID for audit logs
  const [sessionRecord] = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(eq(sessions.sessionKey, sessionKey))
    .limit(1);

  const sessionDbId = sessionRecord?.id ?? "";

  // Handle consent response
  if (consentResponse && state.pendingAction) {
    if (consentResponse.granted) {
      state.pendingAction.awaitingConfirmation = false;
      state.status = "active";
      await sessionManager.set(sessionKey, state, corrId);

      await logAudit(sessionDbId, hotel.id, corrId, "consent_granted", "user", {
        method: consentResponse.method,
        actionType: state.pendingAction.type,
      });
    } else {
      await sessionManager.clearPendingAction(sessionKey, corrId);

      await logAudit(sessionDbId, hotel.id, corrId, "consent_denied", "user", {
        actionType: state.pendingAction.type,
      });
    }
  }

  // Log user utterance
  await logAudit(sessionDbId, hotel.id, corrId, "utterance_in", "user", {
    text: userMessage,
  });

  // Add user message to session
  state = (await sessionManager.addMessage(sessionKey, "user", userMessage, corrId))!;

  // Build Claude messages
  const messages: Anthropic.MessageParam[] = state.conversationHistory.map((msg) => ({
    role: msg.role === "system" ? "user" : msg.role,
    content:
      msg.role === "system" ? `[System: ${msg.content}]` : msg.content,
  }));

  // Initialize Claude client
  const anthropic = new Anthropic();
  const narrations: string[] = [];
  const actionsTaken: string[] = [];
  let requiresConfirmation = false;
  let finalResponse = "";

  // ReAct loop — up to 8 tool-use turns
  const MAX_TURNS = 8;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    log.info({ turn, messageCount: messages.length }, "Claude turn");

    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: buildSystemPrompt(hotel),
      tools: TOOLS,
      messages,
    });

    // Process response blocks
    const assistantContent: Anthropic.ContentBlock[] = response.content;

    // Collect text blocks
    const textBlocks = assistantContent.filter(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );

    // If there are text blocks and no tool use, we're done
    if (response.stop_reason === "end_turn" || !assistantContent.some((b) => b.type === "tool_use")) {
      finalResponse = textBlocks.map((b) => b.text).join("\n");
      break;
    }

    // Process tool calls
    messages.push({ role: "assistant", content: assistantContent });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];

    for (const block of assistantContent) {
      if (block.type !== "tool_use") continue;

      log.info({ tool: block.name, input: block.input }, "Tool call");

      await logAudit(sessionDbId, hotel.id, corrId, "tool_call", "agent", {
        tool: block.name,
        input: block.input,
      });

      const { result, shouldSpeak, requiresConfirmation: needsConfirm } = await executeTool(
        block.name,
        block.input as Record<string, unknown>,
        state,
        sessionManager,
        sessionDbId,
        hotel.id,
        corrId
      );

      if (shouldSpeak) {
        narrations.push(shouldSpeak);
      }
      if (needsConfirm) {
        requiresConfirmation = true;
      }
      actionsTaken.push(`${block.name}: ${result.slice(0, 100)}`);

      await logAudit(sessionDbId, hotel.id, corrId, "tool_result", "system", {
        tool: block.name,
        result: result.slice(0, 500),
      });

      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: result,
      });
    }

    messages.push({ role: "user", content: toolResults });
  }

  // If no final text response from Claude, use narrations
  if (!finalResponse && narrations.length > 0) {
    finalResponse = narrations[narrations.length - 1]!;
  }

  // Log agent response
  await logAudit(sessionDbId, hotel.id, corrId, "utterance_out", "agent", {
    text: finalResponse,
    narrations,
    actionsTaken,
  });

  // Save assistant message to session
  await sessionManager.addMessage(sessionKey, "assistant", finalResponse, corrId);

  // Update session DB record
  await db
    .update(sessions)
    .set({
      actionCount: state.actionCount,
      currentUrl: state.currentUrl,
      trajectoryId: state.trajectoryId,
      status: state.status,
    })
    .where(eq(sessions.sessionKey, sessionKey));

  return {
    response: finalResponse,
    narrations,
    requiresConfirmation,
    sessionStatus: state.status,
    actionsTaken,
  };
}

export class OrchestrateError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "OrchestrateError";
  }
}
