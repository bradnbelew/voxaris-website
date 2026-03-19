import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/mcp/sendblue
 *
 * Remote MCP server exposing Sendblue iMessage/SMS tools to Claude.
 * Implements Streamable HTTP transport (MCP protocol 2025-03-26).
 */

const SB_KEY = process.env.SENDBLUE_API_KEY || '';
const SB_SECRET = process.env.SENDBLUE_API_SECRET || '';
const SB_FROM = process.env.SENDBLUE_FROM_NUMBER || '+13053369541';
const SB_HEADERS = {
  'sb-api-key-id': SB_KEY,
  'sb-api-secret-key': SB_SECRET,
  'Content-Type': 'application/json',
  'User-Agent': 'Voxaris/1.0',
};

const TOOLS = [
  {
    name: 'send_imessage',
    description: 'Send an iMessage (blue bubble) or SMS to a phone number. Supports text, images, and videos.',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'string', description: 'Phone number in E.164 format (e.g., +14075551234)' },
        content: { type: 'string', description: 'Message text to send' },
        media_url: { type: 'string', description: 'URL of image or video to attach (optional)' },
        send_style: { type: 'string', enum: ['celebration', 'shooting_star', 'fireworks', 'lasers', 'love', 'confetti', 'balloons', 'spotlight', 'echo', 'invisible', 'gentle', 'loud', 'slam'], description: 'iMessage send effect (optional)' },
      },
      required: ['number', 'content'],
    },
  },
  {
    name: 'send_group_message',
    description: 'Send a group iMessage to multiple phone numbers.',
    inputSchema: {
      type: 'object',
      properties: {
        numbers: { type: 'array', items: { type: 'string' }, description: 'Array of phone numbers in E.164 format' },
        content: { type: 'string', description: 'Message text' },
        media_url: { type: 'string', description: 'URL of image or video to attach (optional)' },
      },
      required: ['numbers', 'content'],
    },
  },
  {
    name: 'get_messages',
    description: 'Get message history for a specific phone number.',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'string', description: 'Phone number to get messages for (E.164)' },
        limit: { type: 'number', description: 'Number of messages to return (default 50)' },
      },
      required: ['number'],
    },
  },
  {
    name: 'evaluate_service',
    description: 'Check if a phone number can receive iMessage (blue bubble) or will fall back to SMS (green bubble).',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'string', description: 'Phone number to evaluate (E.164)' },
      },
      required: ['number'],
    },
  },
  {
    name: 'send_typing_indicator',
    description: 'Show a typing indicator (three dots) to a contact. Creates a natural feel before sending a message.',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'string', description: 'Phone number to show typing indicator to (E.164)' },
      },
      required: ['number'],
    },
  },
];

async function sbFetch(path: string, options: RequestInit = {}): Promise<any> {
  const resp = await fetch(`https://api.sendblue.co/api${path}`, {
    ...options,
    headers: { ...SB_HEADERS, ...(options.headers || {}) },
    signal: AbortSignal.timeout(15_000),
  });
  return resp.json();
}

async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  switch (name) {
    case 'send_imessage': {
      const body: any = { number: args.number, content: args.content, from_number: SB_FROM };
      if (args.media_url) body.media_url = args.media_url;
      if (args.send_style) body.send_style = args.send_style;
      const res = await sbFetch('/send-message', { method: 'POST', body: JSON.stringify(body) });
      if (res.status === 'QUEUED' || res.status === 'SUCCESS') {
        return `iMessage sent to ${args.number}: "${args.content.slice(0, 50)}${args.content.length > 50 ? '...' : ''}"`;
      }
      return `Send failed: ${res.message || JSON.stringify(res)}`;
    }

    case 'send_group_message': {
      const body: any = { numbers: args.numbers, content: args.content, from_number: SB_FROM };
      if (args.media_url) body.media_url = args.media_url;
      const res = await sbFetch('/send-group-message', { method: 'POST', body: JSON.stringify(body) });
      if (res.status === 'QUEUED' || res.status === 'SUCCESS') {
        return `Group message sent to ${args.numbers.length} people: "${args.content.slice(0, 50)}..."`;
      }
      return `Send failed: ${res.message || JSON.stringify(res)}`;
    }

    case 'get_messages': {
      const res = await sbFetch(`/messages?number=${encodeURIComponent(args.number)}&limit=${args.limit || 50}`);
      const msgs = res.messages || [];
      if (msgs.length === 0) return `No messages found for ${args.number}.`;
      return msgs.map((m: any) =>
        `**${m.is_outbound ? 'Sent' : 'Received'}** (${m.date_sent || 'N/A'}): ${m.content || '[media]'}`
      ).join('\n');
    }

    case 'evaluate_service': {
      const res = await sbFetch('/evaluate-service', { method: 'POST', body: JSON.stringify({ number: args.number }) });
      return `${args.number}: ${res.is_imessage ? 'iMessage (blue bubble)' : 'SMS (green bubble)'}`;
    }

    case 'send_typing_indicator': {
      const res = await sbFetch('/send-typing-indicator', { method: 'POST', body: JSON.stringify({ number: args.number }) });
      return res.status === 'QUEUED' ? `Typing indicator sent to ${args.number}` : `Failed: ${res.message || 'unknown error'}`;
    }

    default:
      return `Unknown tool: ${name}`;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://claude.ai', 'https://claude.com', 'https://www.claude.ai'];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://claude.ai';

  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, MCP-Protocol-Version, Mcp-Session-Id, Authorization, Last-Event-ID');
  res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'DELETE') return res.status(200).end();
  if (req.method === 'GET') return res.status(405).json({ error: 'Use POST' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body;
  if (!body || !body.jsonrpc) return res.status(400).json({ error: 'Invalid JSON-RPC' });

  const { method, id, params } = body;

  if (method === 'notifications/initialized' || method === 'notifications/cancelled') {
    return res.status(200).json({ jsonrpc: '2.0', result: {} });
  }

  if (method === 'initialize') {
    return res.status(200).json({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: params?.protocolVersion || '2025-03-26',
        capabilities: { tools: {} },
        serverInfo: { name: 'Voxaris Sendblue MCP', version: '1.0.0' },
      },
    });
  }

  if (method === 'tools/list') {
    return res.status(200).json({ jsonrpc: '2.0', id, result: { tools: TOOLS } });
  }

  if (method === 'tools/call') {
    if (!SB_KEY || !SB_SECRET) {
      return res.status(200).json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: 'Error: Sendblue credentials not configured.' }], isError: true } });
    }
    try {
      const result = await executeTool(params?.name, params?.arguments || {});
      return res.status(200).json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: result }] } });
    } catch (err: any) {
      return res.status(200).json({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true } });
    }
  }

  return res.status(200).json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
}
