import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  PhoneCall,
  PhoneOff,
  UserCheck,
  MessageSquare,
  CalendarCheck,
  Database,
  Clock,
  Users,
  ShieldCheck,
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
      <main>
        <Hero />
        <WhyOneBotFails />
        <MeetTheTeam />
        <HandoffFlow />
        <WhatGetsLogged />
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
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">The Problem</span>
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
              className="p-6 rounded-2xl bg-white border border-carbon-200 card-gold-hover"
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

/* ── Section: Meet the Team ─────────────────────────────────── */
function MeetTheTeam() {
  const agents = [
    {
      role: 'Receptionist',
      color: 'bg-emerald-500',
      icon: PhoneCall,
      purpose: 'First point of contact. Answers instantly, greets naturally, captures caller name, identifies department and intent, routes cleanly.',
      mustNot: 'Over-qualify, invent facts, or attempt to close.',
      success: 'Clean transfer with summary and extracted variables.',
    },
    {
      role: 'Qualifier',
      color: 'bg-blue-500',
      icon: UserCheck,
      purpose: 'Identifies sales intent, gathers requirements, timeline, budget, and decision-maker context. Determines if the caller is ready to book or needs specialist help.',
      mustNot: 'Ramble, repeat questions already answered, or hard-close prematurely.',
      success: 'Handoff to specialist or closer with full context.',
    },
    {
      role: 'Specialist',
      color: 'bg-amber-500',
      icon: MessageSquare,
      purpose: 'Handles consultative questions — process, availability, pricing context, service details. Reduces hesitation and moves the caller toward booking.',
      mustNot: 'Hallucinate details, pricing, or policies. Make up facts.',
      success: 'Resolves uncertainty and passes to closer with clear recommendation.',
    },
    {
      role: 'Closer',
      color: 'bg-rose-500',
      icon: CalendarCheck,
      purpose: 'Secures the appointment. Confirms date, time, contact details, and location. Explains what happens next. Triggers CRM sync and confirmation.',
      mustNot: 'Reopen discovery unnecessarily or overtalk once the buyer is ready.',
      success: 'Booked appointment or clear fallback outcome.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">The V·TEAMS Squad</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
            Four specialized agents.
            <br className="hidden sm:block" />
            <span className="text-carbon-400">One coordinated sales team.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[16px] text-carbon-500 leading-[1.8]">
            Each agent has a focused job, a clear handoff trigger, and access to everything the previous agent learned. No repeated questions. No dropped context. No dead ends.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.role}
              className="p-7 rounded-2xl bg-carbon-50 border border-carbon-200 card-gold-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${agent.color} flex items-center justify-center`}>
                  <agent.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-carbon-900 font-display">{agent.role}</h3>
              </div>
              <p className="text-[14px] text-carbon-600 leading-relaxed mb-4">{agent.purpose}</p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-[12px] text-carbon-500"><strong className="text-carbon-700">Success:</strong> {agent.success}</span>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span className="text-[12px] text-carbon-500"><strong className="text-carbon-700">Guardrail:</strong> {agent.mustNot}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Section: How the Handoff Works ─────────────────────────── */
function HandoffFlow() {
  const steps = [
    { step: '01', label: 'Call comes in', desc: 'Receptionist answers in under 5 seconds. Greets caller, captures name and intent.', arrow: true },
    { step: '02', label: 'Intent identified', desc: 'Qualifier gathers requirements, timeline, budget context. Determines readiness.', arrow: true },
    { step: '03', label: 'Questions resolved', desc: 'Specialist handles consultative questions about process, availability, next steps.', arrow: true },
    { step: '04', label: 'Appointment booked', desc: 'Closer confirms time, contact details, and location. CRM synced. Confirmation sent.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-20" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-gold-500/60 uppercase tracking-[0.2em] mb-4 block">The Handoff</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-display">
            Every transfer carries
            <br className="hidden sm:block" />
            <span className="text-white/40">full context. Zero repetition.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[16px] text-white/40 leading-[1.8]">
            Caller name, phone number, intent, service interest, appointment readiness, timeline, budget context, decision-maker status, conversation summary — all passed on every handoff.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              className="relative p-6 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="text-gold-500/30 text-[40px] font-bold font-display leading-none mb-4">{item.step}</div>
              <h3 className="text-white font-semibold text-[15px] mb-2">{item.label}</h3>
              <p className="text-white/40 text-[13px] leading-relaxed">{item.desc}</p>
              {item.arrow && (
                <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white/20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Context payload preview */}
        <motion.div
          className="mt-10 p-6 rounded-2xl bg-white/[0.03] border border-white/10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-[11px] text-white/30 uppercase tracking-widest mb-3">What gets passed on every transfer</div>
          <div className="flex flex-wrap gap-2">
            {['caller_name', 'phone_number', 'intent_primary', 'service_interest', 'appointment_intent', 'budget_context', 'decision_maker', 'timeline', 'notes_summary', 'disposition'].map((field) => (
              <span key={field} className="px-3 py-1 rounded-full bg-gold-500/[0.06] border border-gold-500/15 text-[11px] text-gold-200/50 font-mono">
                {field}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Section: What Gets Logged ──────────────────────────────── */
function WhatGetsLogged() {
  const logItems = [
    { icon: Database, label: 'Contact record', desc: 'Created or updated with every call' },
    { icon: Phone, label: 'Source: inbound call', desc: 'Channel tracked automatically' },
    { icon: MessageSquare, label: 'Full transcript', desc: 'Every word, every agent, timestamped' },
    { icon: UserCheck, label: 'Intent + disposition', desc: 'Sales, support, consultation, follow-up' },
    { icon: CalendarCheck, label: 'Appointment status', desc: 'Booked time, location, confirmed details' },
    { icon: Users, label: 'Squad path', desc: 'Which agents handled which stage' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">CRM Sync</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-6 font-display">
            Every call writes to your CRM
            <br className="hidden sm:block" />
            <span className="text-carbon-400">in real time. Not after.</span>
          </h2>
          <p className="max-w-2xl text-[16px] text-carbon-500 leading-[1.8]">
            Fields are staged during the call so a dropped connection never wipes the record. Successful calls, partial calls, and escalated calls all get logged with full detail.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {logItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="flex items-start gap-4 p-5 rounded-xl bg-carbon-50 border border-carbon-200"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-9 h-9 rounded-lg bg-carbon-900 flex items-center justify-center shrink-0 shadow-sm">
                <item.icon className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-carbon-800">{item.label}</div>
                <div className="text-[12px] text-carbon-400">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
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
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">Business Realities</span>
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
              <div className="w-10 h-10 rounded-xl bg-carbon-900 flex items-center justify-center shrink-0 shadow-sm">
                <item.icon className="w-5 h-5 text-gold-400" />
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
      a: 'Most AI phone systems use one agent for everything. V·TEAMS uses four specialized agents that hand off to each other with full context — like a real sales team. The receptionist doesn\'t try to close. The closer doesn\'t try to qualify. Each agent does what it\'s built for.',
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
          <span className="text-[11px] font-semibold text-gold-600 uppercase tracking-[0.2em] mb-4 block">FAQ</span>
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
      >
        <span className="text-[15px] font-medium text-carbon-800 pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-carbon-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <p className="text-[14px] text-carbon-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ── Section: Final CTA ──────────────────────────────────────── */
function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-carbon-900 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-20" />
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
          <span className="text-white/40">Start booking appointments with V·TEAMS.</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/40 mb-10 max-w-xl mx-auto"
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
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-500/50" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
