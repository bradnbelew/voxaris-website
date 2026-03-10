import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  PhoneOff,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
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
      </Helmet>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WhyOneBotFails />
        <HandoffFlow />
        <BusinessRealities />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ── Section: Why One Bot Fails ─────────────────────────────── */
function WhyOneBotFails() {
  const failures = [
    { problem: 'One bot tries to greet AND qualify AND close', result: 'Confused, repetitive conversations that lose the caller' },
    { problem: 'No context passed when routing to a human', result: 'Caller repeats everything — frustration kills the deal' },
    { problem: 'Generic scripts for every caller intent', result: 'Hot leads get the same flow as support requests' },
    { problem: 'No escalation when confidence drops', result: 'Callers get stuck in a loop with no way out' },
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
            A single AI bot trying to do everything
            <br className="hidden sm:block" />
            <span className="text-carbon-400">breaks under real call volume.</span>
          </h2>
          <p className="max-w-2xl text-[16px] text-carbon-500 leading-[1.8]">
            Most AI phone systems use one agent for everything — greeting, qualifying, handling objections, routing, and closing. That's like having one employee run your entire sales floor. It doesn't work with humans, and it doesn't work with AI.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {failures.map((item, i) => (
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

/* ── Section: V·TEAMS Live Scene ────────────────────────────── */
function HandoffFlow() {
  const lanes = [
    {
      role: 'Receptionist',
      status: 'Complete',
      desc: 'Answered instantly, identified sales intent, captured caller details.',
      color: 'bg-emerald-500',
      borderColor: 'border-emerald-500/30',
      statusColor: 'text-emerald-400',
      active: true,
      live: false,
    },
    {
      role: 'Qualifier',
      status: 'Complete',
      desc: 'Confirmed vehicle interest, timing, financing intent, and urgency.',
      color: 'bg-blue-500',
      borderColor: 'border-blue-500/30',
      statusColor: 'text-blue-400',
      active: true,
      live: false,
    },
    {
      role: 'Specialist',
      status: 'Live now',
      desc: 'Handling trade-in questions and reducing hesitation before booking.',
      color: 'bg-amber-500',
      borderColor: 'border-amber-500/30',
      statusColor: 'text-amber-400',
      active: true,
      live: true,
    },
    {
      role: 'Closer',
      status: 'Ready',
      desc: 'Will confirm appointment time, store location, and sync to CRM.',
      color: 'bg-rose-500',
      borderColor: 'border-rose-500/30',
      statusColor: 'text-rose-400',
      active: false,
      live: false,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-20" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">

        {/* Section header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-4 block">Live Inbound Flow</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
            Watch a call move through
            <br className="hidden sm:block" />
            <span className="text-white/60">the entire squad in real time.</span>
          </h2>
        </motion.div>

        {/* V·TEAMS Card */}
        <motion.div
          className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          {/* Topbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium text-white/25 uppercase tracking-[0.15em]">Powered by</span>
                <span className="text-[13px] font-bold text-gold-500 tracking-wide">V·TEAMS</span>
              </div>
              <p className="text-[15px] font-semibold text-white">After-hours dealership sales call</p>
              <p className="text-[12px] text-white/30 mt-0.5">Northstar Auto Group · Orlando, FL · Active now</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Flow Grid */}
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {lanes.map((lane, i) => (
                <motion.div
                  key={lane.role}
                  className={`relative rounded-xl p-4 border transition-all duration-300 ${
                    lane.live
                      ? `bg-white/[0.06] ${lane.borderColor} shadow-[0_0_20px_rgba(245,158,11,0.06)]`
                      : lane.active
                        ? 'bg-white/[0.04] border-white/[0.08]'
                        : 'bg-white/[0.02] border-white/[0.05]'
                  }`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {/* Accent bar */}
                  <div className={`absolute top-0 left-4 right-4 h-[2px] rounded-b-full ${lane.color} ${lane.active ? 'opacity-60' : 'opacity-20'}`} />

                  <div className="flex items-center justify-between mb-3 mt-1">
                    <span className="text-[13px] font-semibold text-white">{lane.role}</span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      lane.live ? lane.statusColor : lane.active ? 'text-white/40' : 'text-white/20'
                    }`}>
                      {lane.status}
                    </span>
                  </div>
                  <p className={`text-[12px] leading-relaxed ${lane.active ? 'text-white/40' : 'text-white/20'}`}>
                    {lane.desc}
                  </p>

                  {/* Arrow between lanes (desktop) */}
                  {i < lanes.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-[10px] w-5 h-5 items-center justify-center z-10">
                      <span className={`text-[14px] ${lane.live ? 'text-amber-400/60 animate-pulse-soft' : 'text-white/15'}`}>→</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Timeline rail */}
            <motion.div
              className="mt-5 h-1 rounded-full bg-white/[0.06] overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 via-blue-500/70 to-amber-500/70"
                initial={{ width: '0%' }}
                whileInView={{ width: '68%' }}
                viewport={{ once: true }}
                transition={{ delay: 1.0, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-3 flex-1 min-w-0">
              {/* Signal chips */}
              <div className="flex flex-wrap gap-2">
                {['CRM synced', 'Transcript saved', 'Warm transfer preserved'].map((chip) => (
                  <span key={chip} className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-medium text-white/30 uppercase tracking-wider">
                    {chip}
                  </span>
                ))}
              </div>
              {/* Appointment confidence */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/25 uppercase tracking-wider shrink-0">Appointment confidence</span>
                <div className="flex-1 max-w-[120px] h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gold-500/60"
                    initial={{ width: '0%' }}
                    whileInView={{ width: '92%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2, duration: 1.0, ease }}
                  />
                </div>
                <span className="text-[12px] font-semibold text-gold-500/80">92%</span>
              </div>
            </div>

            {/* Metric card */}
            <div className="text-right shrink-0 pl-4">
              <span className="text-[10px] text-white/25 uppercase tracking-wider block">Answer time</span>
              <span className="text-[22px] font-bold text-white leading-none">&lt; 5s</span>
              <span className="text-[10px] text-white/20 block mt-0.5">24/7/365</span>
            </div>
          </div>
        </motion.div>

        {/* Context payload preview */}
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-[11px] text-white/30 uppercase tracking-widest mb-3">What gets passed on every transfer</div>
          <div className="flex flex-wrap gap-2">
            {['caller_name', 'phone_number', 'intent_primary', 'service_interest', 'appointment_intent', 'budget_context', 'decision_maker', 'timeline', 'notes_summary', 'disposition'].map((field) => (
              <span key={field} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-white/30 font-mono">
                {field}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA after the visualization */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/book-demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-12 px-8 text-[14px] font-semibold rounded-full shadow-gold-btn border border-gold-400/30 transition-all duration-500"
            >
              See This Live in a 15-Minute Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
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
    <section className="py-20 lg:py-28 bg-carbon-900 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          Stop losing leads to slow follow-up.
          <br className="hidden sm:block" />
          <span className="text-white/60">Start booking appointments with V·TEAMS.</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          See V·TEAMS handle a live call. 15 minutes. No pitch deck. Just a conversation about what this looks like for your business.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease }}
        >
          <Link to="/book-demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] transition-all duration-500 hover:-translate-y-0.5 border border-gold-400/30"
            >
              Book a Live Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/[0.06] h-14 px-8 text-[15px] font-medium rounded-full border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Hear a Live Call
            </Button>
          </Link>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-[14px] text-white/30">Or call our AI agent now:</span>
          <a href="tel:+14077594100" className="text-[15px] font-semibold text-white/70 hover:text-white transition-colors">
            (407) 759-4100
          </a>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 mt-10 text-[13px] text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {['No credit card required', 'Live in days, not months', 'Cancel anytime'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/50" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
