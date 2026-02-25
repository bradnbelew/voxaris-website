import { z } from "zod";
import { withRetry, CircuitBreaker } from "@/lib/utils/retry";
import { createRequestLogger } from "@/lib/utils/logger";
import type { RoverActionResult } from "@/lib/schemas/events";

// ── Types ──

interface RoverAgentRequest {
  goal: string;
  startUrl?: string;
  trajectoryId?: string;
  emitEvents?: boolean;
  maxSteps?: number;
  timeout?: number;
}

interface RoverAgentResponse {
  trajectory_id: string;
  status: "running" | "completed" | "error";
  steps: RoverStep[];
  current_url: string;
  screenshot_url?: string;
}

interface RoverStep {
  action: string;
  selector?: string;
  value?: string;
  description: string;
  result: "success" | "error";
  duration_ms: number;
}

const agentResponseSchema = z.object({
  trajectory_id: z.string(),
  status: z.enum(["running", "completed", "error"]),
  steps: z.array(
    z.object({
      action: z.string(),
      selector: z.string().optional(),
      value: z.string().optional(),
      description: z.string(),
      result: z.enum(["success", "error"]),
      duration_ms: z.number(),
    })
  ),
  current_url: z.string(),
  screenshot_url: z.string().optional(),
});

// ── Circuit Breaker ──

const roverCircuit = new CircuitBreaker({
  name: "rover-api",
  failureThreshold: 5,
  resetTimeoutMs: 30_000,
});

// ── Client ──

export class RoverClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = process.env.ROVER_API_BASE ?? "https://api.rtrvr.ai/v1";
    this.apiKey = process.env.ROVER_API_KEY ?? "";
    if (!this.apiKey) {
      throw new Error("ROVER_API_KEY is required");
    }
  }

  /** Execute a goal-based agent action via the Rover /agent API */
  async executeAction(
    request: RoverAgentRequest,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    const log = createRequestLogger(correlationId, { service: "rover" });
    const startTime = Date.now();

    log.info({ goal: request.goal, trajectoryId: request.trajectoryId }, "Executing Rover action");

    const result = await roverCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch(`${this.baseUrl}/agent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
              "X-Correlation-Id": correlationId,
            },
            body: JSON.stringify({
              goal: request.goal,
              start_url: request.startUrl,
              trajectory_id: request.trajectoryId,
              emit_events: request.emitEvents ?? true,
              max_steps: request.maxSteps ?? 10,
              timeout: request.timeout ?? 30_000,
            }),
            signal: AbortSignal.timeout(35_000),
          });

          if (!response.ok) {
            const body = await response.text();
            throw new RoverApiError(response.status, body);
          }

          const raw = await response.json();
          return agentResponseSchema.parse(raw);
        },
        { maxRetries: 2, baseDelayMs: 1000 }
      )
    );

    log.info(
      {
        trajectoryId: result.trajectory_id,
        status: result.status,
        steps: result.steps.length,
        durationMs: Date.now() - startTime,
      },
      "Rover action complete"
    );

    return result;
  }

  /** Navigate to a specific URL */
  async navigate(
    url: string,
    trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        goal: `Navigate to ${url}`,
        startUrl: url,
        trajectoryId,
        maxSteps: 1,
      },
      correlationId
    );
  }

  /** Click an element described in natural language */
  async clickElement(
    description: string,
    trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        goal: `Click the element: ${description}`,
        trajectoryId,
        maxSteps: 3,
      },
      correlationId
    );
  }

  /** Fill a form field */
  async fillField(
    fieldDescription: string,
    value: string,
    trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        goal: `Find the field "${fieldDescription}" and type "${value}" into it`,
        trajectoryId,
        maxSteps: 3,
      },
      correlationId
    );
  }

  /** Extract information from the current page */
  async extractContent(
    query: string,
    trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        goal: `Extract the following information from the current page: ${query}`,
        trajectoryId,
        maxSteps: 2,
      },
      correlationId
    );
  }

  /** Get the live view iframe URL for monitoring */
  getLiveViewUrl(trajectoryId: string): string {
    return `${this.baseUrl}/live/${trajectoryId}`;
  }

  /** Check circuit breaker state */
  get isAvailable(): boolean {
    return roverCircuit.currentState !== "open";
  }
}

export class RoverApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly body: string
  ) {
    super(`Rover API error ${statusCode}: ${body}`);
    this.name = "RoverApiError";
  }
}

// ── Client-Side PostMessage Bridge Types ──
// These types are used by the embed script to communicate with the Rover embed

export interface RoverBridgeMessage {
  type: "voxaris:rover:action";
  payload: {
    action: "navigate" | "click" | "fill" | "scroll" | "extract";
    target?: string;
    value?: string;
    correlationId: string;
  };
}

export interface RoverBridgeResponse {
  type: "voxaris:rover:result";
  payload: {
    correlationId: string;
    success: boolean;
    data?: unknown;
    error?: string;
  };
}

/** Singleton */
let _roverClient: RoverClient | undefined;
export function getRoverClient(): RoverClient {
  if (!_roverClient) {
    _roverClient = new RoverClient();
  }
  return _roverClient;
}
