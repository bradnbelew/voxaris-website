import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ChevronDown, Users, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

/* ── Plan data ── */
const PLANS = [
  {
    key: 'go',
    label: 'Go',
    priceMonthly: 289,
    setupFee: 249,
    minutesIncluded: 250,
    overageRate: 1.50,
    desc: 'Perfect for teams just getting started.',
    highlight: false,
    features: [
      '250 interview minutes / mo',
      'AI phone screening',
      'Candidate scoring & ranking',
      'Full interview transcripts',
      'Hiring dashboard access',
      '$1.50 / min overage',
    ],
  },
  {
    key: 'grow',
    label: 'Grow',
    priceMonthly: 769,
    setupFee: 499,
    minutesIncluded: 750,
    overageRate: 1.25,
    desc: 'For growing teams that need more volume.',
    highlight: false,
    features: [
      '750 interview minutes / mo',
      'AI phone screening',
      'Candidate scoring & ranking',
      'Full interview transcripts',
      'Hiring dashboard access',
      '$1.25 / min overage',
    ],
  },
  {
    key: 'scale',
    label: 'Scale',
    priceMonthly: 1499,
    setupFee: 749,
    minutesIncluded: 1500,
    overageRate: 1.00,
    desc: 'The most popular plan for high-volume hiring.',
    highlight: true,
    features: [
      '1,500 interview minutes / mo',
      'AI phone screening',
      'Candidate scoring & ranking',
      'Full interview transcripts',
      'Hiring dashboard access',
      '$1.00 / min overage',
    ],
  },
  {
    key: 'pro',
    label: 'Pro',
    priceMonthly: 2399,
    setupFee: 999,
    minutesIncluded: 2500,
    overageRate: 0.80,
    desc: 'For enterprises running continuous pipelines.',
    highlight: false,
    features: [
      '2,500 interview minutes / mo',
      'AI phone screening',
      'Candidate scoring & ranking',
      'Full interview transcripts',
      'Hiring dashboard access',
      '$0.80 / min overage',
    ],
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    priceMonthly: 3259,
    setupFee: 1499,
    minutesIncluded: 3500,
    overageRate: 0.70,
    desc: 'Maximum capacity, lowest per-minute rate.',
    highlight: false,
    features: [
      '3,500 interview minutes / mo',
      'AI phone screening',
      'Candidate scoring & ranking',
      'Full interview transcripts',
      'Hiring dashboard access',
      '$0.70 / min overage',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: 'What counts as an interview minute?',
    a: 'A minute is counted for each minute the AI agent is actively on a live call with a candidate. Unanswered calls, voicemails, and hold time do not count against your allowance.',
  },
  {
    q: 'What happens if I go over my included minutes?',
    a: "Overage minutes are billed at your plan's per-minute rate and added to your next invoice automatically. You'll see a usage warning in the dashboard as you approach your limit.",
  },
  {
    q: 'Is the setup fee charged every month?',
    a: 'No — the setup fee is a one-time charge when you start your subscription. It covers configuration, agent scripting, CRM integration, and white-glove onboarding.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Yes. Upgrade or downgrade at any time from the dashboard. Changes take effect at the start of your next billing cycle with no penalties.',
  },
  {
    q: 'Do unused minutes roll over?',
    a: "Included minutes reset each billing cycle and don't roll over to the next month. However, you'll never be charged for unused minutes.",
  },
  {
    q: 'Is there a long-term contract?',
    a: "No long-term contracts. Voxaris is month-to-month because we want you to stay for the results, not because you're locked in.",
  },
];

/* ══════════════════════════════════════════════
   Pricing Hero
══════════════════════════════════════════════ */
function PricingHero() {
  return (
    <section className="relative overflow-hidden bg-carbon-950 pt-32 pb-20">
      {/* Background bloom */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 60%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.1]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-7"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06]">
            <Users className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-[0.18em]">AI Hiring Agents</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-bold text-white leading-[1.05] tracking-[-0.03em] mb-5 font-display"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
        >
          Simple, transparent pricing.
          <br />
          <span className="text-white/35">No surprises.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-[17px] text-white/45 leading-[1.75] max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
        >
          Every plan includes AI phone screening, candidate scoring, full transcripts, and dashboard access.
          Pay only for the volume you need.
        </motion.p>

        {/* Metrics strip */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[12px] text-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {['< 5 min to first call', '10× more candidates screened', '80% time saved', 'Live in 48 hours'].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-px h-3 bg-white/[0.12]" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Plan Card
══════════════════════════════════════════════ */
function PlanCard({ plan, index }: { plan: typeof PLANS[number]; index: number }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.key }),
      });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        setLoading(false);
        return;
      }
      window.location.href = url;
    } catch {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <motion.div
      {...fadeUp(index * 0.07)}
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
        plan.highlight
          ? 'border-gold-500/30 bg-gold-500/[0.04] hover:border-gold-500/50'
          : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]'
      }`}
    >
      {/* Most Popular badge */}
      {plan.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-[10px] font-bold text-white uppercase tracking-[0.15em] shadow-gold-sm">
            <Zap className="w-2.5 h-2.5" />
            Most Popular
          </span>
        </div>
      )}

      {/* Plan name & price */}
      <div className="mb-5">
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block ${
          plan.highlight ? 'text-gold-400' : 'text-emerald-400/70'
        }`}>
          {plan.label}
        </span>
        <div className="flex items-end gap-1.5 mb-2">
          <span className="text-4xl font-bold text-white font-display leading-none">
            ${plan.priceMonthly.toLocaleString()}
          </span>
          <span className="text-white/35 text-sm mb-1">/mo</span>
        </div>
        <p className="text-[12px] text-white/30 leading-relaxed">{plan.desc}</p>
      </div>

      {/* Features */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-[13px] text-white/55">
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${plan.highlight ? 'text-gold-400' : 'text-emerald-400/70'}`} />
            {f}
          </li>
        ))}
      </ul>

      {/* Setup fee note */}
      <p className="text-[11px] text-white/20 mb-4">
        ${plan.setupFee.toLocaleString()} one-time setup
      </p>

      {/* CTA */}
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full h-11 text-[13px] font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 ${
          plan.highlight
            ? 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white border border-gold-400/30 shadow-gold-sm hover:shadow-gold hover:-translate-y-0.5'
            : 'bg-white/[0.06] hover:bg-white/[0.10] text-white/70 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
        }`}
      >
        {loading ? 'Loading…' : (
          <span className="flex items-center justify-center gap-2">
            Get started <ArrowRight className="w-3.5 h-3.5" />
          </span>
        )}
      </Button>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   Plans Grid
══════════════════════════════════════════════ */
function PlansSection() {
  return (
    <section className="bg-carbon-950 py-16 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLANS.map((plan, i) => (
            <PlanCard key={plan.key} plan={plan} index={i} />
          ))}
        </div>

        {/* Trust signals */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-wrap items-center justify-center gap-6 mt-10 text-[12px] text-white/25"
        >
          {['Secured by Stripe', 'White-glove onboarding', 'Cancel anytime', 'No hidden fees'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-white/15" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Comparison Strip
══════════════════════════════════════════════ */
function ComparisonStrip() {
  const included = [
    { icon: Users, label: 'AI phone screening', desc: 'Every applicant called within minutes' },
    { icon: BarChart3, label: 'Candidate scoring', desc: 'Scored by fit, experience & qualifications' },
    { icon: Zap, label: 'Full transcripts', desc: 'Every word, summarized by AI' },
  ];

  return (
    <section className="bg-carbon-900/60 border-y border-white/[0.04] py-14 px-6 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.p {...fadeUp()} className="text-center text-[11px] font-semibold text-white/25 uppercase tracking-[0.25em] mb-10">
          Included in every plan
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {included.map((item, i) => (
            <motion.div key={item.label} {...fadeUp(i * 0.08)} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-emerald-400/70" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white/70 mb-0.5">{item.label}</p>
                <p className="text-[12px] text-white/30 leading-snug">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════ */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.03] transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[14px] font-medium text-white/70 pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-white/25 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-1">
              <p className="text-[13px] text-white/35 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  return (
    <section className="bg-carbon-950 py-20 px-6 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <span className="eyebrow text-white/25 mb-4 block">FAQ</span>
          <h2 className="text-3xl font-bold text-white font-display">Common questions.</h2>
        </motion.div>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.05)}>
              <FAQItem q={item.q} a={item.a} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Final CTA
══════════════════════════════════════════════ */
function PricingCTA() {
  return (
    <section className="bg-carbon-900/60 border-t border-white/[0.04] py-20 px-6 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 65%)' }}
        />
      </div>
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div {...fadeUp()}>
          <span className="eyebrow text-white/25 mb-5 block">Not sure which plan?</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
            See it live first.
          </h2>
          <p className="text-[15px] text-white/40 mb-9 leading-relaxed">
            Book a 30-minute demo and we'll walk you through the call flow, scoring, and dashboard with your actual job roles.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/book-demo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-13 px-9 text-[14px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5 w-full sm:w-auto"
                style={{ height: '52px' }}
              >
                Book a Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/hiring-agents">
              <Button
                size="lg"
                variant="ghost"
                className="text-white/40 hover:text-white hover:bg-white/[0.05] h-[52px] px-8 text-[14px] rounded-full border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 w-full sm:w-auto"
              >
                Learn how it works
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Page
══════════════════════════════════════════════ */
export function Pricing() {
  return (
    <div className="min-h-screen bg-carbon-950">
      <Helmet>
        <title>AI Hiring Agent Pricing | Voxaris</title>
        <meta name="description" content="Transparent pricing for AI phone interviewing. Plans from $289/mo with 250 included interview minutes. Screen every applicant automatically — no hidden fees." />
        <meta name="keywords" content="AI hiring agent pricing, AI interview cost, automated candidate screening pricing, Voxaris pricing" />
        <link rel="canonical" href="https://voxaris.io/pricing" />
        <meta property="og:title" content="AI Hiring Agent Pricing | Voxaris" />
        <meta property="og:description" content="Simple, transparent pricing. Plans from $289/mo. Screen every applicant by AI phone call — automatically." />
        <meta property="og:url" content="https://voxaris.io/pricing" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <PricingHero />
        <PlansSection />
        <ComparisonStrip />
        <FAQSection />
        <PricingCTA />
      </main>
      <Footer />
    </div>
  );
}
