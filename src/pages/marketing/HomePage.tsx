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
        <DealerProofStrip />
        <DirectMailIsBroken />
        <HowItWorks />
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
    <section className="py-10 bg-carbon-950 border-y border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <motion.div
            className="flex items-center gap-8 flex-wrap justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { value: '47', label: 'Appointments booked in week one' },
              { value: '6-12%', label: 'QR scan-to-engagement rate' },
              { value: '$0.38', label: 'Cost per appointment' },
              { value: '24/7', label: 'AI agent never sleeps' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl font-bold text-gold-500 font-display">{stat.value}</div>
                <div className="text-[11px] text-white/40 max-w-[120px]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
{/* Trusted by section removed */}
        </div>
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
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/talking-postcard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-12 px-8 text-[14px] font-semibold rounded-full shadow-gold-btn border border-gold-400/30 transition-all duration-500"
            >
              Try It Now — Free Demo
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
          Your competitors' mailers end up in the trash.
          <br className="hidden sm:block" />
          <span className="text-white/60">Yours books the appointment.</span>
        </motion.h2>

        <motion.p
          className="text-lg text-white/60 mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease }}
        >
          See a Talking Postcard in action. Watch our AI agent greet a customer by name, reference their vehicle, and book the appraisal — all in under 2 minutes.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease }}
        >
          <Link to="/talking-postcard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn hover:shadow-[0_8px_32px_rgba(212,168,67,0.35)] transition-all duration-500 hover:-translate-y-0.5 border border-gold-400/30"
            >
              See It In Action
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/book-demo">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/[0.06] h-14 px-8 text-[15px] font-medium rounded-full border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Book a Demo
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
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/50 inline-flex items-center justify-center text-[8px] text-white font-bold">&#10003;</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
