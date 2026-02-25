import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.NODE_ENV === "development"
    ? { transport: { target: "pino-pretty" } }
    : {}),
});

/** Create a child logger with correlation context */
export function createRequestLogger(correlationId: string, extra?: Record<string, unknown>) {
  return logger.child({ correlationId, ...extra });
}
