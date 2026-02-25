import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

/** Per-IP rate limiter for API routes */
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.RATE_LIMIT_RPM ?? "60", 10),
    "1 m"
  ),
  analytics: true,
  prefix: "vox:rl:api",
});

/** Per-session rate limiter for orchestration calls */
export const sessionRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "vox:rl:session",
});
