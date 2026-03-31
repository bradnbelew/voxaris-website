import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PhoneOff,
  Clock,
  Users,
  AlertTriangle,
  X,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Navbar,
  Hero,
  Footer,
} from '@/components/marketing';

import { useState } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>V·TEAMS by Voxaris | AI Sales Team for Inbound Calls</title>
        <meta name="description" content="V·TEAMS — a coordinated squad of AI agents (receptionist, qualifier, specialist, closer) that answer your inbound calls, warm-transfer with full context, and book appointments 24/7." />
        <meta name="keywords" content="V·TEAMS, multi-agent AI, AI agent squad, warm transfer AI, coordinated AI agents, AI sales team, inbound call AI, appointment booking AI, lead qualification, AI phone agent" />
        <link rel="canonical" href="https://voxaris.io/" />
        <meta property="og:title" content="V·TEAMS by Voxaris | AI Sales Team for Inbound Calls" />
        <meta property="og:description" content="V·TEAMS — a coordinated squad of AI agents that answer your inbound calls, warm-transfer with full context, and book appointments 24/7." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="V·TEAMS by Voxaris | AI Sales Team for Inbound Calls" />
        <meta name="twitter:description" content="V·TEAMS — a coordinated squad of AI agents that answer your inbound calls, warm-transfer with full context, and book appointments 24/7." />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <Hero />
        <DealerProofStrip />
        <DirectMailIsBroken />
        <HowItWorks />
        <VideoDemo />
        <BusinessRealities />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ── Section: Dealer Social Proof Strip ───────────────────── */
function DealerProofStrip() {
  return (
    <section className="py-6 bg-carbon-950 border-y border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[
            { value: '$0.38', label: 'Cost per appointment' },
            { value: '24/7', label: 'Always on' },
            { value: '<2 min', label: 'Scan to booked' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2 text-center">
              <span className="text-lg sm:text-xl font-bold text-gold-500 font-display">{stat.value}</span>
              <span className="text-[11px] text-white/40">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section: Direct Mail Is Broken ──────────────────────── */
function DirectMailIsBroken() {
  const problems = [
    { problem: 'You send 10,000 mailers and get 12 calls', result: '0.1% response rate — most hit the trash before anyone reads them' },
    { problem: 'Customer scans a QR code and sees... a static page', result: 'No personalization, no urgency, no reason to stay. They bounce.' },
    { problem: 'Your BDC can\'t follow up fast enough', result: 'Leads go cold within 5 minutes. By the time you call, they\'re gone.' },
    { problem: 'No way to track what actually works', result: 'You don\'t know which mailers converted, which vehicles drove interest, or which zip codes respond.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">The Problem</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display leading-tight">
            Your direct mail isn't working
            <br className="hidden sm:block" />
            <span className="text-carbon-400">because it can't talk back.</span>
          </h2>
          <p className="max-w-2xl text-[16px] text-carbon-500 leading-[1.8]">
            Dealerships spend $50,000+ per year on mailers that end up in recycling bins. The ones that do get scanned? They land on a generic page with no follow-up. Talking Postcards change everything.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {problems.map((item, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-2xl bg-white border border-carbon-200 hover:border-carbon-300 hover:shadow-sm transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-3 h-3 text-red-500" />
                </div>
                <p className="text-[15px] font-medium text-carbon-800">{item.problem}</p>
              </div>
              <p className="text-[13px] text-carbon-400 ml-9">{item.result}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: How Talking Postcards Work ─────────────────── */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Personalized mailer hits their mailbox',
      desc: 'Each postcard is printed with the customer\'s name, their vehicle, and a unique QR code. It feels like a letter, not a mass blast.',
      color: 'text-blue-500',
    },
    {
      num: '02',
      title: 'They scan the QR and meet their AI agent',
      desc: 'A photorealistic video agent greets them by name, references their exact car, and starts a real conversation — in under 3 seconds.',
      color: 'text-gold-500',
    },
    {
      num: '03',
      title: 'The agent books the appraisal',
      desc: 'She checks your calendar, picks a time, confirms the appointment, and texts them a confirmation — all in under 2 minutes.',
      color: 'text-emerald-500',
    },
    {
      num: '04',
      title: 'Everything lands in your CRM',
      desc: 'Contact created, notes attached, transcript logged, appointment synced. Your team sees it before the customer even drives in.',
      color: 'text-rose-500',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-20" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
            From mailbox to booked appointment
            <br className="hidden sm:block" />
            <span className="text-white/60">in under 2 minutes.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className={`text-3xl font-bold ${step.color} opacity-40 mb-3 font-display`}>{step.num}</div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/talking-postcard">
            <Button
              size="default"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white px-6 text-[13px] font-semibold rounded-full shadow-gold-sm border border-gold-400/30 transition-all duration-300"
            >
              Try It Now
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section: Video Demo ───────────────────────────────────── */
function VideoDemo() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">See It In Action</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-4 font-display">
            Watch an AI agent handle a live call.
          </h2>
          <p className="text-lg text-carbon-400 max-w-2xl mx-auto">
            This is Julia — a Voxaris AI agent built for a dealership buyback campaign. Watch her qualify a lead, answer objections, and book the appointment in under 2 minutes.
          </p>
        </motion.div>

        <motion.div
          className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-carbon-200/60"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <video
            controls
            preload="metadata"
            poster="/julia-avatar-still.jpg"
            className="w-full aspect-video bg-carbon-900"
          >
            <source src="/julia-demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-carbon-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[
            'Real AI agent — not a recording',
            'Sub-second response time',
            'Books directly to CRM',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section: Built for Business Realities ─────────────────── */
function BusinessRealities() {
  const realities = [
    { icon: Clock, title: 'After-hours coverage', desc: 'Your team goes home at 6. V·TEAMS answers at midnight, on holidays, and during storms.' },
    { icon: Users, title: 'Overflow gaps', desc: 'When your team is slammed, V·TEAMS catches what falls through. No lead left behind.' },
    { icon: PhoneOff, title: 'Missed call recovery', desc: 'Every missed call gets answered. No voicemail purgatory. No "we\'ll call you back."' },
    { icon: AlertTriangle, title: 'Appointment no-shows', desc: 'Automatic confirmation and reminder sequences to reduce no-show rates.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">Business Realities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
            Built for the problems
            <br className="hidden sm:block" />
            <span className="text-carbon-400">every business actually has.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {realities.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex gap-4 p-6 rounded-2xl bg-white border border-carbon-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${i === 0 ? 'bg-gradient-to-br from-gold-600 to-gold-500 shadow-gold-sm' : 'bg-carbon-900 shadow-sm'}`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-carbon-900 mb-1">{item.title}</h3>
                <p className="text-carbon-400 text-[14px] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: FAQ ────────────────────────────────────────────── */
function FAQSection() {
  const faqs = [
    {
      q: 'How is this different from a single AI phone bot?',
      a: 'V·TEAMS uses four specialized agents that hand off with full context — the receptionist doesn\'t try to close, the closer doesn\'t try to qualify. Each agent does what it\'s built for.',
    },
    {
      q: 'Does V·TEAMS integrate with my CRM?',
      a: 'Yes. Every call writes contact records, intent, disposition, transcript summary, and appointment details to your CRM in real time. We support HubSpot, Salesforce, GoHighLevel, and custom integrations via API or webhook.',
    },
    {
      q: 'What happens if the caller wants a human?',
      a: 'V·TEAMS routes to your team immediately with a full summary of the conversation. The caller never has to start over. If no human is available, V·TEAMS captures the request and creates a priority follow-up task.',
    },
    {
      q: 'How long does implementation take?',
      a: 'Most businesses are live within days, not months. We configure V·TEAMS to your process, your hours, your routing rules, and your CRM. No IT project required.',
    },
    {
      q: 'What types of calls can V·TEAMS handle?',
      a: 'V·TEAMS handles inbound sales calls — inquiries, consultations, appointment booking, and lead qualification across any industry. We configure each squad to match your specific call flows, terminology, and booking process.',
    },
    {
      q: 'What if V·TEAMS gets a question it can\'t answer?',
      a: 'It says so honestly and moves to the best next step — either routing to a specialist agent, escalating to a human, or capturing the question for follow-up. It never invents facts, pricing, or policy details.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-carbon-400 uppercase tracking-[0.2em] mb-4 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">
            Common questions.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-carbon-200 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-carbon-50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-[15px] font-medium text-carbon-800 pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-carbon-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">
              <p className="text-[14px] text-carbon-500 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section: Final CTA ──────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-16 lg:py-24 bg-carbon-900">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white mb-5 font-display"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          Your competitors' mailers end up in the trash.
          <br className="hidden sm:block" />
          <span className="text-white/50">Yours books the appointment.</span>
        </motion.h2>

        <motion.p
          className="text-base text-white/50 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          See a Talking Postcard in action — live AI, real conversation, booked appointment.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease }}
        >
          <Link to="/talking-postcard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-12 px-8 text-[14px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500"
            >
              See It In Action
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/book-demo">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/50 hover:text-white hover:bg-white/[0.06] h-12 px-6 text-[14px] rounded-full border border-white/15 transition-all duration-300"
            >
              Book a Demo
            </Button>
          </Link>
        </motion.div>

        <motion.p
          className="mt-6 text-[13px] text-white/25"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          No credit card required &middot; Live in days &middot; Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
