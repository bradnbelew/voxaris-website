# Voxaris Orchestrator

Real-time conversational video AI agent powered by Tavus CVI + Rover DOM automation.

## Architecture

```
Visitor speaks → Tavus Raven-1 (perception + reasoning)
                      ↓
              tool_call webhook
                      ↓
        /api/execute (thin executor)
          ↓                    ↓
   postMessage bridge     Rover REST API
   (self-demo scroll)    (hotel DOM control)
          ↓                    ↓
     voxaris-loader.js     Hotel website
     handles DOM action    visible actions
          ↓                    ↓
       Result → Tavus → Raven narrates
```

**Dual-mode**: `BRAIN_MODE=tavus` (default, ~600ms) or `BRAIN_MODE=claude` (fallback, ~1.2s)

## Ship Tonight Checklist

### 1. Environment

```bash
cd orchestrator
cp .env.example .env.local
# Fill in: TAVUS_API_KEY, TAVUS_PERSONA_ID, ROVER_API_KEY
```

### 2. Install + Build

```bash
npm install --legacy-peer-deps
npm run build
```

### 3. Tavus Persona

Persona `p40793780aaa` with replica `raf6459c9b82`.

Configure in Tavus dashboard:
- Perception: Raven-1 with ambient awareness
- Turn-taking: Sparrow-1, medium patience
- Tools: 5 tools (scroll, highlight, navigate, extract, demo booking)
- Callback URL: `https://orchestrator.voxaris.io/api/execute`
- Speculative inference: enabled

### 4. Database (when ready)

```bash
npm run db:push        # Push schema to Neon/Vercel Postgres
npx tsx scripts/seed-demo.ts   # Seed voxaris-demo config
```

### 5. Deploy

```bash
vercel --prod
```

### 6. Embed on voxaris.io

Self-demo mode (no hotel config needed):
```html
<script src="https://orchestrator.voxaris.io/voxaris-loader.js"
        data-persona-id="p40793780aaa"
        data-mode="self-demo"
        async></script>
```

Hotel integration:
```html
<script src="https://orchestrator.voxaris.io/voxaris-loader.js"
        data-hotel-id="UUID"
        data-embed-key="emb_xxxx"
        async></script>
```

## API Endpoints

| Endpoint | Method | Mode | Purpose |
|----------|--------|------|---------|
| `/api/execute` | POST | tavus | Thin tool executor for Raven-1 tool calls |
| `/api/orchestrate` | POST | claude | Full Claude ReAct loop (fallback) |
| `/api/tavus/conversation` | POST | both | Create Tavus CVI conversation |
| `/api/webhooks/tavus` | POST | both | Tavus event webhooks |
| `/api/embed/[hotelId]` | GET | both | Hotel embed config |
| `/api/dashboard/*` | GET/POST | both | Dashboard CRUD (Clerk auth) |

## Tools (Tavus-native mode)

| Tool | Description |
|------|-------------|
| `scroll_to_section` | Smooth scroll to page section (hero, features, pricing, etc.) |
| `highlight_feature` | Gold pulse animation on a feature element |
| `navigate_to_page` | Navigate to a different page on the site |
| `extract_page_content` | Read page content to answer questions |
| `request_demo_booking` | Start demo booking flow with confirmation |

## Key Files

```
app/api/execute/route.ts     <- Tavus-native tool executor
app/api/orchestrate/route.ts <- Claude fallback orchestrator
app/api/tavus/conversation/  <- Conversation creator
app/api/webhooks/tavus/      <- Webhook handler
public/voxaris-loader.js     <- One-script-tag embed (vanilla JS)
components/embed/            <- React embed component
lib/orchestrator.ts          <- Claude ReAct brain
lib/clients/rover.ts         <- Rover REST client
lib/clients/tavus.ts         <- Tavus API client
scripts/create-persona.ts    <- Persona creation script
scripts/seed-demo.ts         <- Database seeder
```

## Security

- Dual confirmation (verbal + button) for bookings
- Sensitive data detection blocks CC/SSN entry
- Rate limiting per session (30/min) and per IP (60/min)
- CORS restricted to allowed origins
- Webhook signature verification
- Immutable audit log trail
- Circuit breakers on external APIs
- Input sanitization (control char stripping)

## License

Proprietary - Voxaris Inc.
