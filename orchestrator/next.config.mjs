import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: "incremental",
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  headers: async () => [
    {
      source: "/api/embed/:path*",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type" },
      ],
    },
    {
      source: "/api/orchestrate",
      headers: [
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
        {
          key: "Access-Control-Allow-Headers",
          value: "Content-Type, X-Session-Id, X-Hotel-Id",
        },
      ],
    },
  ],
  serverExternalPackages: ["pino"],
};

export default withSentryConfig(nextConfig, {
  org: "voxaris",
  project: "orchestrator",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
