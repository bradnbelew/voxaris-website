# n8n Workflows for Voxaris AI Agent

## Workflows Included

### 1. `tool-handler.json` - Appointment Booking During Calls

- **Webhook URL:** `/webhook/tavus-tool-handler`
- **Purpose:** Receives tool calls from Retell/Tavus agents
- **Functions:**
  - `check_availability` - Returns available appointment slots
  - `book_appointment` - Confirms the booking

**Setup:**

1. Import into n8n
2. Point your Tavus persona's tool webhook to this URL
3. Customize the availability logic (integrate Cal.com/Google Calendar)

---

### 2. `daily-followup.json` - Outbound Call Automation

- **Trigger:** Daily at 10:00 AM
- **Purpose:** Call leads who haven't scanned the QR code

**Setup:**

1. Import into n8n
2. Add your Retell API Key to the HTTP Header Auth credential
3. Replace `YOUR_RETELL_AGENT_ID` with your Olivia agent ID
4. Connect to your lead database (replace mock data)

---

### 3. `call-completed.json` - Log Call Outcomes

- **Webhook URL:** `/webhook/call-completed`
- **Purpose:** Receives Retell call-ended webhooks, logs outcomes

**Setup:**

1. Import into n8n
2. Configure Retell to send webhooks to this URL
3. Add database/CRM integration for logging

---

## How to Import

1. Open n8n Dashboard
2. Click **Workflows** → **Import from File**
3. Select the `.json` file
4. Activate the workflow

## Environment Variables Needed

```env
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=your_olivia_agent_id
TAVUS_WEBHOOK_URL=https://your-n8n.com/webhook/tavus-tool-handler
```

## Webhook URLs (after deployment)

| Workflow       | Endpoint                                          |
| -------------- | ------------------------------------------------- |
| Tool Handler   | `https://your-n8n.com/webhook/tavus-tool-handler` |
| Call Completed | `https://your-n8n.com/webhook/call-completed`     |
