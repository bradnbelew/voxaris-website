import type { VercelRequest, VercelResponse } from '@vercel/node';

type PlanKey = 'go' | 'grow' | 'scale' | 'pro' | 'enterprise';

const TIER_PRICE_IDS: Record<PlanKey, { flatPriceId: string; overagePriceId: string; setupFeeId: string }> = {
  go: {
    flatPriceId: process.env.STRIPE_PRICE_GO_FLAT!,
    overagePriceId: process.env.STRIPE_PRICE_GO_OVERAGE!,
    setupFeeId: process.env.STRIPE_PRICE_GO_SETUP!,
  },
  grow: {
    flatPriceId: process.env.STRIPE_PRICE_GROW_FLAT!,
    overagePriceId: process.env.STRIPE_PRICE_GROW_OVERAGE!,
    setupFeeId: process.env.STRIPE_PRICE_GROW_SETUP!,
  },
  scale: {
    flatPriceId: process.env.STRIPE_PRICE_SCALE_FLAT!,
    overagePriceId: process.env.STRIPE_PRICE_SCALE_OVERAGE!,
    setupFeeId: process.env.STRIPE_PRICE_SCALE_SETUP!,
  },
  pro: {
    flatPriceId: process.env.STRIPE_PRICE_PRO_FLAT!,
    overagePriceId: process.env.STRIPE_PRICE_PRO_OVERAGE!,
    setupFeeId: process.env.STRIPE_PRICE_PRO_SETUP!,
  },
  enterprise: {
    flatPriceId: process.env.STRIPE_PRICE_ENTERPRISE_FLAT!,
    overagePriceId: process.env.STRIPE_PRICE_ENTERPRISE_OVERAGE!,
    setupFeeId: process.env.STRIPE_PRICE_ENTERPRISE_SETUP!,
  },
};

const PLAN_LABELS: Record<PlanKey, string> = {
  go: 'Go',
  grow: 'Grow',
  scale: 'Scale',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { plan, email } = req.body as { plan: PlanKey; email?: string };

  if (!plan || !TIER_PRICE_IDS[plan]) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const priceIds = TIER_PRICE_IDS[plan];
  const baseUrl = process.env.VITE_APP_URL ?? 'https://voxaris.io';

  const params = new URLSearchParams();
  params.append('mode', 'subscription');
  params.append('line_items[0][price]', priceIds.flatPriceId);
  params.append('line_items[0][quantity]', '1');
  params.append('line_items[1][price]', priceIds.overagePriceId);
  params.append('line_items[2][price]', priceIds.setupFeeId);
  params.append('line_items[2][quantity]', '1');
  params.append('metadata[plan]', plan);
  params.append('metadata[plan_label]', PLAN_LABELS[plan]);
  params.append('subscription_data[metadata][plan]', plan);
  params.append('success_url', `${baseUrl}/pricing?success=1&plan=${plan}`);
  params.append('cancel_url', `${baseUrl}/pricing?canceled=1`);
  if (email) params.append('customer_email', email);

  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await stripeRes.json() as { url?: string; error?: { message: string } };

    if (!stripeRes.ok) {
      console.error('Stripe API error:', session.error);
      return res.status(500).json({ error: session.error?.message ?? 'Failed to create checkout session' });
    }

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message ?? 'Failed to create checkout session' });
  }
}
