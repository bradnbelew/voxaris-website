# Voxaris Integration Architecture
## GHL ↔ Antigravity Backend ↔ Tavus CVI ↔ Retell Voice
### Complete System Design for Automotive Buyback Campaigns

---

# TABLE OF CONTENTS

1. [System Overview](#1-system-overview)
2. [GHL API Capabilities](#2-ghl-api-capabilities)
3. [Data Models & Custom Fields](#3-data-models--custom-fields)
4. [Pipeline Configuration](#4-pipeline-configuration)
5. [Webhook Events to Listen For](#5-webhook-events-to-listen-for)
6. [Complete Workflow Catalog](#6-complete-workflow-catalog)
7. [Antigravity Backend API Endpoints](#7-antigravity-backend-api-endpoints)
8. [Tavus Integration Workflows](#8-tavus-integration-workflows)
9. [Retell Integration Workflows](#9-retell-integration-workflows)
10. [Post-Call Data Sync](#10-post-call-data-sync)
11. [Appointment Booking Flow](#11-appointment-booking-flow)
12. [Follow-Up Automation](#12-follow-up-automation)
13. [Analytics & Reporting](#13-analytics--reporting)
14. [Error Handling & Retry Logic](#14-error-handling--retry-logic)
15. [Lovable Landing Page Requirements](#15-lovable-landing-page-requirements)
16. [Security & Authentication](#16-security--authentication)
17. [Deployment Checklist](#17-deployment-checklist)

---

# 1. SYSTEM OVERVIEW

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CUSTOMER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHYSICAL MAILER (BMI)                              │
│                    Contains personalized QR code (PURL)                      │
│              Variables: first_name, vehicle_year, make, model                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ Customer scans QR
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LOVABLE LANDING PAGE (PURL)                           │
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   Pre-filled     │    │   "Talk to       │    │   "Get a Call    │       │
│  │   Form Data      │    │   Maria Now"     │    │   Back"          │       │
│  │   from URL       │    │   (Tavus CVI)    │    │   (Retell Voice) │       │
│  └──────────────────┘    └────────┬─────────┘    └────────┬─────────┘       │
└───────────────────────────────────┼──────────────────────┼──────────────────┘
                                    │                      │
                    ┌───────────────┴───────────────┐      │
                    ▼                               ▼      ▼
┌─────────────────────────────┐    ┌─────────────────────────────────────────┐
│       TAVUS CVI             │    │              RETELL VOICE                │
│   (Video Conversation)      │    │           (Phone Conversation)           │
│                             │    │                                          │
│  • Maria video agent        │    │  • Maria voice agent                     │
│  • Perception (Raven-0)     │    │  • Multi-prompt states                   │
│  • Real-time sentiment      │    │  • Post-call analysis                    │
│  • Sub-second response      │    │  • ~800ms latency                        │
└──────────────┬──────────────┘    └──────────────┬──────────────────────────┘
               │                                   │
               │ Webhook: conversation_ended       │ Webhook: call_ended
               │                                   │
               └───────────────┬───────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ANTIGRAVITY BACKEND                                   │
│                     (Google Antigravity / Node.js)                           │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Webhook        │  │  Data           │  │  GHL API        │              │
│  │  Handlers       │  │  Processing     │  │  Client         │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Tavus API      │  │  Retell API     │  │  Analytics      │              │
│  │  Client         │  │  Client         │  │  Engine         │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOHIGHLEVEL (GHL)                                    │
│                        (CRM & Automation Hub)                                │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Contacts       │  │  Opportunities  │  │  Calendars      │              │
│  │  • Custom fields│  │  • Pipeline     │  │  • Appointments │              │
│  │  • Tags         │  │  • Stages       │  │  • Reminders    │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  Conversations  │  │  Workflows      │  │  Tasks          │              │
│  │  • SMS/Email    │  │  • Automation   │  │  • Follow-ups   │              │
│  │  • Call logs    │  │  • Triggers     │  │  • Assignments  │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEALERSHIP TEAM                                    │
│                                                                              │
│  • Receives hot leads with full context                                      │
│  • Appointment already booked                                                │
│  • Customer intent known (upgrade vs cash out)                               │
│  • Objections pre-handled                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 2. GHL API CAPABILITIES

## Available API Endpoints (Private Integration)

### Contacts API
```
POST   /contacts/                    Create contact
GET    /contacts/{contactId}         Get contact
PUT    /contacts/{contactId}         Update contact
DELETE /contacts/{contactId}         Delete contact
GET    /contacts/                    Search contacts
POST   /contacts/{contactId}/tags    Add tags
DELETE /contacts/{contactId}/tags    Remove tags
```

### Opportunities API
```
POST   /opportunities/               Create opportunity
GET    /opportunities/{id}           Get opportunity
PUT    /opportunities/{id}           Update opportunity
DELETE /opportunities/{id}           Delete opportunity
GET    /opportunities/search         Search opportunities
PUT    /opportunities/{id}/status    Update status
```

### Pipelines API
```
GET    /opportunities/pipelines      Get all pipelines
GET    /opportunities/pipelines/{id} Get pipeline stages
```

### Calendar API
```
GET    /calendars/                   Get calendars
GET    /calendars/{calendarId}/free-slots  Get availability
POST   /calendars/events/appointments      Create appointment
GET    /calendars/events/appointments/{id} Get appointment
PUT    /calendars/events/appointments/{id} Update appointment
DELETE /calendars/events/appointments/{id} Delete appointment
```

### Conversations API
```
GET    /conversations/               Get conversations
POST   /conversations/messages       Send message (SMS/Email)
GET    /conversations/messages/{id}  Get message
POST   /conversations/messages/inbound  Log inbound message
POST   /conversations/messages/outbound Log outbound message
```

### Tasks API
```
POST   /contacts/{contactId}/tasks   Create task
GET    /contacts/{contactId}/tasks   Get tasks
PUT    /contacts/{contactId}/tasks/{taskId}  Update task
DELETE /contacts/{contactId}/tasks/{taskId}  Delete task
```

### Notes API
```
POST   /contacts/{contactId}/notes   Create note
GET    /contacts/{contactId}/notes   Get notes
PUT    /contacts/{contactId}/notes/{noteId}  Update note
DELETE /contacts/{contactId}/notes/{noteId}  Delete note
```

### Workflows API
```
POST   /contacts/{contactId}/workflow/{workflowId}  Add to workflow
DELETE /contacts/{contactId}/workflow/{workflowId}  Remove from workflow
```

---

# 3. DATA MODELS & CUSTOM FIELDS

## GHL Contact Custom Fields

Create these custom fields in GHL for the buyback campaign:

### Vehicle Information
```json
{
  "fields": [
    {
      "name": "vehicle_year",
      "type": "TEXT",
      "label": "Vehicle Year"
    },
    {
      "name": "vehicle_make", 
      "type": "TEXT",
      "label": "Vehicle Make"
    },
    {
      "name": "vehicle_model",
      "type": "TEXT",
      "label": "Vehicle Model"
    },
    {
      "name": "vehicle_vin",
      "type": "TEXT",
      "label": "VIN"
    },
    {
      "name": "vehicle_mileage",
      "type": "NUMBER",
      "label": "Estimated Mileage"
    },
    {
      "name": "vehicle_condition",
      "type": "DROPDOWN",
      "label": "Vehicle Condition",
      "options": ["Excellent", "Good", "Fair", "Poor"]
    },
    {
      "name": "has_loan",
      "type": "DROPDOWN",
      "label": "Has Loan",
      "options": ["Yes", "No", "Unknown"]
    }
  ]
}
```

### Campaign Tracking
```json
{
  "fields": [
    {
      "name": "campaign_id",
      "type": "TEXT",
      "label": "Campaign ID"
    },
    {
      "name": "campaign_name",
      "type": "TEXT",
      "label": "Campaign Name"
    },
    {
      "name": "mailer_sent_date",
      "type": "DATE",
      "label": "Mailer Sent Date"
    },
    {
      "name": "qr_scanned",
      "type": "DROPDOWN",
      "label": "QR Scanned",
      "options": ["Yes", "No"]
    },
    {
      "name": "qr_scan_date",
      "type": "DATE",
      "label": "QR Scan Date"
    },
    {
      "name": "source",
      "type": "TEXT",
      "label": "Lead Source"
    }
  ]
}
```

### AI Conversation Data
```json
{
  "fields": [
    {
      "name": "ai_conversation_type",
      "type": "DROPDOWN",
      "label": "AI Conversation Type",
      "options": ["Video (Tavus)", "Voice (Retell)", "None"]
    },
    {
      "name": "ai_conversation_id",
      "type": "TEXT",
      "label": "AI Conversation ID"
    },
    {
      "name": "ai_conversation_date",
      "type": "DATE",
      "label": "AI Conversation Date"
    },
    {
      "name": "ai_conversation_duration",
      "type": "NUMBER",
      "label": "Conversation Duration (seconds)"
    },
    {
      "name": "ai_conversation_outcome",
      "type": "DROPDOWN",
      "label": "Conversation Outcome",
      "options": ["Appointment Booked", "Soft No - Follow Up", "Hard No", "Call Back Requested", "Voicemail", "No Answer", "Wrong Number"]
    },
    {
      "name": "ai_conversation_summary",
      "type": "LARGE_TEXT",
      "label": "AI Conversation Summary"
    },
    {
      "name": "ai_transcript_url",
      "type": "TEXT",
      "label": "Transcript URL"
    },
    {
      "name": "ai_recording_url",
      "type": "TEXT",
      "label": "Recording URL"
    }
  ]
}
```

### Customer Intent
```json
{
  "fields": [
    {
      "name": "customer_intent",
      "type": "DROPDOWN",
      "label": "Customer Intent",
      "options": ["Cash Out Only", "Upgrade to New Vehicle", "Just Curious", "Already Has Offer", "Not Ready to Sell"]
    },
    {
      "name": "primary_objection",
      "type": "TEXT",
      "label": "Primary Objection"
    },
    {
      "name": "competing_offer",
      "type": "TEXT",
      "label": "Competing Offer Source"
    },
    {
      "name": "competing_offer_amount",
      "type": "NUMBER",
      "label": "Competing Offer Amount"
    },
    {
      "name": "spouse_involved",
      "type": "DROPDOWN",
      "label": "Spouse Involved",
      "options": ["Yes", "No"]
    },
    {
      "name": "spouse_name",
      "type": "TEXT",
      "label": "Spouse Name"
    }
  ]
}
```

### Lead Scoring
```json
{
  "fields": [
    {
      "name": "lead_quality",
      "type": "DROPDOWN",
      "label": "Lead Quality",
      "options": ["Hot - Ready to Buy", "Warm - Interested", "Cool - Needs Nurturing", "Cold - Not Interested"]
    },
    {
      "name": "lead_score",
      "type": "NUMBER",
      "label": "Lead Score (0-100)"
    },
    {
      "name": "engagement_score",
      "type": "NUMBER",
      "label": "Engagement Score"
    },
    {
      "name": "sentiment_score",
      "type": "NUMBER",
      "label": "Sentiment Score (-100 to 100)"
    }
  ]
}
```

### Appointment Data
```json
{
  "fields": [
    {
      "name": "appointment_booked",
      "type": "DROPDOWN",
      "label": "Appointment Booked",
      "options": ["Yes", "No"]
    },
    {
      "name": "appointment_date",
      "type": "DATE",
      "label": "Appointment Date"
    },
    {
      "name": "appointment_time",
      "type": "TEXT",
      "label": "Appointment Time"
    },
    {
      "name": "appointment_type",
      "type": "DROPDOWN",
      "label": "Appointment Type",
      "options": ["VIP Buyback Appraisal", "Trade-In Evaluation", "Sales Consultation"]
    },
    {
      "name": "appointment_status",
      "type": "DROPDOWN",
      "label": "Appointment Status",
      "options": ["Scheduled", "Confirmed", "Completed", "No Show", "Cancelled", "Rescheduled"]
    },
    {
      "name": "appointment_showed",
      "type": "DROPDOWN",
      "label": "Customer Showed",
      "options": ["Yes", "No", "Pending"]
    }
  ]
}
```

### Dealership Outcome
```json
{
  "fields": [
    {
      "name": "appraisal_completed",
      "type": "DROPDOWN",
      "label": "Appraisal Completed",
      "options": ["Yes", "No"]
    },
    {
      "name": "appraisal_value",
      "type": "NUMBER",
      "label": "Appraisal Value"
    },
    {
      "name": "deal_closed",
      "type": "DROPDOWN",
      "label": "Deal Closed",
      "options": ["Yes", "No", "Pending"]
    },
    {
      "name": "deal_type",
      "type": "DROPDOWN",
      "label": "Deal Type",
      "options": ["Cash Buyback Only", "Trade + New Vehicle", "No Deal"]
    },
    {
      "name": "deal_value",
      "type": "NUMBER",
      "label": "Deal Value"
    },
    {
      "name": "new_vehicle_sold",
      "type": "TEXT",
      "label": "New Vehicle Sold (if applicable)"
    }
  ]
}
```

---

# 4. PIPELINE CONFIGURATION

## VIP Buyback Pipeline

Create this pipeline in GHL:

```json
{
  "pipeline_name": "VIP Buyback Campaign",
  "stages": [
    {
      "name": "Mailer Sent",
      "order": 1,
      "color": "#808080"
    },
    {
      "name": "QR Scanned",
      "order": 2,
      "color": "#FFA500"
    },
    {
      "name": "AI Conversation Started",
      "order": 3,
      "color": "#FFFF00"
    },
    {
      "name": "AI Conversation Completed",
      "order": 4,
      "color": "#90EE90"
    },
    {
      "name": "Appointment Booked",
      "order": 5,
      "color": "#00FF00"
    },
    {
      "name": "Appointment Confirmed",
      "order": 6,
      "color": "#00CED1"
    },
    {
      "name": "Customer Showed",
      "order": 7,
      "color": "#1E90FF"
    },
    {
      "name": "Appraisal Completed",
      "order": 8,
      "color": "#9370DB"
    },
    {
      "name": "Deal Closed - Won",
      "order": 9,
      "color": "#32CD32"
    },
    {
      "name": "Deal Lost",
      "order": 10,
      "color": "#FF0000"
    },
    {
      "name": "Follow Up Required",
      "order": 11,
      "color": "#FF69B4"
    },
    {
      "name": "Not Interested",
      "order": 12,
      "color": "#A9A9A9"
    }
  ]
}
```

---

# 5. WEBHOOK EVENTS TO LISTEN FOR

## GHL Webhooks → Antigravity Backend

Subscribe to these GHL webhook events:

```javascript
const GHL_WEBHOOK_EVENTS = [
  // Contact Events
  "ContactCreate",           // New lead added
  "ContactUpdate",           // Lead info updated
  "ContactDelete",           // Lead removed
  "ContactTagUpdate",        // Tags changed
  "ContactDndUpdate",        // DND status changed
  
  // Opportunity Events
  "OpportunityCreate",       // New opportunity
  "OpportunityUpdate",       // Opportunity changed
  "OpportunityStageUpdate",  // Pipeline stage changed
  "OpportunityStatusUpdate", // Status changed (open/won/lost)
  "OpportunityDelete",       // Opportunity removed
  
  // Appointment Events
  "AppointmentCreate",       // Appointment booked
  "AppointmentUpdate",       // Appointment changed
  "AppointmentDelete",       // Appointment cancelled
  
  // Task Events
  "TaskCreate",              // Task created
  "TaskComplete",            // Task completed
  "TaskDelete",              // Task deleted
  
  // Message Events
  "InboundMessage",          // Customer replied
  "OutboundMessage",         // Message sent to customer
  
  // Note Events
  "NoteCreate",              // Note added
  "NoteUpdate",              // Note updated
  
  // Invoice Events (if selling vehicles)
  "InvoiceCreate",
  "InvoicePaid"
];
```

## Tavus Webhooks → Antigravity Backend

```javascript
const TAVUS_WEBHOOK_EVENTS = [
  "conversation.started",     // Video call began
  "conversation.ended",       // Video call ended
  "conversation.error",       // Error occurred
  "replica.ready"             // Replica ready for calls
];
```

## Retell Webhooks → Antigravity Backend

```javascript
const RETELL_WEBHOOK_EVENTS = [
  "call_started",            // Phone call began
  "call_ended",              // Phone call ended  
  "call_analyzed"            // Post-call analysis complete
];
```

---

# 6. COMPLETE WORKFLOW CATALOG

## WORKFLOW 1: QR Scan → Lead Capture

**Trigger:** Customer lands on PURL landing page
**Actions:**
1. Parse URL parameters (first_name, vehicle info)
2. Check if contact exists in GHL
3. If exists: Update contact
4. If new: Create contact
5. Apply tag: "QR Scanned"
6. Update custom field: qr_scanned = "Yes"
7. Update custom field: qr_scan_date = NOW
8. Move opportunity to "QR Scanned" stage
9. Log activity in GHL conversations

```javascript
// Antigravity Endpoint
POST /api/qr-scan

// Request Body
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "john@email.com",
  "phone": "+1234567890",
  "vehicle_year": "2021",
  "vehicle_make": "Nissan",
  "vehicle_model": "Altima",
  "campaign_id": "vip_buyback_jan_2026",
  "source": "qr_scan",
  "location_id": "ghl_location_id"
}

// Response
{
  "success": true,
  "contact_id": "ghl_contact_id",
  "opportunity_id": "ghl_opportunity_id",
  "tavus_session_url": "https://tavus.io/session/xxx",
  "retell_call_id": "xxx"
}
```

---

## WORKFLOW 2: Tavus Conversation Started

**Trigger:** Tavus webhook - conversation.started
**Actions:**
1. Update contact: ai_conversation_type = "Video (Tavus)"
2. Update contact: ai_conversation_id = conversation_id
3. Update contact: ai_conversation_date = NOW
4. Move opportunity to "AI Conversation Started" stage
5. Log activity: "Video conversation started with Maria"

```javascript
// Webhook Handler
POST /api/webhooks/tavus

// Payload
{
  "event": "conversation.started",
  "conversation_id": "xxx",
  "replica_id": "rc2146c13e81",
  "participant": {
    "name": "John Smith",
    "email": "john@email.com"
  },
  "metadata": {
    "contact_id": "ghl_contact_id",
    "campaign_id": "vip_buyback_jan_2026"
  },
  "started_at": "2026-01-28T14:30:00Z"
}
```

---

## WORKFLOW 3: Tavus Conversation Ended

**Trigger:** Tavus webhook - conversation.ended
**Actions:**
1. Update contact with conversation data
2. Parse transcript for key information
3. Determine outcome (appointment booked, follow-up needed, etc.)
4. If appointment booked: Create GHL calendar event
5. Move opportunity to appropriate stage
6. Create task if follow-up needed
7. Send confirmation email (if appointment booked)
8. Calculate lead score based on conversation
9. Log full transcript as note

```javascript
// Webhook Handler
POST /api/webhooks/tavus

// Payload
{
  "event": "conversation.ended",
  "conversation_id": "xxx",
  "duration_seconds": 180,
  "transcript": [
    {"speaker": "agent", "text": "Hey John! I'm Maria with Hill Nissan..."},
    {"speaker": "user", "text": "Hi, yeah I got the mailer..."},
    // ... full transcript
  ],
  "summary": "Customer interested in cash buyback. Scheduled appointment for Tuesday 2PM.",
  "sentiment": {
    "overall": "positive",
    "score": 0.75
  },
  "perception_data": {
    "engagement_level": "high",
    "hesitation_detected": false,
    "interest_signals": ["leaning forward", "nodding"]
  },
  "metadata": {
    "contact_id": "ghl_contact_id",
    "campaign_id": "vip_buyback_jan_2026"
  },
  "ended_at": "2026-01-28T14:33:00Z"
}

// Processing Logic
async function handleTavusConversationEnded(payload) {
  const { conversation_id, transcript, summary, sentiment, metadata } = payload;
  
  // 1. Extract appointment info from transcript
  const appointmentInfo = extractAppointmentFromTranscript(transcript);
  
  // 2. Determine conversation outcome
  const outcome = determineOutcome(transcript, summary);
  
  // 3. Calculate lead score
  const leadScore = calculateLeadScore(sentiment, outcome);
  
  // 4. Update GHL contact
  await ghl.updateContact(metadata.contact_id, {
    customFields: {
      ai_conversation_duration: payload.duration_seconds,
      ai_conversation_outcome: outcome,
      ai_conversation_summary: summary,
      lead_quality: leadScore.quality,
      lead_score: leadScore.score,
      sentiment_score: Math.round(sentiment.score * 100)
    }
  });
  
  // 5. If appointment booked, create calendar event
  if (appointmentInfo.booked) {
    const appointment = await ghl.createAppointment({
      contactId: metadata.contact_id,
      calendarId: process.env.GHL_CALENDAR_ID,
      startTime: appointmentInfo.dateTime,
      title: `VIP Buyback Appraisal - ${appointmentInfo.customerName}`,
      notes: summary
    });
    
    // Update contact with appointment data
    await ghl.updateContact(metadata.contact_id, {
      customFields: {
        appointment_booked: "Yes",
        appointment_date: appointmentInfo.date,
        appointment_time: appointmentInfo.time
      }
    });
    
    // Move opportunity to "Appointment Booked"
    await ghl.updateOpportunityStage(metadata.opportunity_id, "Appointment Booked");
    
    // Send confirmation email
    await ghl.sendEmail(metadata.contact_id, {
      templateId: process.env.APPOINTMENT_CONFIRMATION_TEMPLATE,
      data: {
        first_name: appointmentInfo.customerName,
        appointment_date: appointmentInfo.date,
        appointment_time: appointmentInfo.time,
        vehicle: `${payload.metadata.vehicle_year} ${payload.metadata.vehicle_model}`
      }
    });
  } else {
    // Create follow-up task
    await ghl.createTask(metadata.contact_id, {
      title: `Follow up: ${outcome}`,
      description: summary,
      dueDate: addDays(new Date(), 1)
    });
    
    // Move to appropriate stage
    await ghl.updateOpportunityStage(metadata.opportunity_id, 
      outcome === "Soft No - Follow Up" ? "Follow Up Required" : "AI Conversation Completed"
    );
  }
  
  // 6. Log transcript as note
  await ghl.createNote(metadata.contact_id, {
    body: `## AI Video Conversation Transcript\n\n${formatTranscript(transcript)}\n\n**Summary:** ${summary}`
  });
  
  // 7. Apply tags based on outcome
  const tags = getTagsForOutcome(outcome, sentiment);
  await ghl.addTags(metadata.contact_id, tags);
}
```

---

## WORKFLOW 4: Retell Call Started

**Trigger:** Retell webhook - call_started
**Actions:**
1. Update contact: ai_conversation_type = "Voice (Retell)"
2. Update contact: ai_conversation_id = call_id
3. Move opportunity to "AI Conversation Started" stage
4. Log activity: "Phone call started with Maria"

---

## WORKFLOW 5: Retell Call Ended & Analyzed

**Trigger:** Retell webhook - call_analyzed
**Actions:**
1. Parse post-call analysis data
2. Update all contact custom fields
3. If appointment booked: Create GHL calendar event
4. Move opportunity to appropriate stage
5. Create tasks as needed
6. Send confirmation email
7. Log transcript and recording

```javascript
// Webhook Handler
POST /api/webhooks/retell

// Payload
{
  "event": "call_analyzed",
  "call_id": "xxx",
  "agent_id": "xxx",
  "from_number": "+1234567890",
  "to_number": "+0987654321",
  "call_type": "inbound",
  "start_time": "2026-01-28T14:30:00Z",
  "end_time": "2026-01-28T14:35:00Z",
  "duration_seconds": 300,
  "transcript": [...],
  "recording_url": "https://retell.ai/recording/xxx",
  "post_call_analysis": {
    "appointment_booked": true,
    "customer_reached": true,
    "objection_raised": true,
    "interested_in_upgrade": false,
    "call_summary": "Customer John called about 2021 Altima. Initially hesitant about pricing but agreed to in-person appraisal. Booked for Tuesday 2PM.",
    "primary_objection": "wanted price estimate",
    "appointment_details": "Tuesday at 2:00 PM",
    "follow_up_notes": "Customer has CarMax quote, wants us to beat it",
    "call_outcome": "Appointment Booked",
    "customer_intent": "Cash Out Only",
    "lead_quality": "Hot - Ready to Buy"
  },
  "custom_data": {
    "contact_id": "ghl_contact_id",
    "first_name": "John",
    "vehicle_year": "2021",
    "vehicle_model": "Altima"
  }
}

// Processing Logic
async function handleRetellCallAnalyzed(payload) {
  const { call_id, post_call_analysis, custom_data, transcript, recording_url } = payload;
  
  // 1. Update GHL contact with all analysis data
  await ghl.updateContact(custom_data.contact_id, {
    customFields: {
      ai_conversation_type: "Voice (Retell)",
      ai_conversation_id: call_id,
      ai_conversation_duration: payload.duration_seconds,
      ai_conversation_outcome: post_call_analysis.call_outcome,
      ai_conversation_summary: post_call_analysis.call_summary,
      ai_recording_url: recording_url,
      customer_intent: post_call_analysis.customer_intent,
      primary_objection: post_call_analysis.primary_objection,
      lead_quality: post_call_analysis.lead_quality,
      appointment_booked: post_call_analysis.appointment_booked ? "Yes" : "No"
    }
  });
  
  // 2. If appointment booked, create calendar event
  if (post_call_analysis.appointment_booked) {
    const appointmentDateTime = parseAppointmentDetails(post_call_analysis.appointment_details);
    
    await ghl.createAppointment({
      contactId: custom_data.contact_id,
      calendarId: process.env.GHL_CALENDAR_ID,
      startTime: appointmentDateTime,
      endTime: addMinutes(appointmentDateTime, 15),
      title: `VIP Buyback Appraisal - ${custom_data.first_name}`,
      notes: post_call_analysis.call_summary
    });
    
    // Send confirmation email
    await ghl.sendEmail(custom_data.contact_id, {
      templateId: process.env.APPOINTMENT_CONFIRMATION_TEMPLATE
    });
    
    // Move opportunity
    await ghl.updateOpportunityStage(custom_data.opportunity_id, "Appointment Booked");
    
  } else if (post_call_analysis.call_outcome === "Soft No - Follow Up") {
    // Create follow-up task
    await ghl.createTask(custom_data.contact_id, {
      title: `Follow up: ${post_call_analysis.primary_objection || "Needs more info"}`,
      description: post_call_analysis.follow_up_notes,
      dueDate: addDays(new Date(), 1)
    });
    
    await ghl.updateOpportunityStage(custom_data.opportunity_id, "Follow Up Required");
  }
  
  // 3. Log call to GHL conversations (for call history)
  await ghl.logCall(custom_data.contact_id, {
    direction: "inbound",
    duration: payload.duration_seconds,
    status: "completed",
    recordingUrl: recording_url
  });
  
  // 4. Create note with transcript
  await ghl.createNote(custom_data.contact_id, {
    body: `## AI Voice Conversation\n\n**Duration:** ${formatDuration(payload.duration_seconds)}\n**Outcome:** ${post_call_analysis.call_outcome}\n\n**Summary:** ${post_call_analysis.call_summary}\n\n**Recording:** ${recording_url}`
  });
  
  // 5. Apply tags
  const tags = [
    `ai_outcome_${post_call_analysis.call_outcome.toLowerCase().replace(/\s+/g, '_')}`,
    `intent_${post_call_analysis.customer_intent.toLowerCase().replace(/\s+/g, '_')}`,
    `quality_${post_call_analysis.lead_quality.split(' - ')[0].toLowerCase()}`
  ];
  await ghl.addTags(custom_data.contact_id, tags);
}
```

---

## WORKFLOW 6: Appointment Reminder (24 Hours Before)

**Trigger:** GHL Workflow (time-based) OR Antigravity cron job
**Actions:**
1. Find appointments happening in 24 hours
2. Send SMS reminder
3. Send email reminder
4. Update contact: reminder_sent = true

```javascript
// Cron Job: Run daily at 9 AM
async function sendAppointmentReminders() {
  const tomorrow = addDays(new Date(), 1);
  const tomorrowStart = startOfDay(tomorrow);
  const tomorrowEnd = endOfDay(tomorrow);
  
  // Get all appointments for tomorrow
  const appointments = await ghl.getAppointments({
    calendarId: process.env.GHL_CALENDAR_ID,
    startTimeGte: tomorrowStart,
    startTimeLte: tomorrowEnd
  });
  
  for (const appointment of appointments) {
    // Send SMS reminder
    await ghl.sendSMS(appointment.contactId, {
      message: `Hi ${appointment.contact.firstName}! Just a reminder about your VIP Buyback appointment tomorrow at ${formatTime(appointment.startTime)} at Hill Nissan. Bring your mailer and ask for the VIP Buyback desk. See you then! - Maria`
    });
    
    // Send email reminder
    await ghl.sendEmail(appointment.contactId, {
      templateId: process.env.APPOINTMENT_REMINDER_TEMPLATE,
      data: {
        first_name: appointment.contact.firstName,
        appointment_time: formatTime(appointment.startTime),
        vehicle: `${appointment.contact.customFields.vehicle_year} ${appointment.contact.customFields.vehicle_model}`
      }
    });
    
    // Log activity
    await ghl.createNote(appointment.contactId, {
      body: "📅 Appointment reminder sent (SMS + Email)"
    });
  }
}
```

---

## WORKFLOW 7: No-Show Follow-Up

**Trigger:** GHL Webhook - AppointmentUpdate (status = "No Show") OR Manual trigger
**Actions:**
1. Update contact: appointment_showed = "No"
2. Move opportunity to "Follow Up Required"
3. Create task: "No-show follow-up call"
4. Send "We missed you" email
5. Optionally: Trigger Retell outbound call

```javascript
// Webhook Handler
async function handleNoShow(appointmentId, contactId) {
  // 1. Update contact
  await ghl.updateContact(contactId, {
    customFields: {
      appointment_showed: "No",
      appointment_status: "No Show"
    }
  });
  
  // 2. Move opportunity
  await ghl.updateOpportunityStage(contactId, "Follow Up Required");
  
  // 3. Create follow-up task
  await ghl.createTask(contactId, {
    title: "No-show follow-up call",
    description: "Customer missed their appointment. Call to reschedule.",
    dueDate: new Date(), // Today
    priority: "high"
  });
  
  // 4. Send "We missed you" email
  await ghl.sendEmail(contactId, {
    templateId: process.env.NO_SHOW_EMAIL_TEMPLATE
  });
  
  // 5. Remove tag, add new tag
  await ghl.removeTags(contactId, ["appointment_booked"]);
  await ghl.addTags(contactId, ["no_show", "needs_reschedule"]);
}
```

---

## WORKFLOW 8: Deal Closed → Update Everything

**Trigger:** Manual input from dealership OR GHL form submission
**Actions:**
1. Update contact with deal details
2. Move opportunity to "Deal Closed - Won" or "Deal Lost"
3. Update monetary value on opportunity
4. Apply appropriate tags
5. Calculate ROI attribution

```javascript
// API Endpoint for dealership to report deal outcome
POST /api/deal-closed

// Request Body
{
  "contact_id": "ghl_contact_id",
  "deal_closed": true,
  "deal_type": "Trade + New Vehicle",  // or "Cash Buyback Only" or "No Deal"
  "appraisal_value": 18500,
  "new_vehicle_sold": "2026 Nissan Rogue SL",
  "total_deal_value": 45000,
  "notes": "Customer very happy. Referred a friend."
}

// Handler
async function handleDealClosed(data) {
  const { contact_id, deal_closed, deal_type, appraisal_value, total_deal_value } = data;
  
  // 1. Update contact
  await ghl.updateContact(contact_id, {
    customFields: {
      deal_closed: deal_closed ? "Yes" : "No",
      deal_type: deal_type,
      appraisal_value: appraisal_value,
      deal_value: total_deal_value,
      new_vehicle_sold: data.new_vehicle_sold || ""
    }
  });
  
  // 2. Update opportunity
  const opportunity = await ghl.getOpportunityByContact(contact_id);
  await ghl.updateOpportunity(opportunity.id, {
    status: deal_closed ? "won" : "lost",
    monetaryValue: total_deal_value,
    pipelineStageId: deal_closed ? "Deal Closed - Won" : "Deal Lost"
  });
  
  // 3. Apply tags
  if (deal_closed) {
    await ghl.addTags(contact_id, ["deal_won", `deal_type_${deal_type.toLowerCase().replace(/\s+/g, '_')}`]);
    
    // If they bought a new vehicle, add to post-sale nurture
    if (deal_type === "Trade + New Vehicle") {
      await ghl.addToWorkflow(contact_id, process.env.POST_SALE_NURTURE_WORKFLOW_ID);
    }
  } else {
    await ghl.addTags(contact_id, ["deal_lost"]);
    await ghl.addToWorkflow(contact_id, process.env.LOST_DEAL_FOLLOWUP_WORKFLOW_ID);
  }
  
  // 4. Create note
  await ghl.createNote(contact_id, {
    body: `## Deal Outcome\n\n**Status:** ${deal_closed ? "Won" : "Lost"}\n**Type:** ${deal_type}\n**Appraisal Value:** $${appraisal_value}\n**Total Deal Value:** $${total_deal_value}\n\n**Notes:** ${data.notes}`
  });
}
```

---

## WORKFLOW 9: Campaign Performance Sync

**Trigger:** Daily cron job
**Actions:**
1. Query all contacts in campaign
2. Calculate metrics (scan rate, conversion rate, etc.)
3. Store in analytics database
4. Update campaign dashboard

```javascript
// Daily Campaign Analytics Sync
async function syncCampaignAnalytics(campaignId) {
  // Get all contacts in campaign
  const contacts = await ghl.searchContacts({
    customFields: {
      campaign_id: campaignId
    }
  });
  
  const metrics = {
    total_mailers_sent: contacts.length,
    qr_scanned: contacts.filter(c => c.customFields.qr_scanned === "Yes").length,
    conversations_started: contacts.filter(c => c.customFields.ai_conversation_id).length,
    appointments_booked: contacts.filter(c => c.customFields.appointment_booked === "Yes").length,
    customers_showed: contacts.filter(c => c.customFields.appointment_showed === "Yes").length,
    deals_closed: contacts.filter(c => c.customFields.deal_closed === "Yes").length,
    total_revenue: contacts.reduce((sum, c) => sum + (c.customFields.deal_value || 0), 0),
    
    // Calculated rates
    scan_rate: 0,
    conversation_rate: 0,
    booking_rate: 0,
    show_rate: 0,
    close_rate: 0
  };
  
  // Calculate rates
  metrics.scan_rate = (metrics.qr_scanned / metrics.total_mailers_sent * 100).toFixed(2);
  metrics.conversation_rate = (metrics.conversations_started / metrics.qr_scanned * 100).toFixed(2);
  metrics.booking_rate = (metrics.appointments_booked / metrics.conversations_started * 100).toFixed(2);
  metrics.show_rate = (metrics.customers_showed / metrics.appointments_booked * 100).toFixed(2);
  metrics.close_rate = (metrics.deals_closed / metrics.customers_showed * 100).toFixed(2);
  
  // Store metrics
  await db.campaignMetrics.upsert({
    campaign_id: campaignId,
    date: new Date(),
    metrics: metrics
  });
  
  return metrics;
}
```

---

## WORKFLOW 10: Inbound SMS/Email → Route to AI or Human

**Trigger:** GHL Webhook - InboundMessage
**Actions:**
1. Check if contact is in active AI conversation
2. If active: Route to AI agent
3. If not: Check message intent
4. Route to appropriate handler (human or AI)

```javascript
// Webhook Handler
POST /api/webhooks/ghl/inbound-message

async function handleInboundMessage(payload) {
  const { contactId, message, messageType } = payload;
  
  // Get contact context
  const contact = await ghl.getContact(contactId);
  
  // Check if they have an upcoming appointment
  const hasAppointment = contact.customFields.appointment_booked === "Yes" && 
                         contact.customFields.appointment_status === "Scheduled";
  
  // Check message intent (simple keyword matching or AI classification)
  const intent = classifyMessageIntent(message.body);
  
  if (intent === "reschedule" && hasAppointment) {
    // Route to reschedule flow
    await handleRescheduleRequest(contact, message);
  } else if (intent === "cancel" && hasAppointment) {
    // Route to cancellation flow
    await handleCancellationRequest(contact, message);
  } else if (intent === "question") {
    // Trigger AI call back
    await triggerRetellCallback(contact);
  } else {
    // Assign to human
    await ghl.createTask(contactId, {
      title: "Inbound message needs response",
      description: message.body,
      assignedTo: process.env.DEFAULT_SALES_USER_ID
    });
  }
}
```

---

## WORKFLOW 11: Outbound Retell Call (Follow-Up)

**Trigger:** Task created OR Manual trigger OR Scheduled
**Actions:**
1. Initiate Retell outbound call
2. Update contact: outbound_call_initiated
3. Handle call result (same as inbound)

```javascript
// Trigger outbound call
async function initiateRetellOutboundCall(contactId, reason) {
  const contact = await ghl.getContact(contactId);
  
  // Create Retell call
  const call = await retell.createCall({
    agent_id: process.env.RETELL_MARIA_AGENT_ID,
    customer_number: contact.phone,
    metadata: {
      contact_id: contactId,
      campaign_id: contact.customFields.campaign_id,
      call_reason: reason,
      first_name: contact.firstName,
      vehicle_year: contact.customFields.vehicle_year,
      vehicle_model: contact.customFields.vehicle_model,
      previous_objection: contact.customFields.primary_objection
    },
    retell_llm_dynamic_variables: {
      first_name: contact.firstName,
      vehicle_year: contact.customFields.vehicle_year,
      vehicle_model: contact.customFields.vehicle_model,
      call_context: getCallContext(reason, contact)
    }
  });
  
  // Log activity
  await ghl.createNote(contactId, {
    body: `📞 Outbound AI call initiated\n**Reason:** ${reason}\n**Call ID:** ${call.call_id}`
  });
  
  return call;
}

function getCallContext(reason, contact) {
  switch(reason) {
    case "no_show_followup":
      return "Customer missed their appointment yesterday. Calling to reschedule.";
    case "soft_no_followup":
      return `Customer previously said "${contact.customFields.primary_objection}". Following up.`;
    case "offer_expiring":
      return "The VIP offer expires Friday. Calling to remind them.";
    default:
      return "Following up on VIP Buyback offer.";
  }
}
```

---

## WORKFLOW 12: Lead Score Recalculation

**Trigger:** After any contact update OR Daily recalculation
**Actions:**
1. Gather all engagement signals
2. Calculate composite lead score
3. Update contact: lead_score
4. Move to appropriate pipeline stage if threshold crossed

```javascript
function calculateLeadScore(contact) {
  let score = 0;
  
  // QR scan (they took action)
  if (contact.customFields.qr_scanned === "Yes") score += 10;
  
  // Had AI conversation
  if (contact.customFields.ai_conversation_id) score += 15;
  
  // Conversation outcome
  const outcomeScores = {
    "Appointment Booked": 30,
    "Soft No - Follow Up": 10,
    "Call Back Requested": 15,
    "Hard No": -10
  };
  score += outcomeScores[contact.customFields.ai_conversation_outcome] || 0;
  
  // Sentiment
  const sentiment = contact.customFields.sentiment_score || 0;
  score += Math.round(sentiment / 10); // -10 to +10
  
  // Customer intent
  const intentScores = {
    "Cash Out Only": 20,
    "Upgrade to New Vehicle": 25,
    "Just Curious": 5,
    "Already Has Offer": 15,
    "Not Ready to Sell": 0
  };
  score += intentScores[contact.customFields.customer_intent] || 0;
  
  // Appointment status
  if (contact.customFields.appointment_booked === "Yes") score += 10;
  if (contact.customFields.appointment_showed === "Yes") score += 20;
  
  // Engagement recency (decay)
  const daysSinceContact = daysBetween(contact.customFields.ai_conversation_date, new Date());
  if (daysSinceContact > 7) score -= 5;
  if (daysSinceContact > 14) score -= 10;
  if (daysSinceContact > 30) score -= 20;
  
  // Cap at 0-100
  return Math.max(0, Math.min(100, score));
}

function getLeadQuality(score) {
  if (score >= 70) return "Hot - Ready to Buy";
  if (score >= 40) return "Warm - Interested";
  if (score >= 20) return "Cool - Needs Nurturing";
  return "Cold - Not Interested";
}
```

---

# 7. ANTIGRAVITY BACKEND API ENDPOINTS

## Complete API Specification

```yaml
openapi: 3.0.0
info:
  title: Voxaris Antigravity Backend API
  version: 1.0.0
  description: Backend API connecting GHL, Tavus, and Retell

servers:
  - url: https://api.voxaris.io/v1

paths:
  # ==================== QR SCAN / LEAD CAPTURE ====================
  /qr-scan:
    post:
      summary: Handle QR code scan from PURL landing page
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QRScanRequest'
      responses:
        '200':
          description: Lead captured successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QRScanResponse'

  # ==================== TAVUS ====================
  /tavus/start-conversation:
    post:
      summary: Initiate Tavus CVI video conversation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TavusStartRequest'
      responses:
        '200':
          description: Conversation session created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TavusStartResponse'

  /webhooks/tavus:
    post:
      summary: Handle Tavus webhook events
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TavusWebhookPayload'
      responses:
        '200':
          description: Webhook processed

  # ==================== RETELL ====================
  /retell/start-call:
    post:
      summary: Initiate Retell voice call
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RetellStartRequest'
      responses:
        '200':
          description: Call initiated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RetellStartResponse'

  /retell/outbound-call:
    post:
      summary: Initiate outbound Retell call for follow-up
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RetellOutboundRequest'
      responses:
        '200':
          description: Outbound call initiated

  /webhooks/retell:
    post:
      summary: Handle Retell webhook events
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RetellWebhookPayload'
      responses:
        '200':
          description: Webhook processed

  # ==================== GHL ====================
  /webhooks/ghl:
    post:
      summary: Handle GHL webhook events
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GHLWebhookPayload'
      responses:
        '200':
          description: Webhook processed

  /ghl/contacts/{contactId}:
    get:
      summary: Get contact details from GHL
      parameters:
        - name: contactId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Contact details
    put:
      summary: Update contact in GHL
      parameters:
        - name: contactId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GHLContactUpdate'
      responses:
        '200':
          description: Contact updated

  /ghl/appointments:
    post:
      summary: Create appointment in GHL
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GHLAppointmentRequest'
      responses:
        '200':
          description: Appointment created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GHLAppointmentResponse'

  /ghl/calendar/availability:
    get:
      summary: Get available appointment slots
      parameters:
        - name: calendarId
          in: query
          required: true
          schema:
            type: string
        - name: startDate
          in: query
          required: true
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          required: true
          schema:
            type: string
            format: date
      responses:
        '200':
          description: Available slots
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AvailabilityResponse'

  # ==================== DEAL TRACKING ====================
  /deal-closed:
    post:
      summary: Record deal outcome from dealership
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DealClosedRequest'
      responses:
        '200':
          description: Deal recorded

  # ==================== ANALYTICS ====================
  /analytics/campaign/{campaignId}:
    get:
      summary: Get campaign analytics
      parameters:
        - name: campaignId
          in: path
          required: true
          schema:
            type: string
        - name: startDate
          in: query
          schema:
            type: string
            format: date
        - name: endDate
          in: query
          schema:
            type: string
            format: date
      responses:
        '200':
          description: Campaign metrics
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CampaignAnalytics'

  /analytics/dashboard:
    get:
      summary: Get dashboard metrics
      responses:
        '200':
          description: Dashboard data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DashboardMetrics'

components:
  schemas:
    QRScanRequest:
      type: object
      required:
        - first_name
        - phone
        - vehicle_year
        - vehicle_make
        - vehicle_model
        - campaign_id
        - location_id
      properties:
        first_name:
          type: string
        last_name:
          type: string
        email:
          type: string
        phone:
          type: string
        vehicle_year:
          type: string
        vehicle_make:
          type: string
        vehicle_model:
          type: string
        campaign_id:
          type: string
        location_id:
          type: string
        source:
          type: string
          default: qr_scan

    QRScanResponse:
      type: object
      properties:
        success:
          type: boolean
        contact_id:
          type: string
        opportunity_id:
          type: string
        is_new_contact:
          type: boolean
        tavus_session_url:
          type: string
        retell_enabled:
          type: boolean

    TavusStartRequest:
      type: object
      required:
        - contact_id
        - first_name
        - vehicle_year
        - vehicle_model
      properties:
        contact_id:
          type: string
        first_name:
          type: string
        vehicle_year:
          type: string
        vehicle_make:
          type: string
        vehicle_model:
          type: string
        campaign_id:
          type: string

    TavusStartResponse:
      type: object
      properties:
        conversation_id:
          type: string
        session_url:
          type: string
        replica_id:
          type: string

    RetellStartRequest:
      type: object
      required:
        - contact_id
        - phone
      properties:
        contact_id:
          type: string
        phone:
          type: string
        first_name:
          type: string
        vehicle_year:
          type: string
        vehicle_model:
          type: string
        campaign_id:
          type: string
        call_reason:
          type: string

    DealClosedRequest:
      type: object
      required:
        - contact_id
        - deal_closed
      properties:
        contact_id:
          type: string
        deal_closed:
          type: boolean
        deal_type:
          type: string
          enum: [Cash Buyback Only, Trade + New Vehicle, No Deal]
        appraisal_value:
          type: number
        new_vehicle_sold:
          type: string
        total_deal_value:
          type: number
        notes:
          type: string

    CampaignAnalytics:
      type: object
      properties:
        campaign_id:
          type: string
        total_mailers_sent:
          type: integer
        qr_scanned:
          type: integer
        conversations_started:
          type: integer
        appointments_booked:
          type: integer
        customers_showed:
          type: integer
        deals_closed:
          type: integer
        total_revenue:
          type: number
        scan_rate:
          type: number
        conversation_rate:
          type: number
        booking_rate:
          type: number
        show_rate:
          type: number
        close_rate:
          type: number
        avg_deal_value:
          type: number
        cost_per_scan:
          type: number
        cost_per_appointment:
          type: number
        cost_per_deal:
          type: number
        roi:
          type: number
```

---

# 8. TAVUS INTEGRATION WORKFLOWS

## Tavus API Calls

### Create Conversation Session
```javascript
async function createTavusConversation(contactData) {
  const response = await fetch('https://api.tavus.io/v2/conversations', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.TAVUS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      replica_id: "rc2146c13e81", // Maria replica
      conversation_name: `VIP Buyback - ${contactData.first_name}`,
      conversational_context: getMariaCon conversationalContext(),
      custom_greeting: `Hey ${contactData.first_name}! I'm Maria with Hill Nissan. I see you just scanned your VIP Buyback mailer — great timing!`,
      properties: {
        max_call_duration: 600,
        participant_left_timeout: 30,
        enable_recording: true,
        enable_transcription: true
      },
      callback_url: `${process.env.API_BASE_URL}/webhooks/tavus`,
      metadata: {
        contact_id: contactData.contact_id,
        campaign_id: contactData.campaign_id,
        first_name: contactData.first_name,
        vehicle_year: contactData.vehicle_year,
        vehicle_make: contactData.vehicle_make,
        vehicle_model: contactData.vehicle_model
      }
    })
  });
  
  return await response.json();
}
```

---

# 9. RETELL INTEGRATION WORKFLOWS

## Retell API Calls

### Create Inbound Call Handler
```javascript
async function handleRetellInboundCall(agentId, phoneNumber) {
  const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent_id: agentId,
      from_number: phoneNumber,
      metadata: {} // Will be populated from GHL lookup
    })
  });
  
  return await response.json();
}
```

### Create Outbound Call
```javascript
async function createRetellOutboundCall(contactData, callReason) {
  const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RETELL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      agent_id: process.env.RETELL_MARIA_AGENT_ID,
      to_number: contactData.phone,
      from_number: process.env.RETELL_CALLER_ID,
      metadata: {
        contact_id: contactData.contact_id,
        campaign_id: contactData.campaign_id,
        call_reason: callReason,
        first_name: contactData.first_name,
        vehicle_year: contactData.vehicle_year,
        vehicle_model: contactData.vehicle_model
      },
      retell_llm_dynamic_variables: {
        first_name: contactData.first_name,
        vehicle_year: contactData.vehicle_year,
        vehicle_make: contactData.vehicle_make,
        vehicle_model: contactData.vehicle_model,
        call_context: getCallContextForReason(callReason, contactData)
      }
    })
  });
  
  return await response.json();
}
```

---

# 10. POST-CALL DATA SYNC

## Data Mapping: Tavus/Retell → GHL

```javascript
const POST_CALL_DATA_MAP = {
  // From AI conversation to GHL custom fields
  "appointment_booked": "appointment_booked",
  "appointment_details": "appointment_time",
  "call_summary": "ai_conversation_summary",
  "call_outcome": "ai_conversation_outcome",
  "customer_intent": "customer_intent",
  "primary_objection": "primary_objection",
  "lead_quality": "lead_quality",
  "duration_seconds": "ai_conversation_duration",
  "recording_url": "ai_recording_url",
  
  // Sentiment mapping
  "sentiment.score": "sentiment_score",
  
  // Perception data (Tavus only)
  "perception_data.engagement_level": "engagement_score"
};

async function syncPostCallDataToGHL(contactId, postCallData, source) {
  const updatePayload = {
    customFields: {}
  };
  
  // Map all fields
  for (const [sourceField, ghlField] of Object.entries(POST_CALL_DATA_MAP)) {
    const value = getNestedValue(postCallData, sourceField);
    if (value !== undefined) {
      updatePayload.customFields[ghlField] = value;
    }
  }
  
  // Add source-specific fields
  updatePayload.customFields.ai_conversation_type = source === "tavus" ? "Video (Tavus)" : "Voice (Retell)";
  updatePayload.customFields.ai_conversation_date = new Date().toISOString();
  
  // Update GHL contact
  await ghl.updateContact(contactId, updatePayload);
  
  // Handle appointment booking if detected
  if (postCallData.appointment_booked) {
    await handleAppointmentBooking(contactId, postCallData);
  }
  
  // Update opportunity stage
  await updateOpportunityStage(contactId, postCallData.call_outcome);
  
  // Apply tags
  await applyOutcomeTags(contactId, postCallData);
  
  // Create transcript note
  if (postCallData.transcript) {
    await createTranscriptNote(contactId, postCallData);
  }
}
```

---

# 11. APPOINTMENT BOOKING FLOW

## Calendar Integration

```javascript
async function handleAppointmentBooking(contactId, postCallData) {
  // 1. Parse appointment details from AI output
  const appointmentInfo = parseAppointmentDetails(postCallData.appointment_details);
  
  // 2. Check availability in GHL calendar
  const availableSlots = await ghl.getCalendarAvailability({
    calendarId: process.env.GHL_CALENDAR_ID,
    startDate: appointmentInfo.date,
    endDate: appointmentInfo.date
  });
  
  // 3. Find matching slot or closest available
  const slot = findMatchingSlot(availableSlots, appointmentInfo.time);
  
  if (!slot) {
    // No exact slot - create task for human follow-up
    await ghl.createTask(contactId, {
      title: "Appointment time unavailable - needs reschedule",
      description: `Customer requested: ${postCallData.appointment_details}`,
      priority: "high"
    });
    return null;
  }
  
  // 4. Create appointment in GHL
  const contact = await ghl.getContact(contactId);
  const appointment = await ghl.createAppointment({
    calendarId: process.env.GHL_CALENDAR_ID,
    contactId: contactId,
    startTime: slot.startTime,
    endTime: slot.endTime,
    title: `VIP Buyback Appraisal - ${contact.firstName} ${contact.lastName}`,
    appointmentStatus: "confirmed",
    notes: `**Vehicle:** ${contact.customFields.vehicle_year} ${contact.customFields.vehicle_model}\n\n**AI Summary:** ${postCallData.call_summary}\n\n**Customer Intent:** ${postCallData.customer_intent}`
  });
  
  // 5. Update contact with appointment data
  await ghl.updateContact(contactId, {
    customFields: {
      appointment_booked: "Yes",
      appointment_date: formatDate(slot.startTime),
      appointment_time: formatTime(slot.startTime),
      appointment_status: "Scheduled"
    }
  });
  
  // 6. Move opportunity to "Appointment Booked" stage
  const opportunity = await ghl.getOpportunityByContact(contactId);
  await ghl.updateOpportunity(opportunity.id, {
    pipelineStageId: getStageId("Appointment Booked")
  });
  
  // 7. Send confirmation email
  await ghl.sendEmail(contactId, {
    templateId: process.env.APPOINTMENT_CONFIRMATION_EMAIL_TEMPLATE,
    scheduledAt: null // Send immediately
  });
  
  // 8. Add to appointment reminder workflow
  await ghl.addToWorkflow(contactId, process.env.APPOINTMENT_REMINDER_WORKFLOW_ID);
  
  return appointment;
}
```

---

# 12. FOLLOW-UP AUTOMATION

## Follow-Up Scenarios

### Scenario 1: Soft No - Not Ready Yet
```javascript
async function handleSoftNoFollowUp(contactId, objection) {
  // Create task for 2-day follow-up
  await ghl.createTask(contactId, {
    title: `Follow up: ${objection || "Needs more time"}`,
    dueDate: addDays(new Date(), 2),
    priority: "medium"
  });
  
  // Add to drip sequence
  await ghl.addToWorkflow(contactId, process.env.SOFT_NO_NURTURE_WORKFLOW_ID);
  
  // Apply tag
  await ghl.addTags(contactId, ["soft_no", "needs_followup"]);
}
```

### Scenario 2: Asked for Callback
```javascript
async function handleCallbackRequest(contactId, preferredTime) {
  // Schedule Retell outbound call
  const callTime = parsePreferredTime(preferredTime) || addHours(new Date(), 4);
  
  await scheduleRetellCall({
    contactId,
    scheduledTime: callTime,
    callReason: "callback_requested"
  });
  
  // Create task as backup
  await ghl.createTask(contactId, {
    title: "Callback requested",
    description: `Customer asked to be called back at: ${preferredTime || "unspecified"}`,
    dueDate: callTime
  });
}
```

### Scenario 3: No Show
```javascript
async function handleNoShowFollowUp(contactId, appointmentId) {
  // Update appointment status
  await ghl.updateAppointment(appointmentId, {
    appointmentStatus: "no_show"
  });
  
  // Update contact
  await ghl.updateContact(contactId, {
    customFields: {
      appointment_showed: "No",
      appointment_status: "No Show"
    }
  });
  
  // Send "We missed you" email
  await ghl.sendEmail(contactId, {
    templateId: process.env.NO_SHOW_EMAIL_TEMPLATE
  });
  
  // Schedule follow-up call for next day
  await scheduleRetellCall({
    contactId,
    scheduledTime: addDays(new Date(), 1),
    callReason: "no_show_followup"
  });
  
  // Create high-priority task
  await ghl.createTask(contactId, {
    title: "No-show: Reschedule appointment",
    dueDate: new Date(),
    priority: "high"
  });
}
```

### Scenario 4: Offer Expiring
```javascript
// Daily cron job - runs Thursday for Friday expiration
async function sendExpirationReminders(campaignId, expirationDate) {
  // Find all contacts who scanned but didn't book
  const contacts = await ghl.searchContacts({
    filters: {
      campaign_id: campaignId,
      qr_scanned: "Yes",
      appointment_booked: "No"
    }
  });
  
  for (const contact of contacts) {
    // Send urgency SMS
    await ghl.sendSMS(contact.id, {
      message: `Hi ${contact.firstName}! Quick reminder — the VIP offer on your ${contact.customFields.vehicle_model} expires tomorrow. There's still time to get your top-dollar appraisal. Tap here to connect: [LINK]`
    });
    
    // Optionally trigger Retell outbound call
    if (contact.customFields.lead_quality === "Warm - Interested") {
      await scheduleRetellCall({
        contactId: contact.id,
        scheduledTime: addHours(new Date(), 2),
        callReason: "offer_expiring"
      });
    }
  }
}
```

---

# 13. ANALYTICS & REPORTING

## Real-Time Dashboard Data

```javascript
async function getDashboardMetrics(locationId, dateRange) {
  const { startDate, endDate } = dateRange;
  
  // Get all campaign data
  const campaigns = await db.campaigns.find({ locationId });
  
  const metrics = {
    // Funnel Metrics
    funnel: {
      mailers_sent: 0,
      qr_scanned: 0,
      conversations_started: 0,
      appointments_booked: 0,
      customers_showed: 0,
      deals_closed: 0
    },
    
    // Conversion Rates
    rates: {
      scan_rate: 0,
      conversation_rate: 0,
      booking_rate: 0,
      show_rate: 0,
      close_rate: 0
    },
    
    // Revenue
    revenue: {
      total_deal_value: 0,
      avg_deal_value: 0,
      projected_revenue: 0
    },
    
    // AI Performance
    ai_performance: {
      avg_conversation_duration: 0,
      avg_sentiment_score: 0,
      top_objections: [],
      booking_rate_by_intent: {}
    },
    
    // Cost Analysis
    costs: {
      cost_per_mailer: 0,
      cost_per_scan: 0,
      cost_per_conversation: 0,
      cost_per_appointment: 0,
      cost_per_deal: 0,
      roi: 0
    },
    
    // Time-based
    trends: {
      daily_scans: [],
      daily_appointments: [],
      daily_deals: []
    }
  };
  
  // Calculate metrics from GHL data
  for (const campaign of campaigns) {
    const contacts = await ghl.searchContacts({
      campaign_id: campaign.id,
      dateAddedGte: startDate,
      dateAddedLte: endDate
    });
    
    // Aggregate...
    metrics.funnel.mailers_sent += campaign.mailers_sent;
    metrics.funnel.qr_scanned += contacts.filter(c => c.customFields.qr_scanned === "Yes").length;
    // ... etc
  }
  
  // Calculate derived metrics
  metrics.rates.scan_rate = (metrics.funnel.qr_scanned / metrics.funnel.mailers_sent * 100).toFixed(2);
  // ... etc
  
  return metrics;
}
```

## Campaign Comparison Report

```javascript
async function generateCampaignComparisonReport(campaignIds) {
  const report = {
    campaigns: [],
    summary: {
      best_performing: null,
      worst_performing: null,
      insights: []
    }
  };
  
  for (const campaignId of campaignIds) {
    const metrics = await getCampaignMetrics(campaignId);
    report.campaigns.push({
      id: campaignId,
      name: metrics.name,
      metrics: metrics
    });
  }
  
  // Rank by ROI
  report.campaigns.sort((a, b) => b.metrics.roi - a.metrics.roi);
  report.summary.best_performing = report.campaigns[0];
  report.summary.worst_performing = report.campaigns[report.campaigns.length - 1];
  
  // Generate insights
  report.summary.insights = generateInsights(report.campaigns);
  
  return report;
}
```

---

# 14. ERROR HANDLING & RETRY LOGIC

## Webhook Retry Strategy

```javascript
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000,    // 30 seconds
  backoffMultiplier: 2
};

async function processWebhookWithRetry(webhookHandler, payload) {
  let attempt = 0;
  let delay = RETRY_CONFIG.initialDelay;
  
  while (attempt < RETRY_CONFIG.maxRetries) {
    try {
      await webhookHandler(payload);
      return { success: true };
    } catch (error) {
      attempt++;
      
      if (attempt >= RETRY_CONFIG.maxRetries) {
        // Log to dead letter queue
        await db.deadLetterQueue.insert({
          type: "webhook",
          payload: payload,
          error: error.message,
          attempts: attempt,
          createdAt: new Date()
        });
        
        // Alert team
        await sendAlert({
          type: "webhook_failed",
          message: `Webhook processing failed after ${attempt} attempts`,
          error: error.message,
          payload: payload
        });
        
        throw error;
      }
      
      // Wait before retry
      await sleep(delay);
      delay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelay);
    }
  }
}
```

## GHL API Rate Limiting

```javascript
const GHL_RATE_LIMIT = {
  requestsPerSecond: 10,
  requestsPerMinute: 100
};

class GHLApiClient {
  constructor() {
    this.requestQueue = [];
    this.requestsThisSecond = 0;
    this.requestsThisMinute = 0;
  }
  
  async request(method, endpoint, data) {
    // Wait if rate limited
    while (this.requestsThisSecond >= GHL_RATE_LIMIT.requestsPerSecond) {
      await sleep(100);
    }
    
    while (this.requestsThisMinute >= GHL_RATE_LIMIT.requestsPerMinute) {
      await sleep(1000);
    }
    
    this.requestsThisSecond++;
    this.requestsThisMinute++;
    
    // Reset counters
    setTimeout(() => this.requestsThisSecond--, 1000);
    setTimeout(() => this.requestsThisMinute--, 60000);
    
    // Make request
    const response = await fetch(`${GHL_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    if (response.status === 429) {
      // Rate limited - wait and retry
      const retryAfter = response.headers.get('Retry-After') || 60;
      await sleep(retryAfter * 1000);
      return this.request(method, endpoint, data);
    }
    
    return response.json();
  }
}
```

---

# 15. LOVABLE LANDING PAGE REQUIREMENTS

## PURL Landing Page Specification

### URL Structure
```
https://offers.hillnissan.com/vip/{campaign_id}?
  fn={first_name}&
  ln={last_name}&
  vy={vehicle_year}&
  vm={vehicle_make}&
  vmo={vehicle_model}&
  e={email_encoded}&
  p={phone_encoded}
```

### Page Components

```jsx
// Lovable Component Structure
<VIPBuybackLandingPage>
  {/* Hero Section */}
  <Hero>
    <Headline>Your {vehicle_year} {vehicle_model} Is Worth More Than You Think</Headline>
    <Subheadline>Get a premium cash offer in 15 minutes</Subheadline>
    <TrustBadges>
      <Badge>VIP Exclusive Offer</Badge>
      <Badge>Expires Friday</Badge>
      <Badge>No Obligation</Badge>
    </TrustBadges>
  </Hero>

  {/* Form Section */}
  <LeadForm prefilled={urlParams}>
    <Input name="first_name" label="First Name" required prefilled />
    <Input name="last_name" label="Last Name" />
    <Input name="email" label="Email" type="email" required />
    <Input name="phone" label="Phone" type="tel" required prefilled />
    <Input name="vehicle_year" label="Vehicle Year" required prefilled />
    <Select name="vehicle_make" label="Make" required prefilled />
    <Select name="vehicle_model" label="Model" required prefilled />
  </LeadForm>

  {/* CTA Section */}
  <CTASection>
    <PrimaryButton onClick={startVideoCall}>
      <VideoIcon /> Talk to Maria Now
    </PrimaryButton>
    <SecondaryButton onClick={requestCallback}>
      <PhoneIcon /> Get a Call Back
    </SecondaryButton>
  </CTASection>

  {/* Social Proof */}
  <SocialProof>
    <Stat>5,000+ Vehicles Purchased</Stat>
    <Stat>98% Customer Satisfaction</Stat>
    <Reviews />
  </SocialProof>

  {/* FAQ */}
  <FAQ items={buybackFAQs} />

  {/* Footer */}
  <Footer>
    <DealerInfo>Hill Nissan | Address | Hours</DealerInfo>
    <Legal>Privacy Policy | Terms</Legal>
  </Footer>
</VIPBuybackLandingPage>
```

### API Integration

```javascript
// Lovable API calls

// 1. On form submit
async function handleFormSubmit(formData) {
  // Validate
  if (!validateForm(formData)) return;
  
  // Send to backend
  const response = await fetch(`${API_URL}/api/qr-scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...formData,
      campaign_id: getCampaignIdFromUrl(),
      source: 'qr_scan',
      location_id: process.env.GHL_LOCATION_ID
    })
  });
  
  const data = await response.json();
  
  return data;
}

// 2. Start video call (Tavus)
async function startVideoCall(contactData) {
  const response = await fetch(`${API_URL}/api/tavus/start-conversation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  
  const { session_url } = await response.json();
  
  // Redirect to Tavus session
  window.location.href = session_url;
}

// 3. Request callback (Retell)
async function requestCallback(contactData) {
  const response = await fetch(`${API_URL}/api/retell/start-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...contactData,
      call_type: 'callback_requested'
    })
  });
  
  // Show confirmation
  showConfirmation("Maria will call you shortly!");
}
```

---

# 16. SECURITY & AUTHENTICATION

## API Authentication

### GHL Private Integration Token
```javascript
// Store in environment variables
GHL_PRIVATE_TOKEN=pit_xxxxxxxxxxxxxxxx
GHL_LOCATION_ID=location_xxxxxxxx

// Use in requests
const headers = {
  'Authorization': `Bearer ${process.env.GHL_PRIVATE_TOKEN}`,
  'Version': '2021-07-28',
  'Content-Type': 'application/json'
};
```

### Webhook Signature Verification

```javascript
// GHL Webhook Verification
function verifyGHLWebhook(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.GHL_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Retell Webhook Verification
function verifyRetellWebhook(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RETELL_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}

// Tavus Webhook Verification
function verifyTavusWebhook(payload, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.TAVUS_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}
```

### API Key Rotation
```javascript
// Scheduled key rotation (monthly)
async function rotateApiKeys() {
  // 1. Generate new GHL token
  const newGHLToken = await ghl.regenerateToken();
  
  // 2. Update in secrets manager
  await secretsManager.update('GHL_PRIVATE_TOKEN', newGHLToken);
  
  // 3. Update environment
  process.env.GHL_PRIVATE_TOKEN = newGHLToken;
  
  // 4. Log rotation
  await audit.log('api_key_rotated', { service: 'ghl' });
}
```

---

# 17. DEPLOYMENT CHECKLIST

## Pre-Launch Checklist

### GHL Setup
- [ ] Create GHL sub-account for dealership
- [ ] Create all custom fields (Section 3)
- [ ] Create VIP Buyback pipeline with stages (Section 4)
- [ ] Create VIP Buyback calendar
- [ ] Create email templates (confirmation, reminder, no-show)
- [ ] Set up Private Integration token
- [ ] Configure webhook subscriptions
- [ ] Test contact creation via API
- [ ] Test appointment creation via API
- [ ] Test opportunity creation via API

### Tavus Setup
- [ ] Create Maria replica (or use existing rc2146c13e81)
- [ ] Configure system prompt (from maria-vip-buyback-agent.md)
- [ ] Configure conversational context
- [ ] Configure TTS (Cartesia/Jacqueline)
- [ ] Configure STT settings
- [ ] Configure perception (Raven-0)
- [ ] Set up webhook URL
- [ ] Test conversation flow
- [ ] Test appointment extraction from transcript

### Retell Setup
- [ ] Create Maria agent (multi-prompt)
- [ ] Configure all prompt states (from maria-retell-voice-agent.md)
- [ ] Configure post-call analysis fields
- [ ] Configure voice settings
- [ ] Set up webhook URL
- [ ] Purchase/configure phone number
- [ ] Test inbound call flow
- [ ] Test outbound call flow
- [ ] Test post-call data extraction

### Antigravity Backend
- [ ] Deploy backend to production
- [ ] Configure all environment variables
- [ ] Set up database (PostgreSQL/Supabase)
- [ ] Configure webhook endpoints
- [ ] Set up cron jobs (reminders, analytics)
- [ ] Test GHL API integration
- [ ] Test Tavus API integration
- [ ] Test Retell API integration
- [ ] Set up error monitoring (Sentry)
- [ ] Set up logging (LogRocket/Datadog)
- [ ] Configure rate limiting
- [ ] Set up dead letter queue

### Lovable Landing Page
- [ ] Build PURL landing page
- [ ] Configure URL parameter parsing
- [ ] Integrate with backend API
- [ ] Test form submission
- [ ] Test video call launch
- [ ] Test callback request
- [ ] Mobile responsiveness testing
- [ ] Load testing
- [ ] SEO/meta tags
- [ ] Deploy to production domain

### Campaign Setup
- [ ] Create campaign in system
- [ ] Upload contact list to GHL
- [ ] Generate PURLs for each contact
- [ ] Create mailer design with QR codes
- [ ] Test end-to-end flow
- [ ] Set offer expiration date

### Monitoring & Alerts
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Set up daily analytics email
- [ ] Create real-time dashboard
- [ ] Test all alert triggers

---

## Environment Variables

```bash
# GHL
GHL_PRIVATE_TOKEN=pit_xxxxxxxxxxxxxxxx
GHL_LOCATION_ID=location_xxxxxxxx
GHL_CALENDAR_ID=calendar_xxxxxxxx
GHL_PIPELINE_ID=pipeline_xxxxxxxx
GHL_WEBHOOK_SECRET=secret_xxxxxxxx

# Tavus
TAVUS_API_KEY=tvs_xxxxxxxxxxxxxxxx
TAVUS_REPLICA_ID=rc2146c13e81
TAVUS_WEBHOOK_SECRET=secret_xxxxxxxx

# Retell
RETELL_API_KEY=key_xxxxxxxxxxxxxxxx
RETELL_MARIA_AGENT_ID=agent_xxxxxxxx
RETELL_CALLER_ID=+1xxxxxxxxxx
RETELL_WEBHOOK_SECRET=secret_xxxxxxxx

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Email Templates (GHL template IDs)
APPOINTMENT_CONFIRMATION_TEMPLATE=template_xxxxxxxx
APPOINTMENT_REMINDER_TEMPLATE=template_xxxxxxxx
NO_SHOW_EMAIL_TEMPLATE=template_xxxxxxxx
OFFER_EXPIRING_TEMPLATE=template_xxxxxxxx

# Workflows (GHL workflow IDs)
APPOINTMENT_REMINDER_WORKFLOW_ID=workflow_xxxxxxxx
SOFT_NO_NURTURE_WORKFLOW_ID=workflow_xxxxxxxx
LOST_DEAL_FOLLOWUP_WORKFLOW_ID=workflow_xxxxxxxx
POST_SALE_NURTURE_WORKFLOW_ID=workflow_xxxxxxxx

# General
API_BASE_URL=https://api.voxaris.io
NODE_ENV=production
```

---

# SUMMARY

This document provides a complete, production-ready integration architecture for:

1. **12 automated workflows** covering the entire customer journey
2. **Complete GHL data model** with 40+ custom fields
3. **Full pipeline configuration** with 12 stages
4. **All webhook handlers** for GHL, Tavus, and Retell
5. **API specifications** for the Antigravity backend
6. **Post-call data sync** logic
7. **Appointment booking flow** with calendar integration
8. **Follow-up automation** for all scenarios
9. **Analytics & reporting** framework
10. **Error handling & retry logic**
11. **Landing page requirements** for Lovable
12. **Security & authentication** best practices
13. **Complete deployment checklist**

This is the blueprint for a top 1% integration. Execute it step by step.

---

**Document Version:** 1.0
**Last Updated:** January 25, 2026
**Author:** Claude (for Voxaris/Ethan)
