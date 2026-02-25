import { kv } from "@vercel/kv";
import { sessionStateSchema, type SessionState } from "@/lib/schemas/tools";
import { createRequestLogger } from "@/lib/utils/logger";

const SESSION_TTL = parseInt(process.env.SESSION_TTL_SECONDS ?? "1800", 10);
const SESSION_PREFIX = "vox:session:";

export class SessionManager {
  /** Load session from KV, returns null if expired or missing */
  async get(
    sessionKey: string,
    correlationId: string
  ): Promise<SessionState | null> {
    const log = createRequestLogger(correlationId, { service: "session" });
    const raw = await kv.get<SessionState>(`${SESSION_PREFIX}${sessionKey}`);

    if (!raw) {
      log.info({ sessionKey }, "Session not found");
      return null;
    }

    const parsed = sessionStateSchema.safeParse(raw);
    if (!parsed.success) {
      log.error({ sessionKey, errors: parsed.error.issues }, "Corrupt session data");
      return null;
    }

    return parsed.data;
  }

  /** Create or update session in KV */
  async set(
    sessionKey: string,
    state: SessionState,
    correlationId: string
  ): Promise<void> {
    const log = createRequestLogger(correlationId, { service: "session" });
    await kv.set(`${SESSION_PREFIX}${sessionKey}`, state, { ex: SESSION_TTL });
    log.debug({ sessionKey, status: state.status }, "Session updated");
  }

  /** Create a new session */
  async create(
    sessionKey: string,
    hotelId: string,
    correlationId: string
  ): Promise<SessionState> {
    const state: SessionState = {
      sessionKey,
      hotelId,
      conversationHistory: [],
      actionCount: 0,
      status: "active",
    };

    await this.set(sessionKey, state, correlationId);
    return state;
  }

  /** Append a message to conversation history */
  async addMessage(
    sessionKey: string,
    role: "user" | "assistant" | "system",
    content: string,
    correlationId: string
  ): Promise<SessionState | null> {
    const state = await this.get(sessionKey, correlationId);
    if (!state) return null;

    state.conversationHistory.push({
      role,
      content,
      timestamp: new Date().toISOString(),
    });

    // Keep last 50 messages to prevent KV size issues
    if (state.conversationHistory.length > 50) {
      state.conversationHistory = state.conversationHistory.slice(-50);
    }

    await this.set(sessionKey, state, correlationId);
    return state;
  }

  /** Increment action count, returns false if limit reached */
  async incrementAction(
    sessionKey: string,
    maxActions: number,
    correlationId: string
  ): Promise<{ allowed: boolean; count: number }> {
    const state = await this.get(sessionKey, correlationId);
    if (!state) return { allowed: false, count: 0 };

    state.actionCount++;
    const allowed = state.actionCount <= maxActions;

    if (!allowed) {
      state.status = "error";
    }

    await this.set(sessionKey, state, correlationId);
    return { allowed, count: state.actionCount };
  }

  /** Set pending action requiring user confirmation */
  async setPendingAction(
    sessionKey: string,
    actionType: string,
    details: Record<string, unknown>,
    correlationId: string
  ): Promise<void> {
    const state = await this.get(sessionKey, correlationId);
    if (!state) return;

    state.pendingAction = {
      type: actionType,
      details,
      awaitingConfirmation: true,
    };
    state.status = "awaiting_confirmation";

    await this.set(sessionKey, state, correlationId);
  }

  /** Clear pending action */
  async clearPendingAction(
    sessionKey: string,
    correlationId: string
  ): Promise<void> {
    const state = await this.get(sessionKey, correlationId);
    if (!state) return;

    state.pendingAction = undefined;
    state.status = "active";

    await this.set(sessionKey, state, correlationId);
  }

  /** End session */
  async end(sessionKey: string, correlationId: string): Promise<void> {
    const state = await this.get(sessionKey, correlationId);
    if (!state) return;

    state.status = "completed";
    await this.set(sessionKey, state, correlationId);
  }

  /** Delete session (for cleanup) */
  async delete(sessionKey: string): Promise<void> {
    await kv.del(`${SESSION_PREFIX}${sessionKey}`);
  }
}

/** Singleton */
let _sessionManager: SessionManager | undefined;
export function getSessionManager(): SessionManager {
  if (!_sessionManager) {
    _sessionManager = new SessionManager();
  }
  return _sessionManager;
}
