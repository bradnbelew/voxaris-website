import { createRequestLogger } from "@/lib/utils/logger";
import { withRetry, CircuitBreaker } from "@/lib/utils/retry";

const VAPI_BASE_URL = "https://api.vapi.ai";

// ── Error ──

export class VapiApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string
  ) {
    super(`VAPI API error ${status}: ${body}`);
    this.name = "VapiApiError";
  }
}

// ── Circuit Breaker ──

const vapiCircuit = new CircuitBreaker({
  name: "vapi-api",
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
});

// ── Client ──

export class VapiClient {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.VAPI_API_KEY ?? "";
    if (!this.apiKey) {
      throw new Error("VAPI_API_KEY environment variable is not set");
    }
  }

  /** Create a VAPI assistant via API. */
  async createAssistant(
    config: VapiAssistantConfig,
    correlationId: string
  ): Promise<{ id: string }> {
    const log = createRequestLogger(correlationId, { service: "vapi" });
    log.info({ name: config.name }, "Creating VAPI assistant");

    return vapiCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(config),
            signal: AbortSignal.timeout(15_000),
          });

          if (!response.ok) {
            const body = await response.text();
            throw new VapiApiError(response.status, body);
          }

          return (await response.json()) as { id: string };
        },
        { maxRetries: 2 }
      )
    );
  }

  /** Create an outbound phone call. */
  async createCall(
    request: VapiCreateCallRequest,
    correlationId: string
  ): Promise<VapiCallResponse> {
    const log = createRequestLogger(correlationId, { service: "vapi" });
    log.info(
      { assistantId: request.assistantId, customer: request.customer?.number },
      "Creating VAPI outbound call"
    );

    return vapiCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch(`${VAPI_BASE_URL}/call`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(request),
            signal: AbortSignal.timeout(15_000),
          });

          if (!response.ok) {
            const body = await response.text();
            throw new VapiApiError(response.status, body);
          }

          return (await response.json()) as VapiCallResponse;
        },
        { maxRetries: 2 }
      )
    );
  }

  /** Get call details by ID. */
  async getCall(
    callId: string,
    correlationId: string
  ): Promise<VapiCallResponse> {
    const log = createRequestLogger(correlationId, { service: "vapi" });
    log.info({ callId }, "Fetching VAPI call details");

    return vapiCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch(`${VAPI_BASE_URL}/call/${callId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
            signal: AbortSignal.timeout(10_000),
          });

          if (!response.ok) {
            const body = await response.text();
            throw new VapiApiError(response.status, body);
          }

          return (await response.json()) as VapiCallResponse;
        },
        { maxRetries: 2 }
      )
    );
  }

  /** List all phone numbers on the account. */
  async listPhoneNumbers(correlationId: string): Promise<VapiPhoneNumber[]> {
    const log = createRequestLogger(correlationId, { service: "vapi" });
    log.info("Listing VAPI phone numbers");

    return vapiCircuit.execute(() =>
      withRetry(async () => {
        const response = await fetch(`${VAPI_BASE_URL}/phone-number`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
          const body = await response.text();
          throw new VapiApiError(response.status, body);
        }

        return (await response.json()) as VapiPhoneNumber[];
      })
    );
  }

  get isAvailable(): boolean {
    return vapiCircuit.currentState !== "open";
  }
}

// ── Types ──

export interface VapiAssistantConfig {
  name: string;
  firstMessage: string;
  firstMessageMode: "assistant-speaks-first" | "assistant-waits-for-user";
  model: {
    provider: "openai";
    model: "gpt-4o-mini" | "gpt-4o";
    messages: Array<{ role: "system"; content: string }>;
    temperature?: number;
    maxTokens?: number;
    tools?: VapiTool[];
  };
  voice: {
    provider: "rime";
    voiceId: string;
    model?: "arcana" | "mist" | "mistv2";
    speed?: number;
  };
  transcriber: {
    provider: "deepgram";
    model: "nova-2";
    language?: string;
  };
  serverUrl: string;
  serverMessages?: string[];
  endCallMessage?: string;
  maxDurationSeconds?: number;
  backgroundSound?: "off" | "office";
  silenceTimeoutSeconds?: number;
  responseDelaySeconds?: number;
  hooks?: VapiHook[];
}

export interface VapiTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
  server?: {
    url: string;
  };
  async?: boolean;
  messages?: Array<{
    type: "request-start" | "request-complete" | "request-failed";
    content: string;
  }>;
}

export interface VapiHook {
  on: string;
  do: Array<{
    type: "say" | "tool";
    exact?: string;
    prompt?: string;
    tool?: VapiTool;
  }>;
  filters?: Array<Record<string, unknown>>;
  options?: Record<string, unknown>;
}

export interface VapiCreateCallRequest {
  assistantId?: string;
  assistant?: VapiAssistantConfig;
  squadId?: string;
  squad?: VapiSquadConfig;
  phoneNumberId: string;
  customer: {
    number: string;
    name?: string;
  };
  assistantOverrides?: Partial<VapiAssistantConfig>;
  metadata?: Record<string, string>;
}

export interface VapiSquadConfig {
  name?: string;
  members: VapiSquadMember[];
}

export interface VapiSquadMember {
  assistant?: VapiAssistantConfig;
  assistantId?: string;
  assistantDestinations?: Array<{
    type: "assistant";
    assistantName: string;
    message: string;
    description: string;
  }>;
}

export interface VapiCallResponse {
  id: string;
  orgId: string;
  type: "inboundPhoneCall" | "outboundPhoneCall" | "webCall";
  status: string;
  assistantId?: string;
  phoneNumberId?: string;
  customer?: { number: string };
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  endedAt?: string;
  cost?: number;
  endedReason?: string;
  artifact?: {
    transcript?: string;
    messages?: Array<{ role: string; message: string }>;
    recordingUrl?: string;
  };
}

export interface VapiPhoneNumber {
  id: string;
  number: string;
  provider: string;
  name?: string;
  assistantId?: string;
  squadId?: string;
}

// ── Singleton ──

let _vapiClient: VapiClient | undefined;

export function getVapiClient(): VapiClient {
  if (!_vapiClient) {
    _vapiClient = new VapiClient();
  }
  return _vapiClient;
}
