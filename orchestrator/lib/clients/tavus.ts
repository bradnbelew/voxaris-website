import { withRetry, CircuitBreaker } from "@/lib/utils/retry";
import { createRequestLogger } from "@/lib/utils/logger";
import crypto from "node:crypto";

// ── Types ──

interface CreateConversationRequest {
  personaId: string;
  conversationName?: string;
  customGreeting?: string;
  callbackUrl?: string;
  properties?: Record<string, unknown>;
}

interface ConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: string;
}

interface TavusPersona {
  persona_id: string;
  persona_name: string;
  system_prompt: string;
  default_replica_id: string;
}

// ── Circuit Breaker ──

const tavusCircuit = new CircuitBreaker({
  name: "tavus-api",
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
});

// ── Client ──

export class TavusClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://tavusapi.com/v2";

  constructor() {
    this.apiKey = process.env.TAVUS_API_KEY ?? "";
    if (!this.apiKey) {
      throw new Error("TAVUS_API_KEY is required");
    }
  }

  /** Create a new CVI conversation session */
  async createConversation(
    request: CreateConversationRequest,
    correlationId: string
  ): Promise<ConversationResponse> {
    const log = createRequestLogger(correlationId, { service: "tavus" });

    log.info({ personaId: request.personaId }, "Creating Tavus conversation");

    return tavusCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch(`${this.baseUrl}/conversations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": this.apiKey,
            },
            body: JSON.stringify({
              persona_id: request.personaId,
              conversation_name: request.conversationName,
              custom_greeting: request.customGreeting,
              callback_url: request.callbackUrl,
              properties: request.properties,
            }),
            signal: AbortSignal.timeout(15_000),
          });

          if (!response.ok) {
            const body = await response.text();
            throw new TavusApiError(response.status, body);
          }

          return (await response.json()) as ConversationResponse;
        },
        { maxRetries: 2 }
      )
    );
  }

  /** End a conversation */
  async endConversation(
    conversationId: string,
    correlationId: string
  ): Promise<void> {
    const log = createRequestLogger(correlationId, { service: "tavus" });
    log.info({ conversationId }, "Ending Tavus conversation");

    await tavusCircuit.execute(() =>
      withRetry(async () => {
        const response = await fetch(
          `${this.baseUrl}/conversations/${conversationId}/end`,
          {
            method: "POST",
            headers: { "x-api-key": this.apiKey },
            signal: AbortSignal.timeout(10_000),
          }
        );

        if (!response.ok && response.status !== 404) {
          const body = await response.text();
          throw new TavusApiError(response.status, body);
        }
      })
    );
  }

  /** Get persona details */
  async getPersona(
    personaId: string,
    correlationId: string
  ): Promise<TavusPersona> {
    const log = createRequestLogger(correlationId, { service: "tavus" });
    log.info({ personaId }, "Fetching Tavus persona");

    return tavusCircuit.execute(() =>
      withRetry(async () => {
        const response = await fetch(
          `${this.baseUrl}/personas/${personaId}`,
          {
            headers: { "x-api-key": this.apiKey },
            signal: AbortSignal.timeout(10_000),
          }
        );

        if (!response.ok) {
          const body = await response.text();
          throw new TavusApiError(response.status, body);
        }

        return (await response.json()) as TavusPersona;
      })
    );
  }

  /** Send a message/tool result back to an active conversation */
  async sendToolResult(
    conversationId: string,
    toolCallId: string,
    result: Record<string, unknown>,
    correlationId: string
  ): Promise<void> {
    const log = createRequestLogger(correlationId, { service: "tavus" });
    log.info({ conversationId, toolCallId }, "Sending tool result to Tavus");

    await tavusCircuit.execute(() =>
      withRetry(async () => {
        const response = await fetch(
          `${this.baseUrl}/conversations/${conversationId}/tool_result`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": this.apiKey,
            },
            body: JSON.stringify({
              tool_call_id: toolCallId,
              result,
            }),
            signal: AbortSignal.timeout(10_000),
          }
        );

        if (!response.ok) {
          const body = await response.text();
          throw new TavusApiError(response.status, body);
        }
      })
    );
  }

  /** Verify a Tavus webhook signature */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  }

  get isAvailable(): boolean {
    return tavusCircuit.currentState !== "open";
  }
}

export class TavusApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: string
  ) {
    super(`Tavus API error ${statusCode}: ${body}`);
    this.name = "TavusApiError";
  }
}

// ── Arrivia-specific Types ──

interface CreateArriviaConversationRequest {
  personaId: string;
  replicaId?: string | undefined;
  conversationName?: string | undefined;
  customGreeting?: string | undefined;
  callbackUrl?: string | undefined;
  conversationalContext?: string | undefined;
  properties?: Record<string, unknown> | undefined;
  maxCallDuration?: number | undefined;
  memoryStores?: string[] | undefined;
  documentIds?: string[] | undefined;
  documentTags?: string[] | undefined;
}

// ── Extended Client for Arrivia ──

export class ArriviaTavusClient extends TavusClient {
  /** Create a conversation with Arrivia-specific fields (conversational_context, replica_id) */
  async createArriviaConversation(
    request: CreateArriviaConversationRequest,
    correlationId: string
  ): Promise<ConversationResponse> {
    const log = createRequestLogger(correlationId, { service: "tavus-arrivia" });
    log.info({ personaId: request.personaId }, "Creating Arrivia Tavus conversation");

    return tavusCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch("https://tavusapi.com/v2/conversations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.TAVUS_API_KEY ?? "",
            },
            body: JSON.stringify({
              persona_id: request.personaId,
              replica_id: request.replicaId,
              conversation_name: request.conversationName,
              custom_greeting: request.customGreeting,
              callback_url: request.callbackUrl,
              conversational_context: request.conversationalContext,
              ...(request.memoryStores?.length && { memory_stores: request.memoryStores }),
              ...(request.documentIds?.length && { document_ids: request.documentIds }),
              ...(request.documentTags?.length && { document_tags: request.documentTags }),
              properties: {
                max_call_duration: request.maxCallDuration ?? 600,
                participant_left_timeout: 30,
                participant_absent_timeout: 120,
                enable_recording: true,
                enable_transcription: true,
                language: "english",
              },
            }),
            signal: AbortSignal.timeout(15_000),
          });

          if (!response.ok) {
            const body = await response.text();
            throw new TavusApiError(response.status, body);
          }

          return (await response.json()) as ConversationResponse;
        },
        { maxRetries: 2 }
      )
    );
  }
}

/** Singleton */
let _tavusClient: TavusClient | undefined;
export function getTavusClient(): TavusClient {
  if (!_tavusClient) {
    _tavusClient = new TavusClient();
  }
  return _tavusClient;
}

/** Singleton for Arrivia-specific client */
let _arriviaTavusClient: ArriviaTavusClient | undefined;
export function getArriviaTavusClient(): ArriviaTavusClient {
  if (!_arriviaTavusClient) {
    _arriviaTavusClient = new ArriviaTavusClient();
  }
  return _arriviaTavusClient;
}
