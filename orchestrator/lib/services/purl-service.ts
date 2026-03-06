import crypto from "node:crypto";
import { createRequestLogger } from "@/lib/utils/logger";

// ── PURL Service ──
// Generates cryptographically signed Personalized URLs that encode
// member context + selected package. When the member clicks the PURL,
// the booking portal decodes it and pre-fills their session.

interface PurlPayload {
  /** Booking session ID (UUID) */
  sid: string;
  /** Member name */
  mn: string;
  /** Member ID (loyalty number) */
  mid?: string | undefined;
  /** Selected package ID */
  pkg: string;
  /** Travel type */
  tt: string;
  /** Destination */
  dst?: string | undefined;
  /** Number of travelers */
  pax: number;
  /** Departure date (ISO 8601) */
  dep?: string | undefined;
  /** Member email */
  em?: string | undefined;
  /** Issued-at timestamp (Unix seconds) */
  iat: number;
  /** Expiry timestamp (Unix seconds) */
  exp: number;
}

interface PurlGenerateInput {
  sessionId: string;
  memberName: string;
  memberId?: string | undefined;
  packageId: string;
  travelType: string;
  destination?: string | undefined;
  travelers: number;
  departureDate?: string | undefined;
  memberEmail?: string | undefined;
  ttlMinutes?: number | undefined;
}

interface PurlDecodeResult {
  valid: boolean;
  expired: boolean;
  payload: PurlPayload | null;
  error?: string;
}

const PURL_SECRET = () => {
  const secret = process.env.PURL_SIGNING_SECRET;
  if (!secret) throw new Error("PURL_SIGNING_SECRET is required");
  return secret;
};

const PURL_BASE_URL = () =>
  process.env.PURL_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://book.voxaris.io";

const DEFAULT_TTL_MINUTES = 120; // 2 hours

/**
 * Generate an HMAC-SHA256 signature for a payload.
 */
function sign(data: string): string {
  return crypto
    .createHmac("sha256", PURL_SECRET())
    .update(data)
    .digest("base64url");
}

/**
 * Verify an HMAC-SHA256 signature.
 */
function verify(data: string, signature: string): boolean {
  const expected = sign(data);
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
}

/**
 * Encode a payload to a URL-safe Base64 string.
 */
function encodePayload(payload: PurlPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/**
 * Decode a Base64url string back to a PurlPayload.
 */
function decodePayload(encoded: string): PurlPayload {
  return JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8")) as PurlPayload;
}

export class PurlService {
  /**
   * Generate a signed PURL for the given booking context.
   *
   * URL format: {baseUrl}/b/{encodedPayload}.{signature}
   *
   * The payload is NOT encrypted — it's signed. The booking portal
   * can read the payload directly but cannot tamper with it.
   * For sensitive data (PII), the payload only contains the session ID;
   * full member details are fetched server-side from the DB.
   */
  static generate(input: PurlGenerateInput, correlationId: string): string {
    const log = createRequestLogger(correlationId, { service: "purl" });

    const now = Math.floor(Date.now() / 1000);
    const ttl = (input.ttlMinutes ?? DEFAULT_TTL_MINUTES) * 60;

    const payload: PurlPayload = {
      sid: input.sessionId,
      mn: input.memberName,
      mid: input.memberId,
      pkg: input.packageId,
      tt: input.travelType,
      dst: input.destination,
      pax: input.travelers,
      dep: input.departureDate,
      em: input.memberEmail,
      iat: now,
      exp: now + ttl,
    };

    const encoded = encodePayload(payload);
    const signature = sign(encoded);
    const purl = `${PURL_BASE_URL()}/b/${encoded}.${signature}`;

    log.info(
      { sessionId: input.sessionId, packageId: input.packageId, expiresIn: `${input.ttlMinutes ?? DEFAULT_TTL_MINUTES}m` },
      "PURL generated"
    );

    return purl;
  }

  /**
   * Decode and verify a PURL token from the URL path.
   *
   * Expected format: {encodedPayload}.{signature}
   */
  static decode(token: string, correlationId: string): PurlDecodeResult {
    const log = createRequestLogger(correlationId, { service: "purl" });

    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) {
      log.warn("Invalid PURL format — no signature separator");
      return { valid: false, expired: false, payload: null, error: "Invalid PURL format" };
    }

    const encoded = token.slice(0, dotIndex);
    const signature = token.slice(dotIndex + 1);

    // Verify signature
    if (!verify(encoded, signature)) {
      log.warn("PURL signature verification failed");
      return { valid: false, expired: false, payload: null, error: "Invalid signature" };
    }

    // Decode payload
    let payload: PurlPayload;
    try {
      payload = decodePayload(encoded);
    } catch {
      log.warn("PURL payload decode failed");
      return { valid: false, expired: false, payload: null, error: "Corrupted payload" };
    }

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (now > payload.exp) {
      log.info({ sessionId: payload.sid, expiredAt: new Date(payload.exp * 1000).toISOString() }, "PURL expired");
      return { valid: false, expired: true, payload, error: "PURL has expired" };
    }

    log.info({ sessionId: payload.sid }, "PURL decoded successfully");
    return { valid: true, expired: false, payload };
  }
}

export type { PurlPayload, PurlGenerateInput, PurlDecodeResult };
