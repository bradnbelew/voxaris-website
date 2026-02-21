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

  try {
    const resp = await fetch(`https://api.apollo.io/api/v1/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...searchParams, api_key: apiKey }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Apollo API error', detail: data });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
