import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * POST /api/tools/apollo-search
 *
 * Proxy for Apollo.io people search API.
 * Runs on Vercel to bypass local Cloudflare blocking.
 */

const APOLLO_API_KEY = process.env.APOLLO_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = req.body?.api_key || APOLLO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Apollo API key not configured' });
  }

  const { endpoint = 'mixed_people/search', ...searchParams } = req.body || {};

  // Remove api_key and endpoint from searchParams before forwarding
  const { api_key: _ak, ...cleanParams } = searchParams;

  try {
    const resp = await fetch(`https://api.apollo.io/api/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({ ...cleanParams, api_key: apiKey }),
    });

    const text = await resp.text();

    // Try to parse as JSON
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(resp.status).json({
        error: 'Apollo returned non-JSON response',
        status: resp.status,
        body: text.slice(0, 500),
      });
    }

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Apollo API error', status: resp.status, detail: data });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
