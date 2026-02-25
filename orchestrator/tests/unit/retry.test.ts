import { describe, it, expect, vi } from "vitest";
import { withRetry, CircuitBreaker, CircuitOpenError } from "@/lib/utils/retry";

describe("withRetry", () => {
  it("succeeds on first attempt", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const result = await withRetry(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on failure then succeeds", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"))
      .mockResolvedValue("ok");

    const result = await withRetry(fn, { maxRetries: 3, baseDelayMs: 10 });
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("throws after exhausting retries", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("always fails"));

    await expect(
      withRetry(fn, { maxRetries: 2, baseDelayMs: 10 })
    ).rejects.toThrow("always fails");

    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });
});

describe("CircuitBreaker", () => {
  it("starts closed", () => {
    const cb = new CircuitBreaker({ name: "test", failureThreshold: 3 });
    expect(cb.currentState).toBe("closed");
  });

  it("opens after threshold failures", async () => {
    const cb = new CircuitBreaker({
      name: "test",
      failureThreshold: 2,
      resetTimeoutMs: 100,
    });

    const failingFn = () => Promise.reject(new Error("fail"));

    await expect(cb.execute(failingFn)).rejects.toThrow("fail");
    await expect(cb.execute(failingFn)).rejects.toThrow("fail");

    // Circuit should now be open
    expect(cb.currentState).toBe("open");

    await expect(cb.execute(failingFn)).rejects.toThrow(CircuitOpenError);
  });

  it("transitions to half-open after timeout", async () => {
    const cb = new CircuitBreaker({
      name: "test",
      failureThreshold: 1,
      resetTimeoutMs: 50,
    });

    await expect(
      cb.execute(() => Promise.reject(new Error("fail")))
    ).rejects.toThrow();

    expect(cb.currentState).toBe("open");

    // Wait for reset
    await new Promise((r) => setTimeout(r, 60));

    // Next call should be allowed (half-open)
    const result = await cb.execute(() => Promise.resolve("recovered"));
    expect(result).toBe("recovered");
    expect(cb.currentState).toBe("closed");
  });
});
