import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/mcp/ghl
 *
 * Remote MCP server that exposes GoHighLevel tools to Claude.
 * Uses Private Integration Token (PIT) for auth — no OAuth needed.
 * Implements Streamable HTTP transport (MCP protocol 2025-03-26).
 */

const GHL_TOKEN = process.env.GHL_ACCESS_TOKEN || '';
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || '';
const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_HEADERS = {
  Authorization: `Bearer ${GHL_TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

// ── MCP Tool Definitions ──

const TOOLS = [
  {
    name: 'search_contacts',
    description: 'Search for contacts in GoHighLevel by name, email, phone, or tag. Returns matching contacts with their details.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query — name, email, or phone number' },
        tag: { type: 'string', description: 'Filter by tag name (e.g., "buyback-postcard")' },
        limit: { type: 'number', description: 'Max results to return (default 20, max 100)' },
      },
    },
  },
  {
    name: 'get_contact',
    description: 'Get full details for a specific contact by their GHL contact ID.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string', description: 'The GHL contact ID' },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'create_contact',
    description: 'Create a new contact in GoHighLevel.',
    inputSchema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Tags to apply' },
        source: { type: 'string', description: 'Lead source (e.g., "Website", "Postcard")' },
      },
      required: ['firstName'],
    },
  },
  {
    name: 'update_contact',
    description: 'Update an existing contact. Only include fields you want to change.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string', description: 'The GHL contact ID to update' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'add_contact_tags',
    description: 'Add tags to an existing contact without removing existing tags.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' }, description: 'Tags to add' },
      },
      required: ['contact_id', 'tags'],
    },
  },
  {
    name: 'add_contact_note',
    description: 'Add a note to a contact. Great for logging interactions, call summaries, or status updates.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string' },
        body: { type: 'string', description: 'The note content (supports markdown)' },
      },
      required: ['contact_id', 'body'],
    },
  },
  {
    name: 'list_pipelines',
    description: 'List all sales pipelines and their stages in the location.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_opportunities',
    description: 'Search opportunities (deals) in a pipeline.',
    inputSchema: {
      type: 'object',
      properties: {
        pipeline_id: { type: 'string', description: 'Pipeline ID to search in' },
        stage_id: { type: 'string', description: 'Filter by specific stage' },
        status: { type: 'string', enum: ['open', 'won', 'lost', 'abandoned'], description: 'Filter by status' },
        query: { type: 'string', description: 'Search by contact name or opportunity name' },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
    },
  },
  {
    name: 'create_opportunity',
    description: 'Create a new opportunity (deal) in a pipeline.',
    inputSchema: {
      type: 'object',
      properties: {
        pipeline_id: { type: 'string' },
        stage_id: { type: 'string' },
        contact_id: { type: 'string' },
        name: { type: 'string', description: 'Opportunity name' },
        monetary_value: { type: 'number', description: 'Deal value in dollars' },
        status: { type: 'string', enum: ['open', 'won', 'lost', 'abandoned'] },
      },
      required: ['pipeline_id', 'contact_id', 'name'],
    },
  },
  {
    name: 'list_conversations',
    description: 'List recent conversations (messages) for a contact.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string', description: 'Contact ID to get conversations for' },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'send_message',
    description: 'Send a message to a contact via SMS or email.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string' },
        type: { type: 'string', enum: ['SMS', 'Email'], description: 'Message type' },
        message: { type: 'string', description: 'Message body' },
        subject: { type: 'string', description: 'Email subject (required for Email type)' },
      },
      required: ['contact_id', 'type', 'message'],
    },
  },
  {
    name: 'list_tasks',
    description: 'List tasks for a contact.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string' },
      },
      required: ['contact_id'],
    },
  },
  {
    name: 'create_task',
    description: 'Create a task/to-do for a contact.',
    inputSchema: {
      type: 'object',
      properties: {
        contact_id: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        dueDate: { type: 'string', description: 'ISO 8601 date' },
      },
      required: ['contact_id', 'title'],
    },
  },
  {
    name: 'get_calendar_appointments',
    description: 'Get appointments from the calendar for a date range.',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'string', description: 'Start date in ISO format (e.g., 2026-03-19)' },
        endDate: { type: 'string', description: 'End date in ISO format' },
        calendarId: { type: 'string', description: 'Specific calendar ID (optional)' },
      },
      required: ['startDate', 'endDate'],
    },
  },
];

// ── GHL API Helpers ──

async function ghlFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = `${GHL_BASE}${path}`;
  const resp = await fetch(url, {
    ...options,
    headers: { ...GHL_HEADERS, ...(options.headers || {}) },
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`GHL ${resp.status}: ${text.slice(0, 300)}`);
  }
  return resp.json();
}

// ── Tool Execution ──

async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  switch (name) {
    case 'search_contacts': {
      const params = new URLSearchParams({ locationId: GHL_LOCATION_ID });
      if (args.query) params.set('query', args.query);
      if (args.limit) params.set('limit', String(Math.min(args.limit || 20, 100)));
      const data = await ghlFetch(`/contacts/?${params}`);
      const contacts = data.contacts || [];
      if (contacts.length === 0) return 'No contacts found matching your search.';
      return contacts.map((c: any) =>
        `**${c.firstName || ''} ${c.lastName || ''}** (ID: ${c.id})\n` +
        `  Email: ${c.email || 'N/A'} | Phone: ${c.phone || 'N/A'}\n` +
        `  Tags: ${(c.tags || []).join(', ') || 'none'}\n` +
        `  Source: ${c.source || 'N/A'} | Created: ${c.dateAdded || 'N/A'}`
      ).join('\n\n');
    }

    case 'get_contact': {
      const data = await ghlFetch(`/contacts/${args.contact_id}`);
      const c = data.contact || data;
      return JSON.stringify(c, null, 2);
    }

    case 'create_contact': {
      const body: any = { locationId: GHL_LOCATION_ID };
      for (const key of ['firstName', 'lastName', 'email', 'phone', 'tags', 'source']) {
        if (args[key]) body[key] = args[key];
      }
      const data = await ghlFetch('/contacts/', { method: 'POST', body: JSON.stringify(body) });
      return `Contact created: ${data.contact?.id || 'unknown'} — ${args.firstName} ${args.lastName || ''}`;
    }

    case 'update_contact': {
      const { contact_id, ...updates } = args;
      const data = await ghlFetch(`/contacts/${contact_id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return `Contact ${contact_id} updated successfully.`;
    }

    case 'add_contact_tags': {
      const contact = await ghlFetch(`/contacts/${args.contact_id}`);
      const existing = contact.contact?.tags || [];
      const merged = [...new Set([...existing, ...args.tags])];
      await ghlFetch(`/contacts/${args.contact_id}`, {
        method: 'PUT',
        body: JSON.stringify({ tags: merged }),
      });
      return `Tags added to ${args.contact_id}: ${args.tags.join(', ')}. Total tags: ${merged.join(', ')}`;
    }

    case 'add_contact_note': {
      await ghlFetch(`/contacts/${args.contact_id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ body: args.body, userId: null }),
      });
      return `Note added to contact ${args.contact_id}.`;
    }

    case 'list_pipelines': {
      const data = await ghlFetch(`/opportunities/pipelines?locationId=${GHL_LOCATION_ID}`);
      const pipelines = data.pipelines || [];
      if (pipelines.length === 0) return 'No pipelines found.';
      return pipelines.map((p: any) =>
        `**${p.name}** (ID: ${p.id})\n` +
        `  Stages: ${(p.stages || []).map((s: any) => `${s.name} (${s.id})`).join(' → ')}`
      ).join('\n\n');
    }

    case 'search_opportunities': {
      const params = new URLSearchParams({ locationId: GHL_LOCATION_ID });
      if (args.pipeline_id) params.set('pipelineId', args.pipeline_id);
      if (args.stage_id) params.set('pipelineStageId', args.stage_id);
      if (args.status) params.set('status', args.status);
      if (args.query) params.set('q', args.query);
      params.set('limit', String(args.limit || 20));
      const data = await ghlFetch(`/opportunities/search?${params}`);
      const opps = data.opportunities || [];
      if (opps.length === 0) return 'No opportunities found.';
      return opps.map((o: any) =>
        `**${o.name}** — $${o.monetaryValue || 0} (${o.status})\n` +
        `  Contact: ${o.contact?.name || 'N/A'} | Stage: ${o.pipelineStageId}\n` +
        `  ID: ${o.id}`
      ).join('\n\n');
    }

    case 'create_opportunity': {
      const body: any = { locationId: GHL_LOCATION_ID, ...args };
      body.pipelineId = args.pipeline_id;
      body.pipelineStageId = args.stage_id;
      body.contactId = args.contact_id;
      body.monetaryValue = args.monetary_value;
      delete body.pipeline_id; delete body.stage_id; delete body.contact_id; delete body.monetary_value;
      const data = await ghlFetch('/opportunities/', { method: 'POST', body: JSON.stringify(body) });
      return `Opportunity created: ${data.opportunity?.id || 'unknown'} — ${args.name}`;
    }

    case 'list_conversations': {
      const data = await ghlFetch(`/conversations/search?locationId=${GHL_LOCATION_ID}&contactId=${args.contact_id}&limit=${args.limit || 20}`);
      const convos = data.conversations || [];
      if (convos.length === 0) return 'No conversations found for this contact.';
      return convos.map((c: any) =>
        `**${c.type || 'Message'}** (${c.dateAdded || 'N/A'})\n` +
        `  Last: ${c.lastMessageBody?.slice(0, 100) || 'N/A'}\n` +
        `  ID: ${c.id}`
      ).join('\n\n');
    }

    case 'send_message': {
      const body: any = {
        type: args.type,
        contactId: args.contact_id,
        message: args.message,
      };
      if (args.type === 'Email' && args.subject) body.subject = args.subject;
      const data = await ghlFetch('/conversations/messages', { method: 'POST', body: JSON.stringify(body) });
      return `Message sent via ${args.type} to contact ${args.contact_id}. Message ID: ${data.messageId || data.id || 'sent'}`;
    }

    case 'list_tasks': {
      const data = await ghlFetch(`/contacts/${args.contact_id}/tasks`);
      const tasks = data.tasks || [];
      if (tasks.length === 0) return 'No tasks found for this contact.';
      return tasks.map((t: any) =>
        `**${t.title}** (${t.completed ? 'Done' : 'Open'})\n` +
        `  Due: ${t.dueDate || 'N/A'} | ${t.description || ''}\n` +
        `  ID: ${t.id}`
      ).join('\n\n');
    }

    case 'create_task': {
      const body: any = {
        title: args.title,
        description: args.description || '',
        dueDate: args.dueDate || new Date(Date.now() + 86400000).toISOString(),
      };
      const data = await ghlFetch(`/contacts/${args.contact_id}/tasks`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return `Task created: "${args.title}" for contact ${args.contact_id}. ID: ${data.task?.id || 'created'}`;
    }

    case 'get_calendar_appointments': {
      const params = new URLSearchParams({
        locationId: GHL_LOCATION_ID,
        startDate: args.startDate,
        endDate: args.endDate,
      });
      if (args.calendarId) params.set('calendarId', args.calendarId);
      const data = await ghlFetch(`/calendars/events?${params}`);
      const events = data.events || [];
      if (events.length === 0) return 'No appointments found in this date range.';
      return events.map((e: any) =>
        `**${e.title || 'Appointment'}** — ${e.startTime || 'N/A'} to ${e.endTime || 'N/A'}\n` +
        `  Contact: ${e.contact?.name || e.contactId || 'N/A'}\n` +
        `  Status: ${e.appointmentStatus || 'N/A'} | ID: ${e.id}`
      ).join('\n\n');
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

// ── MCP Protocol Handler ──

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS for Claude
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://claude.ai', 'https://claude.com', 'https://www.claude.ai'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://claude.ai';

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, MCP-Protocol-Version, Mcp-Session-Id, Authorization, Last-Event-ID');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'DELETE') return res.status(200).end();
  if (req.method === 'GET') return res.status(405).json({ error: 'SSE not supported — use POST' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  if (!body || !body.jsonrpc) {
    return res.status(400).json({ error: 'Invalid JSON-RPC request' });
  }

  const { method, id, params } = body;

  // Handle batch requests
  if (Array.isArray(body)) {
    const results = [];
    for (const msg of body) {
      if (msg.method === 'notifications/initialized') continue;
      results.push(await handleMethod(msg.method, msg.id, msg.params));
    }
    return res.status(200).json(results.filter(Boolean));
  }

  // Notifications (no response needed)
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') {
    return res.status(200).json({ jsonrpc: '2.0', result: {} });
  }

  const result = await handleMethod(method, id, params);
  if (!result) return res.status(202).end();

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(result);
}

async function handleMethod(method: string, id: any, params: any): Promise<any> {
  switch (method) {
    case 'initialize': {
      const version = params?.protocolVersion || '2025-03-26';
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: version,
          capabilities: { tools: {} },
          serverInfo: {
            name: 'Voxaris GoHighLevel MCP',
            version: '1.0.0',
          },
        },
      };
    }

    case 'tools/list': {
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS },
      };
    }

    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};

      if (!GHL_TOKEN || !GHL_LOCATION_ID) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: 'Error: GHL credentials not configured. Set GHL_ACCESS_TOKEN and GHL_LOCATION_ID env vars.' }],
            isError: true,
          },
        };
      }

      try {
        const result = await executeTool(toolName, toolArgs);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: result }],
          },
        };
      } catch (err: any) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [{ type: 'text', text: `Error: ${err.message}` }],
            isError: true,
          },
        };
      }
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      };
  }
}
