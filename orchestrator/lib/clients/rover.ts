import { z } from "zod";
import { withRetry, CircuitBreaker } from "@/lib/utils/retry";
import { createRequestLogger } from "@/lib/utils/logger";
import type { RoverActionResult } from "@/lib/schemas/events";

// ── Types (current rtrvr.ai API) ──

interface RoverAgentRequest {
  /** Natural-language task description */
  input: string;
  /** Starting URLs for the agent */
  urls?: string[];
  /** Expected response structure (JSON Schema) */
  outputSchema?: Record<string, unknown>;
  /** Verbosity: "final" | "steps" | "debug" */
  verbosity?: "final" | "steps" | "debug";
  /** Max execution steps */
  maxSteps?: number;
  /** Webhook callbacks */
  webhooks?: { url: string; events: string[] }[];
}

interface RoverScrapeRequest {
  /** What to extract */
  input: string;
  /** URLs to scrape */
  urls: string[];
}

interface RoverStep {
  action: string;
  selector?: string | undefined;
  value?: string | undefined;
  description: string;
  result: "success" | "error";
  duration_ms: number;
}

interface RoverAgentResponse {
  id: string;
  status: "running" | "completed" | "error";
  output?: unknown;
  steps: RoverStep[];
  current_url: string;
  screenshot_url?: string | undefined;
  metadata?: {
    responseRef?: string;
    outputRef?: string;
  };
}

interface RoverScrapeResponse {
  id: string;
  status: "completed" | "error";
  text?: string;
  accessibility_tree?: string;
  metadata?: {
    responseRef?: string;
  };
}

// Keep backward compat — callers that still use the old shape
// can use this alias, which maps to the new response
export type { RoverAgentResponse };

const agentResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["running", "completed", "error"]),
  output: z.unknown().optional(),
  steps: z.array(
    z.object({
      action: z.string(),
      selector: z.string().optional(),
      value: z.string().optional(),
      description: z.string(),
      result: z.enum(["success", "error"]),
      duration_ms: z.number(),
    })
  ).default([]),
  current_url: z.string().default(""),
  screenshot_url: z.string().optional(),
  metadata: z.object({
    responseRef: z.string().optional(),
    outputRef: z.string().optional(),
  }).optional(),
});

const scrapeResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["completed", "error"]),
  text: z.string().optional(),
  accessibility_tree: z.string().optional(),
  metadata: z.object({
    responseRef: z.string().optional(),
  }).optional(),
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
    this.baseUrl = process.env.ROVER_API_BASE ?? "https://api.rtrvr.ai";
    this.apiKey = process.env.ROVER_API_KEY ?? "";
    if (!this.apiKey) {
      throw new Error("ROVER_API_KEY is required");
    }
  }

  // ── /agent — full planner + tools engine ──

  async executeAction(
    request: RoverAgentRequest,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    const log = createRequestLogger(correlationId, { service: "rover" });
    const startTime = Date.now();

    log.info({ input: request.input, urls: request.urls }, "Executing Rover agent task");

    const result = await roverCircuit.execute(() =>
      withRetry(
        async () => {
          const body: Record<string, unknown> = {
            input: request.input,
          };
          if (request.urls?.length) body.urls = request.urls;
          if (request.outputSchema) body.output_schema = request.outputSchema;
          if (request.maxSteps) body.response = { ...(body.response as Record<string, unknown> ?? {}), max_steps: request.maxSteps };
          if (request.verbosity) body.response = { ...(body.response as Record<string, unknown> ?? {}), verbosity: request.verbosity };
          if (request.webhooks?.length) body.webhooks = request.webhooks;

          const response = await fetch(`${this.baseUrl}/agent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
              "X-Correlation-Id": correlationId,
            },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(60_000),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new RoverApiError(response.status, text);
          }

          const raw = await response.json();
          return agentResponseSchema.parse(raw);
        },
        { maxRetries: 2, baseDelayMs: 1000 }
      )
    );

    log.info(
      {
        id: result.id,
        status: result.status,
        steps: result.steps.length,
        durationMs: Date.now() - startTime,
      },
      "Rover agent task complete"
    );

    return result;
  }

  // ── /scrape — accessibility tree extraction ──

  async scrape(
    request: RoverScrapeRequest,
    correlationId: string
  ): Promise<RoverScrapeResponse> {
    const log = createRequestLogger(correlationId, { service: "rover" });
    log.info({ input: request.input, urls: request.urls }, "Scraping via Rover");

    const result = await roverCircuit.execute(() =>
      withRetry(
        async () => {
          const response = await fetch(`${this.baseUrl}/scrape`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
              "X-Correlation-Id": correlationId,
            },
            body: JSON.stringify({
              input: request.input,
              urls: request.urls,
            }),
            signal: AbortSignal.timeout(30_000),
          });

          if (!response.ok) {
            const text = await response.text();
            throw new RoverApiError(response.status, text);
          }

          const raw = await response.json();
          return scrapeResponseSchema.parse(raw);
        },
        { maxRetries: 2, baseDelayMs: 1000 }
      )
    );

    log.info({ id: result.id, status: result.status }, "Rover scrape complete");
    return result;
  }

  // ── Convenience methods ──

  /** Navigate to a specific URL */
  async navigate(
    url: string,
    _trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        input: `Navigate to ${url}`,
        urls: [url],
        maxSteps: 1,
        verbosity: "steps",
      },
      correlationId
    );
  }

  /** Click an element described in natural language */
  async clickElement(
    description: string,
    _trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        input: `Click the element: ${description}`,
        maxSteps: 3,
        verbosity: "steps",
      },
      correlationId
    );
  }

  /** Fill a form field */
  async fillField(
    fieldDescription: string,
    value: string,
    _trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    return this.executeAction(
      {
        input: `Find the field "${fieldDescription}" and type "${value}" into it`,
        maxSteps: 3,
        verbosity: "steps",
      },
      correlationId
    );
  }

  /** Extract information from the current page via /scrape */
  async extractContent(
    query: string,
    _trajectoryId: string | undefined,
    correlationId: string
  ): Promise<RoverAgentResponse> {
    // Use scrape for extraction, then wrap in agent response shape
    const scrapeResult = await this.scrape(
      { input: query, urls: [] },
      correlationId
    );

    return {
      id: scrapeResult.id,
      status: scrapeResult.status === "completed" ? "completed" : "error",
      output: scrapeResult.text || scrapeResult.accessibility_tree,
      steps: [{
        action: "extract",
        description: scrapeResult.text || scrapeResult.accessibility_tree || "No content extracted",
        result: scrapeResult.status === "completed" ? "success" : "error",
        duration_ms: 0,
      }],
      current_url: "",
    };
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
