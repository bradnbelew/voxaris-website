# Voxaris Complete AI Integration Suite
## GHL Conversation AI + Voice AI + Agent Studio + Analytics Dashboard
### Full System Architecture for Automotive Buyback Campaigns

---

# TABLE OF CONTENTS

## Part 1: GHL AI Systems
1. [Conversation AI Configuration](#1-conversation-ai-configuration)
2. [Voice AI Agent Setup](#2-voice-ai-agent-setup)
3. [Agent Studio Workflows](#3-agent-studio-workflows)

## Part 2: Analytics Dashboard
4. [Dashboard Architecture](#4-dashboard-architecture)
5. [React Components](#5-react-components)
6. [API Endpoints for Dashboard](#6-api-endpoints-for-dashboard)
7. [Real-Time Data Pipeline](#7-real-time-data-pipeline)

## Part 3: Integration Flows
8. [Multi-Channel AI Routing](#8-multi-channel-ai-routing)
9. [Unified Analytics Collection](#9-unified-analytics-collection)
10. [Deployment Guide](#10-deployment-guide)

---

# PART 1: GHL AI SYSTEMS

---

# 1. CONVERSATION AI CONFIGURATION

## Overview

GHL Conversation AI handles text-based conversations (SMS, Email, Web Chat, Facebook, Instagram, WhatsApp). This is SEPARATE from Voice AI (phone calls) and complements your Tavus/Retell agents.

## Maria Conversation AI Bot

### Bot Configuration

```json
{
  "bot_name": "Maria - VIP Buyback Assistant",
  "bot_type": "primary",
  "mode": "auto_pilot",
  "supported_channels": ["sms", "web_chat", "facebook", "instagram", "whatsapp"],
  "intent": "appointment_booking",
  "language": "en-US"
}
```

### System Prompt (GHL Conversation AI)

```
## Identity
You are Maria, the VIP Acquisition Specialist at Hill Nissan.
You are warm, friendly, and efficient — your goal is to help customers get their premium buyback offer.

## Tone
- Conversational and warm, but professional
- Use contractions (you're, we'll, it's)
- Keep messages concise — 1-2 sentences max for SMS
- Use occasional emojis for web chat, but never for SMS

## Context
The customer received a VIP Buyback mailer about their vehicle.
They may be reaching out to learn more or schedule an appraisal.
The offer expires this Friday.

## Primary Goal
Book a 15-minute in-person appraisal at Hill Nissan.

## Secondary Goals
1. Confirm they still own the vehicle
2. Determine if they want to upgrade or cash out
3. Handle objections
4. Capture any missing contact information

## Rules
1. NEVER give a price estimate — always redirect to in-person appraisal
2. Keep responses SHORT (under 160 characters for SMS when possible)
3. Ask ONE question at a time
4. Always push for same-day appointments first
5. Accept ANY time the customer proposes
6. If they're not ready, offer to follow up later

## Appointment Details
- Duration: 15 minutes
- Location: Hill Nissan
- What to bring: VIP Buyback mailer
- Ask for: VIP Buyback desk
```

### Bot Training - Custom FAQ Responses

```json
{
  "faqs": [
    {
      "question": "How much is my car worth?",
      "variations": ["what's my car worth", "give me a price", "ballpark estimate", "value of my car"],
      "answer": "Great question! To give you the maximum we're authorized to pay, our manager needs to do a quick 15-min visual appraisal. Online estimates are usually way off. When can you swing by?"
    },
    {
      "question": "I'm not ready to sell",
      "variations": ["just curious", "not in the market", "thinking about it", "not sure yet"],
      "answer": "Totally fine! Most people just want to know what their car is worth. Zero pressure — you'll walk out with a real number. Think of it as a free appraisal. Can you come in this week?"
    },
    {
      "question": "Do I have to buy a new car?",
      "variations": ["just want cash", "don't want new car", "not looking to buy"],
      "answer": "Nope! We buy cars even if you don't buy from us. It's a pure cash offer — we need inventory that badly. Let's get you that top-dollar number. What day works?"
    },
    {
      "question": "I still owe money",
      "variations": ["have a loan", "upside down", "negative equity", "still paying"],
      "answer": "We handle that daily! If you're ahead, you pocket the difference. If you're a little behind, we have equity programs to help. Come in and we'll show you the options. Tomorrow work?"
    },
    {
      "question": "My car has damage",
      "variations": ["needs work", "has issues", "dent", "accident"],
      "answer": "Perfect for us actually! Our service dept handles all reconditioning. Private buyers won't touch it, but we want it. Bring it in — let's see what we can offer."
    },
    {
      "question": "I already have an offer",
      "variations": ["carmax", "carvana", "got a quote", "another offer"],
      "answer": "Bring it! We've been beating those national bids consistently. Your car is worth more locally. Let's see if we can get you more. Can you come in today?"
    },
    {
      "question": "What are your hours?",
      "variations": ["when are you open", "hours of operation", "what time"],
      "answer": "We're open Mon-Sat 9AM-8PM, Sun 11AM-6PM. When would you like to come in for your VIP appraisal?"
    },
    {
      "question": "Where are you located?",
      "variations": ["address", "location", "where is the dealership"],
      "answer": "Hill Nissan is at [ADDRESS]. Just bring your mailer and ask for the VIP Buyback desk when you arrive. What time works for you?"
    },
    {
      "question": "Can you call me?",
      "variations": ["call me back", "phone call", "talk on phone"],
      "answer": "Absolutely! What's the best number and time to reach you? I'll have someone from the VIP team give you a call."
    },
    {
      "question": "I need to talk to my spouse",
      "variations": ["ask my wife", "check with husband", "partner", "spouse"],
      "answer": "Of course! Bring them with you — it's better when you're both there. What day works for both of you?"
    }
  ]
}
```

### Advanced Settings

```json
{
  "wait_time_before_responding": 5,
  "maximum_message_limit": 20,
  "send_bot_to_sleep_on_manual_reply": true,
  "business_name": "Hill Nissan",
  "working_hours": {
    "enabled": true,
    "timezone": "America/New_York",
    "schedule": {
      "monday": { "start": "09:00", "end": "20:00" },
      "tuesday": { "start": "09:00", "end": "20:00" },
      "wednesday": { "start": "09:00", "end": "20:00" },
      "thursday": { "start": "09:00", "end": "20:00" },
      "friday": { "start": "09:00", "end": "20:00" },
      "saturday": { "start": "09:00", "end": "20:00" },
      "sunday": { "start": "11:00", "end": "18:00" }
    }
  }
}
```

### Workflow Integration - Conversation AI Appointment Booking

```yaml
Workflow: VIP Buyback - Conversation AI Appointment Flow
Trigger: Customer Replied (SMS, Web Chat, FB, IG, WhatsApp)

Steps:
  1. Conversation AI Action:
     - Question: "Hey {{contact.first_name}}! I see you got our VIP Buyback mailer. Are you still interested in getting a top-dollar offer on your {{contact.vehicle_year}} {{contact.vehicle_model}}?"
     - Timeout: 24 hours
     - Branches:
       - "interested" → Continue to qualification
       - "not_interested" → Tag "not_interested", end
       - "timeout" → Add to follow-up sequence

  2. Conversation AI Action (Qualification):
     - Question: "Perfect! Do you still have the {{contact.vehicle_model}}?"
     - Branches:
       - "yes" → Continue to booking
       - "no" → Ask about other vehicles
       - "sold" → Update contact, end

  3. Conversation AI Action (Booking):
     - Question: "Great! Our GM authorized premium offers this week. Can you swing by today for a quick 15-min appraisal? We're open until 8pm."
     - Branches:
       - "yes_today" → Book same-day appointment
       - "another_day" → Ask for preferred day
       - "objection" → Handle objection, retry

  4. IF Appointment Booked:
     - Create Calendar Event
     - Update Contact (appointment_booked = Yes)
     - Update Opportunity Stage → "Appointment Booked"
     - Send Confirmation SMS
     - Add to Reminder Workflow

  5. IF Not Booked:
     - Create Follow-Up Task
     - Add Tag "needs_followup"
     - Add to Nurture Sequence
```

---

# 2. VOICE AI AGENT SETUP

## GHL Voice AI vs Retell

| Feature | GHL Voice AI | Retell (External) |
|---------|-------------|-------------------|
| Built into GHL | ✅ Yes | ❌ No (requires integration) |
| Cost | Included in plan | Per-minute billing |
| Customization | Basic/Advanced modes | Full prompt control |
| Post-call data | Native to GHL | Requires webhook sync |
| Best for | Simple inbound | Complex flows, outbound |

**Recommendation:** Use BOTH:
- **GHL Voice AI** for inbound calls to dealership number (native integration)
- **Retell** for outbound follow-up calls and complex scenarios

## GHL Voice AI Agent Configuration

### Basic Settings

```json
{
  "agent_name": "Maria - Hill Nissan Voice Agent",
  "business_name": "Hill Nissan",
  "voice_id": "alloy_female_warm",
  "agent_direction": "inbound",
  "initial_greeting": "Hey there! Thanks for calling Hill Nissan. This is Maria from our VIP Buyback team. How can I help you today?"
}
```

### Advanced Mode Prompt

```
## Identity
You are Maria, the VIP Acquisition Specialist at Hill Nissan.
You answer inbound calls from customers who received VIP Buyback mailers.

## Voice Style
- Warm and friendly, like talking to a helpful friend
- Speak at a natural pace, not rushed
- Use brief pauses after questions
- Acknowledge what they say before responding

## Goals (in order)
1. Greet warmly and identify their reason for calling
2. If about buyback: Confirm they have the vehicle
3. Handle any questions or objections
4. Book a 15-minute in-person appraisal
5. Confirm appointment details
6. Thank them and end professionally

## Data to Collect
- Full name
- Phone number (confirm we have correct one)
- Email (if they want confirmation sent)
- Vehicle year, make, model
- Preferred appointment time
- Whether they want to upgrade or just cash out

## Appointment Booking
- Duration: 15 minutes
- Push for same-day first
- Offer morning (10-11am) or afternoon (2-4pm)
- Accept ANY time they propose
- Remind them to bring the mailer

## Rules
1. NEVER give price estimates over the phone
2. If asked for price: "I'd love to give you a number, but our manager needs to see the vehicle to give you the maximum offer. That's why the 15-minute appraisal is so important."
3. If they have another offer (CarMax, etc.): "Bring it with you! We've been beating those national bids consistently."
4. If they're hesitant: "No pressure at all. You'll walk out knowing exactly what it's worth. Think of it as a free appraisal."
5. Always end with: "Thanks for calling Hill Nissan! We look forward to seeing you [day/time]."

## Transfer Conditions
Transfer to a human if:
- Customer explicitly asks to speak to a person
- Customer is angry or frustrated after 2 attempts to help
- Customer has a complaint unrelated to buyback
- Technical issue prevents booking
```

### Actions Configuration

```json
{
  "actions": [
    {
      "type": "update_contact_fields",
      "fields_to_update": [
        "first_name",
        "last_name",
        "email",
        "phone",
        "vehicle_year",
        "vehicle_make",
        "vehicle_model",
        "customer_intent"
      ]
    },
    {
      "type": "book_appointment",
      "calendar_id": "{{GHL_CALENDAR_ID}}",
      "appointment_duration": 15,
      "appointment_title": "VIP Buyback Appraisal - {{contact.first_name}}"
    },
    {
      "type": "trigger_workflow",
      "workflow_id": "{{APPOINTMENT_BOOKED_WORKFLOW_ID}}",
      "condition": "appointment_booked"
    },
    {
      "type": "trigger_workflow",
      "workflow_id": "{{FOLLOWUP_NEEDED_WORKFLOW_ID}}",
      "condition": "no_appointment"
    },
    {
      "type": "send_sms",
      "condition": "appointment_booked",
      "message": "Thanks for calling, {{contact.first_name}}! Your VIP Buyback appointment is confirmed for {{appointment.date}} at {{appointment.time}}. Bring your mailer and ask for the VIP desk. See you then! - Maria, Hill Nissan"
    },
    {
      "type": "call_transfer",
      "condition": "customer_requests_human",
      "transfer_to": "{{SALES_MANAGER_PHONE}}"
    },
    {
      "type": "email_notification",
      "recipients": ["sales@hillnissan.com"],
      "include_summary": true,
      "include_transcript": true
    }
  ]
}
```

### Phone Number Assignment

```json
{
  "assigned_numbers": [
    {
      "phone_number": "+1XXXXXXXXXX",
      "label": "VIP Buyback Hotline"
    }
  ],
  "working_hours": {
    "enabled": true,
    "timezone": "America/New_York",
    "schedule": {
      "monday": { "start": "09:00", "end": "20:00" },
      "tuesday": { "start": "09:00", "end": "20:00" },
      "wednesday": { "start": "09:00", "end": "20:00" },
      "thursday": { "start": "09:00", "end": "20:00" },
      "friday": { "start": "09:00", "end": "20:00" },
      "saturday": { "start": "09:00", "end": "20:00" },
      "sunday": { "start": "11:00", "end": "18:00" }
    },
    "after_hours_action": "voicemail",
    "voicemail_greeting": "Thanks for calling Hill Nissan! We're currently closed but will call you back first thing. Leave your name, number, and mention you got the VIP Buyback mailer. Talk soon!"
  }
}
```

---

# 3. AGENT STUDIO WORKFLOWS

## Overview

Agent Studio is GHL's visual workflow builder for complex AI agents. It combines:
- **LLM Nodes**: GPT-4o for intelligent responses
- **MCP Tool Nodes**: Connect to GHL data (contacts, calendars, conversations)
- **API Nodes**: Connect to external systems (Tavus, Retell, your backend)
- **Knowledge Base Nodes**: RAG for document-based answers
- **Web Search Nodes**: Real-time information lookup

## Agent 1: VIP Buyback Orchestrator

This agent routes inquiries to the right channel and manages the overall flow.

### Visual Workflow Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VIP BUYBACK ORCHESTRATOR                              │
└─────────────────────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────┐
│  INPUT NODE     │ ← Receives: contact_id, channel, message, intent
│  (Variables)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MCP NODE       │ ← Fetch contact data from GHL
│  (Get Contact)  │    Tool: contacts.get({contactId})
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LLM NODE       │ ← Determine intent from message
│  (Intent        │    Outputs: intent, confidence, response_needed
│   Classification│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ROUTER NODE    │ ← Branch based on intent
│  (Conditional)  │
└────────┬────────┘
         │
    ┌────┴────┬────────────┬────────────┬────────────┐
    │         │            │            │            │
    ▼         ▼            ▼            ▼            ▼
┌───────┐ ┌───────┐  ┌───────────┐ ┌───────────┐ ┌───────────┐
│BOOKING│ │ PRICE │  │ OBJECTION │ │ GENERAL   │ │ ESCALATE  │
│ FLOW  │ │ QUERY │  │ HANDLING  │ │ QUESTION  │ │ TO HUMAN  │
└───┬───┘ └───┬───┘  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
    │         │            │            │            │
    │         │            │            │            │
    ▼         ▼            ▼            ▼            ▼
┌───────┐ ┌───────┐  ┌───────────┐ ┌───────────┐ ┌───────────┐
│ MCP:  │ │ LLM:  │  │ LLM:      │ │ KB NODE:  │ │ MCP:      │
│Calendar│ │Redirect│ │Handle     │ │ Search    │ │Create Task│
│Check  │ │Response│ │Objection  │ │ FAQs      │ │ for Human │
└───┬───┘ └───┬───┘  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
    │         │            │            │            │
    └────┬────┴────────────┴────────────┴────────────┘
         │
         ▼
┌─────────────────┐
│  OUTPUT NODE    │ ← Return: response_text, action_taken, next_step
│  (Response)     │
└─────────────────┘
```

### Agent Configuration (JSON)

```json
{
  "agent_name": "VIP Buyback Orchestrator",
  "description": "Routes buyback inquiries and manages customer interactions across channels",
  "version": "1.0.0",
  "lifecycle_stage": "production",
  
  "input_variables": [
    {
      "name": "contact_id",
      "type": "string",
      "required": true
    },
    {
      "name": "channel",
      "type": "string",
      "enum": ["sms", "web_chat", "phone", "email", "facebook", "instagram"]
    },
    {
      "name": "message",
      "type": "string",
      "required": true
    },
    {
      "name": "conversation_history",
      "type": "array",
      "required": false
    }
  ],
  
  "global_variables": {
    "dealership_name": "Hill Nissan",
    "calendar_id": "{{GHL_CALENDAR_ID}}",
    "offer_expiration": "Friday",
    "appraisal_duration": 15
  },
  
  "nodes": [
    {
      "id": "get_contact",
      "type": "mcp_tool",
      "tool": "contacts.get",
      "parameters": {
        "contactId": "{{input.contact_id}}"
      }
    },
    {
      "id": "classify_intent",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Classify the customer's intent from this message. Context: VIP Buyback campaign for automotive. Customer: {{get_contact.firstName}} with {{get_contact.vehicle_year}} {{get_contact.vehicle_model}}. Message: '{{input.message}}'. Respond with JSON: {intent: 'booking'|'price_query'|'objection'|'general_question'|'escalate', confidence: 0-1, detected_objection: string|null}",
      "output_format": "json"
    },
    {
      "id": "router",
      "type": "conditional",
      "conditions": [
        {
          "expression": "classify_intent.intent == 'booking'",
          "target": "booking_flow"
        },
        {
          "expression": "classify_intent.intent == 'price_query'",
          "target": "price_redirect"
        },
        {
          "expression": "classify_intent.intent == 'objection'",
          "target": "objection_handler"
        },
        {
          "expression": "classify_intent.intent == 'general_question'",
          "target": "knowledge_base"
        },
        {
          "expression": "classify_intent.intent == 'escalate'",
          "target": "human_escalation"
        }
      ]
    },
    {
      "id": "booking_flow",
      "type": "mcp_tool",
      "tool": "calendars.getFreeSlots",
      "parameters": {
        "calendarId": "{{global.calendar_id}}",
        "startDate": "{{today}}",
        "endDate": "{{today + 7 days}}"
      }
    },
    {
      "id": "generate_booking_response",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "You are Maria from Hill Nissan. The customer wants to book an appointment. Available slots: {{booking_flow.slots}}. Generate a warm, concise response offering the best slots. Push for same-day if available. Keep under 160 chars for SMS.",
      "dependencies": ["booking_flow"]
    },
    {
      "id": "price_redirect",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Customer asked about price/value. Generate Maria's response redirecting to in-person appraisal. Be warm, explain online estimates are inaccurate, push for appointment. Keep under 160 chars."
    },
    {
      "id": "objection_handler",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Handle this objection as Maria: '{{classify_intent.detected_objection}}'. Customer: {{get_contact.firstName}}. Vehicle: {{get_contact.vehicle_year}} {{get_contact.vehicle_model}}. Validate their concern, pivot to appointment. Be warm, not pushy. Under 160 chars."
    },
    {
      "id": "knowledge_base",
      "type": "knowledge_base",
      "knowledge_base_id": "{{KB_HILL_NISSAN}}",
      "query": "{{input.message}}",
      "top_k": 3
    },
    {
      "id": "generate_kb_response",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Answer the customer's question using this info: {{knowledge_base.results}}. Be Maria from Hill Nissan. Warm, helpful, concise. If about buyback, try to pivot to appointment.",
      "dependencies": ["knowledge_base"]
    },
    {
      "id": "human_escalation",
      "type": "mcp_tool",
      "tool": "tasks.create",
      "parameters": {
        "contactId": "{{input.contact_id}}",
        "title": "Escalation: Customer needs human assistance",
        "description": "Message: {{input.message}}\nChannel: {{input.channel}}",
        "dueDate": "{{now}}",
        "priority": "high"
      }
    }
  ],
  
  "output": {
    "response_text": "{{selected_response}}",
    "intent_detected": "{{classify_intent.intent}}",
    "action_taken": "{{action_log}}",
    "appointment_booked": "{{booking_result || false}}"
  }
}
```

## Agent 2: Campaign Analytics Agent

This agent provides on-demand analytics via Ask AI or API.

```json
{
  "agent_name": "Campaign Analytics Agent",
  "description": "Provides real-time campaign analytics and insights",
  "version": "1.0.0",
  
  "input_variables": [
    {
      "name": "query",
      "type": "string",
      "description": "Natural language query about campaign performance"
    },
    {
      "name": "campaign_id",
      "type": "string",
      "required": false
    },
    {
      "name": "date_range",
      "type": "object",
      "properties": {
        "start": "date",
        "end": "date"
      }
    }
  ],
  
  "nodes": [
    {
      "id": "parse_query",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Parse this analytics query: '{{input.query}}'. Extract: {metric: string, dimension: string, date_range: string, comparison: boolean}. Metrics: scans, conversations, appointments, shows, deals, revenue. Dimensions: campaign, day, channel, outcome."
    },
    {
      "id": "fetch_contacts",
      "type": "mcp_tool",
      "tool": "contacts.search",
      "parameters": {
        "filters": {
          "campaign_id": "{{input.campaign_id || '*'}}",
          "dateAddedGte": "{{input.date_range.start}}",
          "dateAddedLte": "{{input.date_range.end}}"
        },
        "limit": 1000
      }
    },
    {
      "id": "fetch_opportunities",
      "type": "mcp_tool",
      "tool": "opportunities.search",
      "parameters": {
        "pipelineId": "{{VIP_BUYBACK_PIPELINE_ID}}",
        "dateGte": "{{input.date_range.start}}",
        "dateLte": "{{input.date_range.end}}"
      }
    },
    {
      "id": "calculate_metrics",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Calculate these metrics from the data:\n\nContacts: {{fetch_contacts.contacts}}\nOpportunities: {{fetch_opportunities.opportunities}}\n\nCalculate:\n- Total mailers sent\n- QR scans (qr_scanned = Yes)\n- Conversations started\n- Appointments booked\n- Shows (appointment_showed = Yes)\n- Deals closed (deal_closed = Yes)\n- Total revenue\n- Conversion rates at each stage\n\nReturn as JSON with metrics and rates."
    },
    {
      "id": "generate_insights",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Based on these campaign metrics: {{calculate_metrics.output}}\n\nGenerate 3-5 actionable insights. Focus on: conversion bottlenecks, top-performing segments, recommended optimizations. Be specific with numbers."
    },
    {
      "id": "format_response",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Format this analytics response for the user's original question: '{{input.query}}'\n\nMetrics: {{calculate_metrics.output}}\nInsights: {{generate_insights.output}}\n\nBe conversational but data-driven. Include key numbers."
    }
  ],
  
  "output": {
    "response": "{{format_response.output}}",
    "metrics": "{{calculate_metrics.output}}",
    "insights": "{{generate_insights.output}}"
  }
}
```

## Agent 3: Lead Qualification Agent

```json
{
  "agent_name": "Lead Qualification Agent",
  "description": "Scores and qualifies buyback leads based on conversation data",
  "version": "1.0.0",
  
  "nodes": [
    {
      "id": "get_contact",
      "type": "mcp_tool",
      "tool": "contacts.get",
      "parameters": {
        "contactId": "{{input.contact_id}}"
      }
    },
    {
      "id": "get_conversations",
      "type": "mcp_tool", 
      "tool": "conversations.getByContact",
      "parameters": {
        "contactId": "{{input.contact_id}}"
      }
    },
    {
      "id": "analyze_engagement",
      "type": "llm",
      "model": "gpt-4o",
      "prompt": "Analyze this lead's engagement:\n\nContact Data: {{get_contact.output}}\nConversation History: {{get_conversations.output}}\n\nScore (0-100) based on:\n- QR scan: +10\n- Responded to message: +15\n- Asked questions: +10\n- Mentioned price/value: +5\n- Mentioned timeline: +15\n- Has competing offer: +10\n- Booked appointment: +20\n- Showed up: +15\n\nReturn: {score: number, quality: 'hot'|'warm'|'cool'|'cold', reasoning: string, next_best_action: string}"
    },
    {
      "id": "update_contact",
      "type": "mcp_tool",
      "tool": "contacts.update",
      "parameters": {
        "contactId": "{{input.contact_id}}",
        "customFields": {
          "lead_score": "{{analyze_engagement.score}}",
          "lead_quality": "{{analyze_engagement.quality}}"
        }
      }
    }
  ]
}
```

---

# PART 2: ANALYTICS DASHBOARD

---

# 4. DASHBOARD ARCHITECTURE

## Tech Stack

```
Frontend: React + TypeScript + Tailwind CSS + Recharts
Backend: Your Antigravity Node.js API
Database: PostgreSQL (via Supabase)
Real-time: WebSocket for live updates
Hosting: Vercel (frontend) or embed as iframe
```

## Dashboard Sections

1. **Campaign Overview** - High-level funnel metrics
2. **Live Activity Feed** - Real-time conversation events
3. **Conversion Funnel** - Visual pipeline progression
4. **AI Performance** - Conversation metrics, sentiment, objections
5. **Appointment Calendar** - Upcoming/past appointments
6. **Lead Quality Distribution** - Hot/Warm/Cool/Cold breakdown
7. **Channel Performance** - Compare Tavus vs Retell vs GHL
8. **ROI Calculator** - Cost per lead, deal, revenue

---

# 5. REACT COMPONENTS

## Dashboard App Structure

```
/src
  /components
    /dashboard
      DashboardLayout.tsx
      CampaignOverview.tsx
      LiveActivityFeed.tsx
      ConversionFunnel.tsx
      AIPerformanceMetrics.tsx
      AppointmentCalendar.tsx
      LeadQualityChart.tsx
      ChannelComparison.tsx
      ROICalculator.tsx
    /shared
      MetricCard.tsx
      DataTable.tsx
      StatusBadge.tsx
      LoadingSpinner.tsx
  /hooks
    useRealtimeUpdates.ts
    useCampaignData.ts
    useWebSocket.ts
  /api
    dashboardApi.ts
  /types
    dashboard.types.ts
  App.tsx
  index.tsx
```

## Main Dashboard Component

```tsx
// src/components/dashboard/DashboardLayout.tsx

import React, { useState, useEffect } from 'react';
import { useRealtimeUpdates } from '../../hooks/useRealtimeUpdates';
import { useCampaignData } from '../../hooks/useCampaignData';
import CampaignOverview from './CampaignOverview';
import LiveActivityFeed from './LiveActivityFeed';
import ConversionFunnel from './ConversionFunnel';
import AIPerformanceMetrics from './AIPerformanceMetrics';
import AppointmentCalendar from './AppointmentCalendar';
import LeadQualityChart from './LeadQualityChart';
import ChannelComparison from './ChannelComparison';
import ROICalculator from './ROICalculator';

interface DashboardProps {
  campaignId?: string;
  locationId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
}

const DashboardLayout: React.FC<DashboardProps> = ({ 
  campaignId, 
  locationId, 
  dateRange 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'ai' | 'calendar' | 'roi'>('overview');
  
  // Fetch campaign data
  const { data, isLoading, error, refetch } = useCampaignData({
    campaignId,
    locationId,
    startDate: dateRange.start,
    endDate: dateRange.end
  });
  
  // Real-time updates via WebSocket
  const { events, isConnected } = useRealtimeUpdates(locationId);
  
  // Refetch on new events
  useEffect(() => {
    if (events.length > 0) {
      refetch();
    }
  }, [events]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                VIP Buyback Campaign Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                {campaignId ? `Campaign: ${data?.campaign?.name}` : 'All Campaigns'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-500">
                  {isConnected ? 'Live' : 'Disconnected'}
                </span>
              </div>
              {/* Date Range Picker */}
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
          </div>
          
          {/* Tab Navigation */}
          <nav className="mt-4 flex gap-4">
            {['overview', 'ai', 'calendar', 'roi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Metrics */}
            <CampaignOverview metrics={data?.metrics} />
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Funnel - 2 columns */}
              <div className="lg:col-span-2">
                <ConversionFunnel data={data?.funnel} />
              </div>
              
              {/* Live Feed - 1 column */}
              <div className="lg:col-span-1">
                <LiveActivityFeed events={events} />
              </div>
            </div>
            
            {/* Lead Quality + Channel Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadQualityChart data={data?.leadQuality} />
              <ChannelComparison data={data?.channels} />
            </div>
          </div>
        )}

        {selectedTab === 'ai' && (
          <AIPerformanceMetrics data={data?.aiMetrics} />
        )}

        {selectedTab === 'calendar' && (
          <AppointmentCalendar 
            appointments={data?.appointments}
            locationId={locationId}
          />
        )}

        {selectedTab === 'roi' && (
          <ROICalculator data={data?.roi} />
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;
```

## Campaign Overview Component

```tsx
// src/components/dashboard/CampaignOverview.tsx

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Phone,
  Video
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {changeLabel && (
          <p className="text-xs text-gray-400 mt-1">{changeLabel}</p>
        )}
      </div>
    </div>
  );
};

interface CampaignOverviewProps {
  metrics: {
    totalMailers: number;
    qrScans: number;
    scanRate: number;
    conversations: number;
    conversationRate: number;
    appointments: number;
    bookingRate: number;
    shows: number;
    showRate: number;
    deals: number;
    closeRate: number;
    totalRevenue: number;
    avgDealValue: number;
    previousPeriod?: {
      scanRate: number;
      bookingRate: number;
      closeRate: number;
      revenue: number;
    };
  };
}

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ metrics }) => {
  const calculateChange = (current: number, previous?: number) => {
    if (!previous) return undefined;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <MetricCard
        title="QR Scans"
        value={metrics.qrScans.toLocaleString()}
        change={calculateChange(metrics.scanRate, metrics.previousPeriod?.scanRate)}
        changeLabel={`${metrics.scanRate}% scan rate`}
        icon={<Users size={24} />}
        color="blue"
      />
      
      <MetricCard
        title="AI Conversations"
        value={metrics.conversations.toLocaleString()}
        changeLabel={`${metrics.conversationRate}% engaged`}
        icon={<MessageSquare size={24} />}
        color="purple"
      />
      
      <MetricCard
        title="Appointments"
        value={metrics.appointments.toLocaleString()}
        change={calculateChange(metrics.bookingRate, metrics.previousPeriod?.bookingRate)}
        changeLabel={`${metrics.bookingRate}% booking rate`}
        icon={<Calendar size={24} />}
        color="green"
      />
      
      <MetricCard
        title="Shows"
        value={metrics.shows.toLocaleString()}
        changeLabel={`${metrics.showRate}% show rate`}
        icon={<Users size={24} />}
        color="orange"
      />
      
      <MetricCard
        title="Deals Closed"
        value={metrics.deals.toLocaleString()}
        change={calculateChange(metrics.closeRate, metrics.previousPeriod?.closeRate)}
        changeLabel={`${metrics.closeRate}% close rate`}
        icon={<DollarSign size={24} />}
        color="green"
      />
      
      <MetricCard
        title="Total Revenue"
        value={`$${(metrics.totalRevenue / 1000).toFixed(0)}k`}
        change={calculateChange(metrics.totalRevenue, metrics.previousPeriod?.revenue)}
        changeLabel={`Avg: $${metrics.avgDealValue.toLocaleString()}`}
        icon={<DollarSign size={24} />}
        color="green"
      />
    </div>
  );
};

export default CampaignOverview;
```

## Conversion Funnel Component

```tsx
// src/components/dashboard/ConversionFunnel.tsx

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

interface FunnelData {
  stage: string;
  count: number;
  conversionRate: number;
  dropOff: number;
}

interface ConversionFunnelProps {
  data: FunnelData[];
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data }) => {
  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#22C55E'];
  
  const funnelData = [
    { name: 'Mailers Sent', value: data[0]?.count || 0, fill: COLORS[0] },
    { name: 'QR Scanned', value: data[1]?.count || 0, fill: COLORS[1] },
    { name: 'AI Conversation', value: data[2]?.count || 0, fill: COLORS[2] },
    { name: 'Appointment Booked', value: data[3]?.count || 0, fill: COLORS[3] },
    { name: 'Showed Up', value: data[4]?.count || 0, fill: COLORS[4] },
    { name: 'Deal Closed', value: data[5]?.count || 0, fill: COLORS[5] },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip 
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} contacts`,
                name
              ]}
            />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
            >
              <LabelList 
                position="right" 
                fill="#374151" 
                stroke="none" 
                dataKey="name" 
              />
              <LabelList
                position="center"
                fill="#fff"
                stroke="none"
                dataKey="value"
                formatter={(value: number) => value.toLocaleString()}
              />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
      
      {/* Conversion Rates */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {data.slice(1).map((stage, index) => (
          <div key={stage.stage} className="text-center">
            <div className="text-xs text-gray-500">
              {data[index]?.stage} → {stage.stage}
            </div>
            <div className={`text-lg font-semibold ${
              stage.conversionRate >= 50 ? 'text-green-600' :
              stage.conversionRate >= 25 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {stage.conversionRate}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversionFunnel;
```

## Live Activity Feed Component

```tsx
// src/components/dashboard/LiveActivityFeed.tsx

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Calendar, 
  CheckCircle, 
  XCircle,
  User
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'qr_scan' | 'conversation_started' | 'conversation_ended' | 
        'appointment_booked' | 'appointment_showed' | 'appointment_no_show' |
        'deal_closed' | 'deal_lost';
  channel: 'tavus' | 'retell' | 'ghl_voice' | 'ghl_chat' | 'manual';
  contactName: string;
  contactId: string;
  vehicle?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface LiveActivityFeedProps {
  events: Activity[];
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ events }) => {
  const getActivityIcon = (type: Activity['type'], channel: Activity['channel']) => {
    const iconClass = "w-4 h-4";
    
    switch (type) {
      case 'qr_scan':
        return <User className={`${iconClass} text-blue-500`} />;
      case 'conversation_started':
      case 'conversation_ended':
        if (channel === 'tavus') return <Video className={`${iconClass} text-purple-500`} />;
        if (channel === 'retell' || channel === 'ghl_voice') return <Phone className={`${iconClass} text-green-500`} />;
        return <MessageSquare className={`${iconClass} text-blue-500`} />;
      case 'appointment_booked':
        return <Calendar className={`${iconClass} text-green-500`} />;
      case 'appointment_showed':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'appointment_no_show':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'deal_closed':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'deal_lost':
        return <XCircle className={`${iconClass} text-gray-500`} />;
      default:
        return <MessageSquare className={`${iconClass} text-gray-500`} />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'qr_scan':
        return `scanned QR code`;
      case 'conversation_started':
        return `started ${activity.channel === 'tavus' ? 'video' : 'voice'} call`;
      case 'conversation_ended':
        return `completed ${activity.channel === 'tavus' ? 'video' : 'voice'} call`;
      case 'appointment_booked':
        return `booked appointment for ${activity.metadata?.appointmentTime}`;
      case 'appointment_showed':
        return `showed up for appointment`;
      case 'appointment_no_show':
        return `missed appointment`;
      case 'deal_closed':
        return `closed deal - $${activity.metadata?.dealValue?.toLocaleString()}`;
      case 'deal_lost':
        return `deal lost`;
      default:
        return activity.type;
    }
  };

  const getChannelBadge = (channel: Activity['channel']) => {
    const badges: Record<string, { label: string; color: string }> = {
      tavus: { label: 'Video', color: 'bg-purple-100 text-purple-700' },
      retell: { label: 'Retell', color: 'bg-green-100 text-green-700' },
      ghl_voice: { label: 'GHL Voice', color: 'bg-blue-100 text-blue-700' },
      ghl_chat: { label: 'Chat', color: 'bg-gray-100 text-gray-700' },
      manual: { label: 'Manual', color: 'bg-gray-100 text-gray-700' }
    };
    
    const badge = badges[channel] || badges.manual;
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Activity</h3>
        <span className="flex items-center gap-2 text-sm text-green-600">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No activity yet. Waiting for events...
          </div>
        ) : (
          <div className="divide-y">
            {events.map((activity) => (
              <div 
                key={activity.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type, activity.channel)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {activity.contactName}
                      </span>
                      {getChannelBadge(activity.channel)}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {getActivityText(activity)}
                    </p>
                    {activity.vehicle && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {activity.vehicle}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveActivityFeed;
```

## AI Performance Metrics Component

```tsx
// src/components/dashboard/AIPerformanceMetrics.tsx

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface AIMetrics {
  totalConversations: number;
  avgDuration: number;
  avgSentiment: number;
  bookingRate: number;
  topObjections: Array<{ objection: string; count: number; percentage: number }>;
  intentDistribution: Array<{ intent: string; count: number }>;
  channelPerformance: Array<{
    channel: string;
    conversations: number;
    bookingRate: number;
    avgSentiment: number;
  }>;
  dailyTrend: Array<{
    date: string;
    conversations: number;
    bookings: number;
    sentiment: number;
  }>;
}

interface AIPerformanceMetricsProps {
  data: AIMetrics;
}

const AIPerformanceMetrics: React.FC<AIPerformanceMetricsProps> = ({ data }) => {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  
  const sentimentColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Total AI Conversations</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {data.totalConversations.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Avg. Duration</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Math.floor(data.avgDuration / 60)}:{(data.avgDuration % 60).toString().padStart(2, '0')}
          </p>
          <p className="text-xs text-gray-400">minutes</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">Avg. Sentiment</p>
          <p className={`text-3xl font-bold mt-2 ${sentimentColor(data.avgSentiment)}`}>
            {data.avgSentiment}%
          </p>
          <p className="text-xs text-gray-400">positive</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <p className="text-sm text-gray-500">AI Booking Rate</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {data.bookingRate}%
          </p>
          <p className="text-xs text-gray-400">conversations → appointments</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversation Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Conversations"
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Intent Distribution */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Intent
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.intentDistribution}
                  dataKey="count"
                  nameKey="intent"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ intent, percent }) => 
                    `${intent}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.intentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Objections & Channel Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Objections */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Objections
          </h3>
          <div className="space-y-4">
            {data.topObjections.map((obj, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{obj.objection}</span>
                  <span className="text-gray-500">{obj.count} ({obj.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${obj.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Performance */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Channel Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.channelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar 
                  dataKey="bookingRate" 
                  fill="#3B82F6" 
                  name="Booking Rate (%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Channel Legend */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {data.channelPerformance.map((channel) => (
              <div key={channel.channel}>
                <p className="text-xs text-gray-500">{channel.channel}</p>
                <p className="text-sm font-semibold">{channel.conversations} calls</p>
                <p className="text-xs text-green-600">{channel.bookingRate}% booking</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPerformanceMetrics;
```

## ROI Calculator Component

```tsx
// src/components/dashboard/ROICalculator.tsx

import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';

interface ROIData {
  campaignCosts: {
    mailerCost: number;
    aiMinutesCost: number;
    platformCost: number;
    totalCost: number;
  };
  results: {
    totalLeads: number;
    appointments: number;
    shows: number;
    deals: number;
    revenue: number;
  };
}

interface ROICalculatorProps {
  data: ROIData;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ data }) => {
  const [customMailerCost, setCustomMailerCost] = useState(data.campaignCosts.mailerCost);
  const [customAiCost, setCustomAiCost] = useState(data.campaignCosts.aiMinutesCost);
  
  const metrics = useMemo(() => {
    const totalCost = customMailerCost + customAiCost + data.campaignCosts.platformCost;
    const { totalLeads, appointments, shows, deals, revenue } = data.results;
    
    return {
      totalCost,
      costPerLead: totalLeads > 0 ? totalCost / totalLeads : 0,
      costPerAppointment: appointments > 0 ? totalCost / appointments : 0,
      costPerShow: shows > 0 ? totalCost / shows : 0,
      costPerDeal: deals > 0 ? totalCost / deals : 0,
      grossProfit: revenue - totalCost,
      roi: totalCost > 0 ? ((revenue - totalCost) / totalCost) * 100 : 0,
      revenuePerLead: totalLeads > 0 ? revenue / totalLeads : 0,
      revenuePerDeal: deals > 0 ? revenue / deals : 0
    };
  }, [customMailerCost, customAiCost, data]);

  return (
    <div className="space-y-6">
      {/* Cost Inputs */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Campaign Costs
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mailer & Printing Costs
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={customMailerCost}
                onChange={(e) => setCustomMailerCost(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Minutes Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={customAiCost}
                onChange={(e) => setCustomAiCost(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Cost (Fixed)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                value={data.campaignCosts.platformCost}
                disabled
                className="w-full pl-8 pr-4 py-2 border rounded-lg bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total Campaign Cost</span>
            <span className="text-2xl font-bold text-gray-900">
              ${metrics.totalCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Campaign Results
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500">Leads</p>
            <p className="text-2xl font-bold text-blue-600">{data.results.totalLeads}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-500">Appointments</p>
            <p className="text-2xl font-bold text-purple-600">{data.results.appointments}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-500">Shows</p>
            <p className="text-2xl font-bold text-orange-600">{data.results.shows}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500">Deals</p>
            <p className="text-2xl font-bold text-green-600">{data.results.deals}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ${(data.results.revenue / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>

      {/* ROI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Per Metrics */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Analysis
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Cost per Lead</span>
              <span className="font-semibold">${metrics.costPerLead.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Cost per Appointment</span>
              <span className="font-semibold">${metrics.costPerAppointment.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Cost per Show</span>
              <span className="font-semibold">${metrics.costPerShow.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Cost per Deal</span>
              <span className="font-semibold text-lg">${metrics.costPerDeal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ROI Summary */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            Return on Investment
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-green-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">
                ${data.results.revenue.toLocaleString()}
              </p>
            </div>
            
            <div>
              <p className="text-green-100 text-sm">Gross Profit</p>
              <p className="text-3xl font-bold">
                ${metrics.grossProfit.toLocaleString()}
              </p>
            </div>
            
            <div className="pt-4 border-t border-green-400">
              <p className="text-green-100 text-sm">Campaign ROI</p>
              <p className="text-5xl font-bold">
                {metrics.roi.toFixed(0)}%
              </p>
            </div>
            
            <div className="text-sm text-green-100">
              For every $1 spent, you generated ${(metrics.roi / 100 + 1).toFixed(2)} in revenue
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
```

---

# 6. API ENDPOINTS FOR DASHBOARD

```typescript
// src/api/dashboardApi.ts

import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.voxaris.io/v1';

// Types
export interface DashboardFilters {
  locationId: string;
  campaignId?: string;
  startDate: string;
  endDate: string;
}

export interface DashboardData {
  metrics: CampaignMetrics;
  funnel: FunnelData[];
  leadQuality: LeadQualityData;
  channels: ChannelData[];
  aiMetrics: AIMetrics;
  appointments: Appointment[];
  roi: ROIData;
}

// API Functions
export const dashboardApi = {
  // Get full dashboard data
  getDashboard: async (filters: DashboardFilters): Promise<DashboardData> => {
    const { data } = await axios.get(`${API_BASE}/dashboard`, { params: filters });
    return data;
  },

  // Get campaign metrics
  getMetrics: async (filters: DashboardFilters): Promise<CampaignMetrics> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/metrics`, { params: filters });
    return data;
  },

  // Get funnel data
  getFunnel: async (filters: DashboardFilters): Promise<FunnelData[]> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/funnel`, { params: filters });
    return data;
  },

  // Get AI performance metrics
  getAIMetrics: async (filters: DashboardFilters): Promise<AIMetrics> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/ai-metrics`, { params: filters });
    return data;
  },

  // Get appointments
  getAppointments: async (filters: DashboardFilters): Promise<Appointment[]> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/appointments`, { params: filters });
    return data;
  },

  // Get ROI data
  getROI: async (filters: DashboardFilters): Promise<ROIData> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/roi`, { params: filters });
    return data;
  },

  // Get live activity events
  getRecentActivity: async (locationId: string, limit = 50): Promise<Activity[]> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/activity`, {
      params: { locationId, limit }
    });
    return data;
  },

  // Export report
  exportReport: async (filters: DashboardFilters, format: 'pdf' | 'csv'): Promise<Blob> => {
    const { data } = await axios.get(`${API_BASE}/dashboard/export`, {
      params: { ...filters, format },
      responseType: 'blob'
    });
    return data;
  }
};
```

---

# 7. REAL-TIME DATA PIPELINE

## WebSocket Hook

```typescript
// src/hooks/useRealtimeUpdates.ts

import { useEffect, useState, useCallback, useRef } from 'react';

interface RealtimeEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
}

export function useRealtimeUpdates(locationId: string) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    const wsUrl = `${process.env.REACT_APP_WS_URL}/ws?locationId=${locationId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        setEvents(prev => {
          const newEvents = [
            {
              id: data.id || crypto.randomUUID(),
              type: data.type,
              data: data.data,
              timestamp: new Date(data.timestamp || Date.now())
            },
            ...prev
          ].slice(0, 100); // Keep last 100 events
          
          return newEvents;
        });
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      
      // Reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [locationId]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, isConnected, clearEvents };
}
```

## Backend WebSocket Server

```typescript
// backend/src/websocket/wsServer.ts

import { WebSocketServer, WebSocket } from 'ws';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
const wss = new WebSocketServer({ port: 8080 });

// Track connections by locationId
const connections = new Map<string, Set<WebSocket>>();

wss.on('connection', (ws, req) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  const locationId = url.searchParams.get('locationId');
  
  if (!locationId) {
    ws.close(1008, 'locationId required');
    return;
  }

  // Add to connections
  if (!connections.has(locationId)) {
    connections.set(locationId, new Set());
  }
  connections.get(locationId)!.add(ws);

  console.log(`Client connected for location: ${locationId}`);

  ws.on('close', () => {
    connections.get(locationId)?.delete(ws);
    console.log(`Client disconnected from location: ${locationId}`);
  });
});

// Subscribe to Redis pub/sub for events
const subscriber = redis.duplicate();
subscriber.subscribe('dashboard_events');

subscriber.on('message', (channel, message) => {
  try {
    const event = JSON.parse(message);
    const { locationId, ...eventData } = event;
    
    // Broadcast to all connected clients for this location
    const clients = connections.get(locationId);
    if (clients) {
      const payload = JSON.stringify(eventData);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    }
  } catch (err) {
    console.error('Failed to broadcast event:', err);
  }
});

// Function to publish events (called from webhook handlers)
export async function publishDashboardEvent(
  locationId: string,
  eventType: string,
  data: any
) {
  const event = {
    locationId,
    id: crypto.randomUUID(),
    type: eventType,
    data,
    timestamp: new Date().toISOString()
  };
  
  await redis.publish('dashboard_events', JSON.stringify(event));
}
```

---

# 8. MULTI-CHANNEL AI ROUTING

## Unified Routing Logic

```typescript
// backend/src/routing/aiRouter.ts

interface IncomingInteraction {
  channel: 'qr_scan' | 'sms' | 'web_chat' | 'phone_inbound' | 'phone_outbound' | 
           'email' | 'facebook' | 'instagram' | 'whatsapp';
  contactId: string;
  message?: string;
  metadata?: Record<string, any>;
}

interface RoutingDecision {
  handler: 'tavus' | 'retell' | 'ghl_voice' | 'ghl_conversation_ai' | 'human' | 'workflow';
  reason: string;
  priority: number;
}

export function routeInteraction(interaction: IncomingInteraction): RoutingDecision {
  const { channel, metadata } = interaction;

  // QR Scan → Tavus CVI (video face-to-face)
  if (channel === 'qr_scan') {
    return {
      handler: 'tavus',
      reason: 'QR scan initiates video conversation for maximum engagement',
      priority: 1
    };
  }

  // Inbound phone call → GHL Voice AI (native integration)
  if (channel === 'phone_inbound') {
    return {
      handler: 'ghl_voice',
      reason: 'Inbound calls handled by GHL Voice AI for native CRM integration',
      priority: 1
    };
  }

  // Outbound phone call → Retell (better outbound support)
  if (channel === 'phone_outbound') {
    return {
      handler: 'retell',
      reason: 'Outbound calls use Retell for advanced multi-prompt flows',
      priority: 1
    };
  }

  // Text-based channels → GHL Conversation AI
  if (['sms', 'web_chat', 'facebook', 'instagram', 'whatsapp', 'email'].includes(channel)) {
    return {
      handler: 'ghl_conversation_ai',
      reason: 'Text conversations handled by GHL Conversation AI for native CRM updates',
      priority: 1
    };
  }

  // Fallback
  return {
    handler: 'workflow',
    reason: 'Unknown channel, routing to workflow for manual handling',
    priority: 3
  };
}
```

---

# 9. UNIFIED ANALYTICS COLLECTION

## Event Collection from All Sources

```typescript
// backend/src/analytics/eventCollector.ts

import { publishDashboardEvent } from '../websocket/wsServer';
import { db } from '../db';

interface AnalyticsEvent {
  source: 'tavus' | 'retell' | 'ghl_voice' | 'ghl_conversation_ai' | 'ghl_crm';
  eventType: string;
  locationId: string;
  contactId: string;
  campaignId?: string;
  data: Record<string, any>;
  timestamp: Date;
}

export async function collectAnalyticsEvent(event: AnalyticsEvent) {
  // 1. Store in database
  await db.analyticsEvents.insert({
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date()
  });

  // 2. Update aggregated metrics
  await updateAggregatedMetrics(event);

  // 3. Publish to real-time dashboard
  await publishDashboardEvent(event.locationId, event.eventType, {
    source: event.source,
    contactId: event.contactId,
    ...event.data
  });

  // 4. Check for alerts/triggers
  await checkAlertTriggers(event);
}

async function updateAggregatedMetrics(event: AnalyticsEvent) {
  const today = new Date().toISOString().split('T')[0];
  
  // Increment daily counters
  const counterKey = `${event.locationId}:${event.campaignId || 'all'}:${today}`;
  
  switch (event.eventType) {
    case 'qr_scan':
      await db.metrics.increment(counterKey, 'scans');
      break;
    case 'conversation_started':
      await db.metrics.increment(counterKey, 'conversations');
      await db.metrics.increment(counterKey, `conversations_${event.source}`);
      break;
    case 'conversation_ended':
      // Update duration averages
      if (event.data.duration) {
        await db.metrics.updateAverage(counterKey, 'avg_duration', event.data.duration);
      }
      if (event.data.sentiment) {
        await db.metrics.updateAverage(counterKey, 'avg_sentiment', event.data.sentiment);
      }
      break;
    case 'appointment_booked':
      await db.metrics.increment(counterKey, 'appointments');
      break;
    case 'appointment_showed':
      await db.metrics.increment(counterKey, 'shows');
      break;
    case 'deal_closed':
      await db.metrics.increment(counterKey, 'deals');
      await db.metrics.add(counterKey, 'revenue', event.data.dealValue || 0);
      break;
  }
}

async function checkAlertTriggers(event: AnalyticsEvent) {
  // Example: Alert on high-value lead
  if (event.eventType === 'conversation_ended' && 
      event.data.leadQuality === 'Hot - Ready to Buy') {
    await sendAlert({
      type: 'hot_lead',
      locationId: event.locationId,
      message: `Hot lead detected: ${event.data.contactName}`,
      data: event.data
    });
  }

  // Example: Alert on no-show
  if (event.eventType === 'appointment_no_show') {
    await sendAlert({
      type: 'no_show',
      locationId: event.locationId,
      message: `Customer no-show: ${event.data.contactName}`,
      data: event.data
    });
  }
}
```

---

# 10. DEPLOYMENT GUIDE

## Frontend (Dashboard)

```bash
# Build React app
npm run build

# Deploy to Vercel
vercel deploy --prod

# Or deploy to Netlify
netlify deploy --prod --dir=build
```

## Iframe Integration

```html
<!-- Embed in GHL Custom Menu or external site -->
<iframe 
  src="https://dashboard.voxaris.io?locationId={{location.id}}&token={{auth_token}}"
  width="100%"
  height="100%"
  frameborder="0"
  allow="clipboard-write"
></iframe>
```

## Environment Variables

```bash
# Frontend (.env)
REACT_APP_API_URL=https://api.voxaris.io/v1
REACT_APP_WS_URL=wss://api.voxaris.io

# Backend (.env)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GHL_PRIVATE_TOKEN=pit_xxx
GHL_LOCATION_ID=loc_xxx
TAVUS_API_KEY=tvs_xxx
RETELL_API_KEY=ret_xxx
```

---

# COMPLETE DELIVERABLE SUMMARY

## What You Now Have:

### GHL AI Systems
1. **Conversation AI Bot** - Full configuration for text channels (SMS, chat, social)
2. **Voice AI Agent** - Inbound call handling with appointment booking
3. **Agent Studio Workflows** - 3 agents (Orchestrator, Analytics, Lead Qualification)

### Analytics Dashboard
4. **React Dashboard** - Complete component library with Tailwind + Recharts
5. **Real-time Updates** - WebSocket integration for live activity feed
6. **ROI Calculator** - Interactive cost/revenue analysis

### Integration Layer
7. **Multi-Channel Routing** - Unified logic for Tavus, Retell, GHL
8. **Event Collection** - Aggregated analytics from all sources
9. **WebSocket Server** - Real-time broadcasting

---

This document + the previous integration architecture gives you everything needed to build a complete, production-ready Voxaris platform.

**Total System:**
- Tavus CVI (video)
- Retell (voice)
- GHL Conversation AI (text)
- GHL Voice AI (inbound calls)
- GHL Agent Studio (complex workflows)
- Custom Analytics Dashboard (iframe-ready)
- Full backend integration

Execute this and you'll have a top 1% AI automation system. 🚀
