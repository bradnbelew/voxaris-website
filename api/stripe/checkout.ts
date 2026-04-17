import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia' as any,
});

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

  const priceIds = TIER_PRICE_IDS[plan];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.VITE_APP_URL ?? 'https://voxaris.io';

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    { price: priceIds.flatPriceId, quantity: 1 },
    { price: priceIds.overagePriceId },
    { price: priceIds.setupFeeId, quantity: 1 },
  ];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email ?? undefined,
      line_items: lineItems,
      metadata: { plan, plan_label: PLAN_LABELS[plan] },
      subscription_data: { metadata: { plan } },
      success_url: `${baseUrl}/pricing?success=1&plan=${plan}`,
      cancel_url: `${baseUrl}/pricing?canceled=1`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message ?? 'Failed to create checkout session' });
  }
}
