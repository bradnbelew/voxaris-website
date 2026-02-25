import { nanoid } from "nanoid";

/** Generate a correlation ID for tracing a single request across services */
export function correlationId(): string {
  return `cor_${nanoid(21)}`;
}

/** Generate a session key */
export function sessionKey(): string {
  return `ses_${nanoid(16)}`;
}

/** Generate an embed key for hotel installations */
export function embedKey(): string {
  return `emb_${nanoid(12)}`;
}
