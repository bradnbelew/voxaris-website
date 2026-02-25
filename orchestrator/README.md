# Voxaris Orchestrator

Real-time conversational video AI concierge that visibly controls hotel websites using Tavus CVI + Rover DOM automation, orchestrated by Claude 4.

## Architecture

```
Hotel Website
  ├── Rover embed script (visible DOM actions)
  ├── Tavus CVI widget (video avatar)
  └── Voxaris loader (postMessage bridge)
         │
         ▼
Vercel Edge/Serverless
  ├── /api/orchestrate (Claude ReAct agent)
  ├── /api/webhooks/tavus (CVI events)
  ├── /api/embed/[hotelId] (config loader)
  └── /api/dashboard/* (multi-tenant CRUD)
         │
         ▼
External Services
  ├── Claude 4 (Sonnet/Opus) — tool-calling brain
  ├── Tavus CVI API — photorealistic video avatar
  ├── Rover /agent API — DOM automation
  ├── Clerk — multi-tenant auth
  ├── Vercel Postgres — persistent storage
  └── Vercel KV — session state
```

## Quick Start

### Prerequisites

- Node.js 22+
- Vercel account with Postgres + KV addons
- API keys: Anthropic, Tavus, Rover, Clerk

### Setup

```bash
# Clone and install
git clone <repo-url>
cd voxaris-orchestrator
npm install

# Configure environment
cp .env.example .env.local
# Fill in all API keys in .env.local

# Run database migrations
npx drizzle-kit push

# Start dev server
npm run dev
```

### Hotel Integration (One Script Tag)

After creating a hotel config in the dashboard, hotels add a single script:

```html
<script
  src="https://orchestrator.voxaris.io/voxaris-loader.js"
  data-hotel-id="YOUR_HOTEL_UUID"
  data-embed-key="emb_YOUR_KEY"
  data-position="bottom-right"
  async
></script>
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

CI/CD is configured via GitHub Actions — push to `main` auto-deploys.

### Environment Variables

See `.env.example` for the complete list. All secrets go in Vercel project settings.

## Dashboard

The multi-tenant dashboard at `/dashboard` provides:

- **Hotels**: Create and manage hotel configurations
- **Sessions**: Monitor live and recent guest interactions
- **Audit Log**: Full trail of every utterance, tool call, and Rover action

Authentication is handled by Clerk with organization-based multi-tenancy.

## Safety & Compliance

### Booking Safety

- Every booking requires **dual confirmation**: verbal + UI button click
- Payment info is **never entered** by the agent — guests type it themselves
- All actions are logged to an immutable audit trail
- Sessions have configurable action limits (default: 50)

### Security

- [x] Zod validation on all inputs
- [x] Rate limiting (per-IP and per-session)
- [x] Webhook signature verification (Tavus)
- [x] Origin validation for embed endpoints
- [x] No client-side secrets
- [x] Sensitive data detection and blocking
- [x] CORS properly configured
- [x] Security headers (CSP-ready, X-Frame-Options, etc.)

### GDPR

- Session data auto-expires via KV TTL
- Audit logs can be exported/deleted per hotel
- No PII stored beyond session scope
- Cookie-free embed (no tracking)

### PCI DSS

- Agent never touches payment card data
- Sensitive input detection blocks CC numbers
- No card data in logs or session state
- Hotels handle payment through their own PCI-compliant systems

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Type checking
npx tsc --noEmit
```

## Cost Optimization

| Component | Estimated Cost | Notes |
|-----------|---------------|-------|
| Claude API | ~$0.02-0.08/session | 3-8 turns avg, Sonnet pricing |
| Tavus CVI | Per-minute pricing | Video generation |
| Rover | Per-action pricing | DOM automation |
| Vercel | $20/mo Pro plan | Edge + Serverless |
| Postgres | Included in Vercel | Up to 256MB free |
| KV | Included in Vercel | Up to 256MB free |

### Optimization Strategies

- Use Claude Sonnet (not Opus) for routine navigation
- Cache Rover trajectories for common flows
- Session KV TTL prevents state bloat
- Audit log archival to cold storage after 90 days
- Embed config cached (5min) at CDN edge

## License

Proprietary - Voxaris Inc.
