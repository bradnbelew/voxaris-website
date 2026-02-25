import { describe, it, expect } from "vitest";
import { correlationId, sessionKey, embedKey } from "@/lib/utils/id";

describe("ID generators", () => {
  it("correlationId has correct prefix and length", () => {
    const id = correlationId();
    expect(id).toMatch(/^cor_[A-Za-z0-9_-]{21}$/);
  });

  it("sessionKey has correct prefix", () => {
    const key = sessionKey();
    expect(key).toMatch(/^ses_[A-Za-z0-9_-]{16}$/);
  });

  it("embedKey has correct prefix", () => {
    const key = embedKey();
    expect(key).toMatch(/^emb_[A-Za-z0-9_-]{12}$/);
  });

  it("generates unique values", () => {
    const ids = new Set(Array.from({ length: 100 }, () => correlationId()));
    expect(ids.size).toBe(100);
  });
});
