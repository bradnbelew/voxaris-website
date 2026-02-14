# Roofing Pros USA - AI Voice, Video & Estimating Platform

## Overview
Enterprise AI system for Roofing Pros USA (Florida's largest reroofing company).
4 products: Inbound Voice (Sarah), Outbound Voice (Sarah), Video Chat (Sarah), EstimAIte.
Client: Rick Dorman, Owner/President. HQ: 7100 S US Hwy 17 92, Casselberry, FL 32730.
License: CCC1333006. Google Reviews: 636+ five-star reviews.

## Tech Stack
- Runtime: Node.js + TypeScript + Express
- Voice: Retell AI (inbound + outbound agents)
- Video: Tavus CVI (website video chat)
- LLM: GPT-4o (Retell/Tavus), Claude (backend)
- Database: Supabase (PostgreSQL with RLS)
- Queue: BullMQ + Upstash Redis (TLS)
- CRM: GoHighLevel (via n8n webhooks + direct API)
- Calendar: Cal.com (inspection scheduling)
- Email: Resend (transactional)
- Monitoring: Sentry + structured logging
- Hosting: Railway

## Service Areas (7 Metros)
- Jacksonville (320, 321, 322)
- Orlando (327, 328, 347)
- Tampa (335, 336, 337)
- West Palm Beach (334)
- Pensacola (325)
- Daytona Beach (321)
- Melbourne (329)

## Key Directories
```
server/
├── src/
│   ├── modules/roofing/           # Roofing Pros USA API
│   │   ├── roofing.controller.ts  # Main endpoints + custom functions
│   │   ├── n8n-workflows.controller.ts  # n8n integration
│   │   ├── calcom-webhooks.controller.ts # Cal.com webhooks
│   │   └── tavus-cvi.controller.ts # Video chat agent
│   ├── services/
│   │   └── outbound.service.ts    # TCPA-compliant outbound calling
│   ├── queues/
│   │   ├── queues.ts              # BullMQ queue definitions
│   │   └── roofing-followup.processor.ts # Follow-up automation
│   ├── lib/
│   │   ├── calcom.ts              # Cal.com API wrapper
│   │   ├── ghl.ts                 # GoHighLevel API wrapper
│   │   ├── redis.ts               # Upstash Redis (TLS)
│   │   ├── sentry.ts              # Error tracking
│   │   └── slack.ts               # Slack notifications
│   └── __tests__/roofing/         # Jest integration tests
├── scripts/roofing/
│   ├── demo-reset.ts              # Clear demo data
│   ├── demo-seed.ts               # Populate demo data
│   ├── demo-call.ts               # Trigger test calls
│   └── test-full-flow.ts          # E2E flow test
└── supabase/migrations/
    └── 001_initial_schema.sql     # Database schema
```

## API Endpoints

### Core Roofing API (`/api/roofing`)
```
POST /functions/book-inspection   # Book via Retell custom function
POST /functions/schedule-callback # Schedule callback
POST /functions/add-dnc           # Add to DNC list
GET  /leads/stats                 # Lead statistics
GET  /calls/recent                # Recent call logs
```

### Outbound Calling (`/api/roofing/outbound`)
```
POST /trigger                     # Initiate TCPA-compliant call
POST /dnc                         # Add to DNC list
GET  /dnc/:phone                  # Check DNC status
GET  /tcpa-status                 # Current calling window
GET  /can-call/:phone             # Combined compliance check
```

### n8n Integration (`/api/roofing/n8n`)
```
POST /ghl-sync                    # Sync call data to GHL
POST /create-appointment          # Create appointment + SMS
POST /schedule-callback           # Add callback note
POST /trigger-followup            # Start follow-up sequence
POST /update-tags                 # Update GHL contact tags
POST /send-sms                    # Send SMS via GHL
```

### Cal.com Webhooks (`/api/roofing/webhooks/calcom`)
```
POST /                            # BOOKING_CREATED, RESCHEDULED, CANCELLED
```

### Tavus Video Chat (`/api/roofing/tavus`)
```
POST /create-session              # Create CVI session
POST /tool-call                   # Handle tool calls
GET  /persona                     # Get Sarah persona config
```

## Agent Configuration

### Inbound Agent (Sarah - Receptionist)
- **Role**: Answer calls, qualify leads, book inspections
- **Voice**: Speed 1.03, Temp 0.7, Responsiveness 0.85
- **Ambient**: call-center @ 0.3
- **Key**: Recording disclosure in greeting, 9-step call flow, MANDATORY date/time confirmation

### Outbound Agent (Sarah - Follow-Up)
- **Role**: Follow up on leads, book appointments, handle callbacks
- **Voice**: Speed 1.03, Temp 0.7, Responsiveness 0.8
- **Scenarios**: new_lead, estimate_sent, no_show, review_request
- **Dynamic Variables**: {{customer_name}}, {{call_scenario}}, {{last_contact_date}}, {{estimate_amount}}, {{appointment_date}}

### Video Chat Agent (Sarah - Website)
- **Platform**: Tavus CVI
- **Tools**: check_availability, book_inspection, check_service_area
- **Max Duration**: 20 minutes
- **Guardrails**: No competitor discussion, no pricing promises, no insurance approval promises

## TCPA Compliance Rules
1. **Calling Window**: 8 AM - 9 PM Florida time (America/New_York)
2. **DNC List**: Check before EVERY call
3. **Cooldown**: 24 hours between calls to same number
4. **Max Attempts**: 3 per lead in 30-day window
5. **Opt-Out**: Immediately add to DNC on request

## Critical Rules
1. **NEVER hardcode API keys.** All keys live in .env only.
2. **NEVER process webhooks synchronously.** Queue first, return 202.
3. **ALWAYS use structured logging (Pino).** No console.log in production.
4. **ALWAYS include error handling** with try/catch and typed errors.
5. **ALWAYS check TCPA compliance before outbound calls.**
6. **Voice prompts must be voice-first:** short sentences, contractions, verbal fillers.
7. **No bullet points or markdown** inside voice agent prompts.
8. **Max 2 sentences** per agent response turn.
9. **Florida is a two-party consent state.** Every call MUST start with recording disclosure.
10. **Every Supabase query MUST include appropriate filters.**

## Environment Variables
```env
# Retell AI
RETELL_API_KEY=
ROOFING_RETELL_AGENT_ID=           # Inbound agent
ROOFING_OUTBOUND_AGENT_ID=         # Outbound agent

# Tavus
TAVUS_API_KEY=
TAVUS_ROOFING_PERSONA_ID=
TAVUS_ROOFING_REPLICA_ID=

# Cal.com
CAL_API_KEY=
CAL_API_URL=https://api.cal.com/v1
CAL_EVENT_TYPE_ID=
CAL_WEBHOOK_SECRET=

# GoHighLevel
GHL_API_KEY=
GHL_LOCATION_ID=

# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Monitoring
SENTRY_DSN=
SLACK_WEBHOOK_URL=

# Email
RESEND_API_KEY=
```

## Commands
```bash
# Development
npm run dev                        # Start dev server

# Testing
npm run test                       # Run Jest tests
npx ts-node scripts/roofing/test-full-flow.ts  # E2E test

# Demo
npx ts-node scripts/roofing/demo-reset.ts --confirm  # Clear demo data
npx ts-node scripts/roofing/demo-seed.ts             # Seed demo data
npx ts-node scripts/roofing/demo-call.ts +1407... --name "John" --scenario new_lead

# Deployment
npm run build && npm run deploy    # Deploy to Railway
```

## Webhook Flow
```
Retell call event
    ↓
POST /webhooks/retell → validate signature → add to retellQueue
    ↓
Worker processes → log to Supabase → extract call data
    ↓
n8n receives call_analyzed webhook
    ↓
n8n transforms data → POST /api/roofing/n8n/ghl-sync
    ↓
GHL contact created/updated → SMS confirmation sent
    ↓
If appointment booked → Cal.com booking created → BOOKING_CREATED webhook
    ↓
Lead pipeline updated → Slack notification sent
```

## Current Status
| Product | Status | Notes |
|---------|--------|-------|
| Inbound Voice | ✅ 95% | Full prompt, post-call extraction ready |
| Outbound Voice | ✅ 90% | TCPA service complete, needs dashboard config |
| Video Chat (CVI) | ✅ 85% | Controller ready, needs Tavus persona setup |
| Cal.com Integration | ✅ 90% | Webhooks ready, needs dashboard config |
| n8n Workflows | ✅ 95% | All endpoints created |
| GHL Integration | ✅ 90% | Full sync working |
| Monitoring | ✅ 100% | Sentry + health check + Slack |
| Testing | ✅ 80% | Jest tests + E2E scripts |
| Demo Environment | ✅ 100% | Reset + seed scripts ready |

## Pending Manual Steps
1. **Supabase**: Run migration in SQL Editor
2. **Retell Dashboard**: Configure post-call extraction (18 fields), knowledge base (12 URLs), custom functions
3. **Cal.com Dashboard**: Create event type, configure webhook
4. **Tavus Dashboard**: Create Sarah persona with provided config
5. **n8n**: Import workflow JSON, configure credentials

## Company Info
- **Owner**: Rick Dorman
- **Phone (Orlando)**: (407) 960-6333
- **Phone (Jacksonville)**: (904) 621-7333
- **Phone (Tampa)**: (813) area
- **Hours**: Mon-Fri 8:30 AM - 5:00 PM
- **Services**: Shingle, metal, tile roofing, storm damage, insurance claims
- **Financing**: GoodLeap, Sunlight Financial
- **Products**: CertainTeed (luxury, architectural, 3-tab shingles)

## MCP Servers Available
- `retell-ai` - Manage Retell voice agents
- `tavus-mcp-roofing` - Manage Tavus video personas
- `supabase` - Database operations
- `gohighlevel` - CRM operations
- `n8n-mcp` - Workflow automation
