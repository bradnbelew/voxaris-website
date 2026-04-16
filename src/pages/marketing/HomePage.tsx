import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PhoneCall,
  Mail,
  Users,
  Globe,
  Clock,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Zap,
  Shield,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Hero, Footer } from '@/components/marketing';
import { useState } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Shared animation helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function HomePage() {
  return (
    <div className="min-h-screen bg-carbon-950">
      <Helmet>
        <title>Voxaris | AI Agents for Calls, Hiring, Direct Mail & Web Presence</title>
        <meta name="description" content="Four AI products in one platform: V·TEAMS answers inbound calls 24/7, Talking Postcards convert direct mail, AI Hiring Agents screen candidates, and Presence builds + optimizes your web presence." />
        <meta name="keywords" content="AI agents, V·TEAMS, inbound call AI, talking postcards, AI hiring agents, AEO optimization, AI web presence, Voxaris" />
        <link rel="canonical" href="https://voxaris.io/" />
        <meta property="og:title" content="Voxaris | AI Agents for Your Whole Business" />
        <meta property="og:description" content="Four AI products: V·TEAMS inbound call squads, Talking Postcards, AI Hiring Agents + Dashboard, and Presence web builder + AEO." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Voxaris | AI Agents for Your Whole Business" />
        <meta name="twitter:description" content="Four AI products: V·TEAMS inbound calls, Talking Postcards, AI Hiring Agents, and Presence AEO." />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <Hero />
        <StatsStrip />
        <ProductSuiteOverview />
        <VTeamsSection />
        <TalkingPostcardsSection />
        <HiringAgentsSection />
        <PresenceSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Stats Strip
══════════════════════════════════════════════ */
function StatsStrip() {
  const stats = [
    { value: '< 5s', label: 'Avg. answer time' },
    { value: '24/7', label: 'Always on' },
    { value: '6–12%', label: 'Postcard response rate' },
    { value: '10×', label: 'More candidates screened' },
  ];

  return (
    <section className="py-7 bg-carbon-900/80 border-y border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="flex flex-wrap justify-center gap-8 sm:gap-16"
          {...fadeUp()}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              <span className="text-xl font-bold text-gold-400 font-display">{s.value}</span>
              <span className="text-[11px] text-white/35 leading-tight max-w-[70px]">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Product Suite Overview
══════════════════════════════════════════════ */
function ProductSuiteOverview() {
  const products = [
    {
      id: 'vteams',
      name: 'V·TEAMS',
      label: 'Inbound Call AI',
      icon: PhoneCall,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/15',
      tagBg: 'bg-blue-500/10 text-blue-300',
      desc: 'A coordinated squad of AI agents — receptionist, qualifier, specialist, closer — that answers your inbound calls, warm-transfers with full context, and books appointments 24/7.',
      bullets: [
        'Never miss a call, even at 2 AM',
        'Warm transfers with full conversation history',
        'Books directly to your calendar + CRM',
      ],
      cta: { label: 'Explore V·TEAMS', href: '#vteams' },
    },
    {
      id: 'postcard',
      name: 'Talking Postcards',
      label: 'Direct Mail AI',
      icon: Mail,
      iconColor: 'text-gold-400',
      iconBg: 'bg-gold-500/10',
      borderColor: 'border-gold-500/15',
      tagBg: 'bg-gold-500/10 text-gold-300',
      desc: 'Personalized postcards with unique QR codes that launch a live AI video agent — she greets your customer by name, references their exact vehicle or offer, and books the appointment.',
      bullets: [
        '6–12% response rate vs. 0.5% for email',
        'Customer greets by name in under 3 seconds',
        'Every scan tracked and logged to your CRM',
      ],
      cta: { label: 'Explore Talking Postcards', href: '/talking-postcard' },
    },
    {
      id: 'hiring',
      name: 'AI Hiring Agents',
      label: 'Candidate Screening',
      icon: Users,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/15',
      tagBg: 'bg-emerald-500/10 text-emerald-300',
      desc: 'AI agents phone every applicant within minutes of applying, run a consistent 10-minute screening interview, score and rank candidates, and push the best to your hiring dashboard.',
      bullets: [
        'Every applicant screened — no one falls through',
        'AI scores qualification, fit, and experience',
        'Ranked dashboard with transcripts + AI analysis',
      ],
      cta: { label: 'Explore Hiring Agents', href: '/hiring-agents' },
    },
    {
      id: 'presence',
      name: 'Presence',
      label: 'Web Builder + AEO',
      icon: Globe,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/10',
      borderColor: 'border-violet-500/15',
      tagBg: 'bg-violet-500/10 text-violet-300',
      desc: 'An AI-powered website builder with built-in Answer Engine Optimization — so your business shows up in ChatGPT, Perplexity, and Google AI Overviews, not just traditional search.',
      bullets: [
        'Launch a professional site in days, not months',
        'AEO-first architecture for AI search visibility',
        'Voice AI and chat built into every page',
      ],
      cta: { label: 'Explore Presence', href: '/presence' },
    },
  ];

  return (
    <section id="products" className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="text-center mb-16" {...fadeUp()}>
          <span className="eyebrow text-carbon-400 mb-4 block">The Platform</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display mb-5">
            Four products. One goal.
            <br />
            <span className="text-carbon-400">Never miss an opportunity.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[16px] text-carbon-500 leading-[1.8]">
            Every Voxaris product is purpose-built for a specific revenue gap — missed calls, dead mailers, slow hiring, invisible web presence. Together, they cover every way a business loses money.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              className={`p-7 rounded-2xl border ${p.borderColor} bg-white hover:shadow-card-luxury-hover transition-all duration-300 group flex flex-col`}
              {...fadeUp(i * 0.1)}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0`}>
                  <p.icon className={`w-5 h-5 ${p.iconColor}`} strokeWidth={1.5} />
                </div>
                <div>
                  <div className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mb-1.5 uppercase tracking-wider ${p.tagBg}`}>{p.label}</div>
                  <h3 className="text-[17px] font-bold text-carbon-900">{p.name}</h3>
                </div>
              </div>

              <p className="text-[14px] text-carbon-500 leading-relaxed mb-5">{p.desc}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-carbon-600">
                    <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>

              {p.cta.href.startsWith('#') ? (
                <a href={p.cta.href} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon-800 hover:text-gold-600 transition-colors mt-auto group-hover:gap-2.5">
                  {p.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link to={p.cta.href} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon-800 hover:text-gold-600 transition-colors mt-auto group-hover:gap-2.5">
                  {p.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   V·TEAMS Section
══════════════════════════════════════════════ */
function VTeamsSection() {
  const agents = [
    { num: '01', name: 'Receptionist', role: 'Answers & routes', desc: 'Picks up in under 5 seconds, identifies caller intent, routes to the right agent.', color: 'text-blue-400' },
    { num: '02', name: 'Qualifier', role: 'Vets the lead', desc: 'Asks the right questions, scores fit, and decides how to escalate.', color: 'text-gold-400' },
    { num: '03', name: 'Specialist', role: 'Builds value', desc: 'Handles product questions, objections, and specific use-case conversations.', color: 'text-emerald-400' },
    { num: '04', name: 'Closer', role: 'Books the appointment', desc: 'Secures the calendar slot, confirms details, and syncs everything to your CRM.', color: 'text-rose-400' },
  ];

  return (
    <section id="vteams" className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(59,130,246,0.05) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.1]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <motion.div {...fadeUp()}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/15 text-[10px] font-semibold text-blue-400 uppercase tracking-[0.18em] mb-5">
                <PhoneCall className="w-3 h-3" strokeWidth={1.5} /> V·TEAMS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 font-display leading-tight">
                Your phone lines, fully staffed.
                <br />
                <span className="text-white/40">24 hours a day.</span>
              </h2>
              <p className="text-[15px] text-white/50 leading-relaxed mb-8">
                V·TEAMS is a coordinated squad of four specialized AI agents. Each one is built for a specific role in the call — and they hand off with full context so your callers never repeat themselves.
              </p>
            </motion.div>

            <motion.div className="space-y-3" {...fadeUp(0.15)}>
              {[
                { icon: Clock, text: 'Answers in under 5 seconds, every time' },
                { icon: Zap, text: 'Warm transfers with full conversation history' },
                { icon: BarChart3, text: 'Every call transcribed, scored, and logged to CRM' },
                { icon: Shield, text: 'Built-in escalation — never dead-ends a caller' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-[14px] text-white/60">
                  <item.icon className="w-4 h-4 text-blue-400 shrink-0" strokeWidth={1.5} />
                  {item.text}
                </div>
              ))}
            </motion.div>

            <motion.div className="mt-8 flex gap-3" {...fadeUp(0.25)}>
              <Link to="/book-demo">
                <Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white px-7 h-11 text-[13px] font-semibold rounded-full shadow-gold-sm border border-gold-400/30 transition-all duration-300 group">
                  See V·TEAMS Live <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right — agent cards */}
          <div className="grid grid-cols-2 gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.num}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300"
                {...fadeUp(0.2 + i * 0.08)}
              >
                <div className={`text-2xl font-bold ${agent.color} opacity-50 mb-3 font-display`}>{agent.num}</div>
                <div className="text-[13px] font-bold text-white mb-0.5">{agent.name}</div>
                <div className={`text-[10px] font-semibold uppercase tracking-wider ${agent.color} opacity-70 mb-2`}>{agent.role}</div>
                <p className="text-[12px] text-white/35 leading-relaxed">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Talking Postcards Section
══════════════════════════════════════════════ */
function TalkingPostcardsSection() {
  const steps = [
    { num: '01', title: 'Personalized mailer hits their mailbox', desc: 'Each postcard has the customer\'s name, their vehicle or offer, and a unique QR code — it feels like a personal letter, not a mass blast.', color: 'text-blue-500' },
    { num: '02', title: 'They scan and meet their AI agent', desc: 'A photorealistic AI video agent greets them by name, references their exact offer, and starts a real conversation in under 3 seconds.', color: 'text-gold-500' },
    { num: '03', title: 'The agent books the appointment', desc: 'She checks your calendar, picks a time, confirms the slot, and texts a confirmation — all in under 2 minutes.', color: 'text-emerald-500' },
    { num: '04', title: 'Everything lands in your CRM', desc: 'Contact created, transcript logged, intent captured, appointment synced. Your team sees it before the customer even drives in.', color: 'text-rose-500' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <motion.div {...fadeUp()}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200/60 text-[10px] font-semibold text-gold-700 uppercase tracking-[0.18em] mb-5">
                <Mail className="w-3 h-3" strokeWidth={1.5} /> Talking Postcards
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-5 font-display leading-tight">
                Your mailer just became
                <br />
                <span className="text-gold-gradient">your best salesperson.</span>
              </h2>
              <p className="text-[15px] text-carbon-500 leading-relaxed mb-6">
                Dealerships spend $50K+ per year on mailers that end up in the trash. The ones that get scanned land on generic pages with no follow-up. Talking Postcards change all of that.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { value: '6–12%', label: 'Response rate', sub: 'vs 0.5% email' },
                  { value: '< 3s', label: 'First response', sub: 'instant engagement' },
                  { value: '$0.38', label: 'Per appointment', sub: 'booked' },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="text-2xl font-bold text-carbon-900 font-display">{m.value}</div>
                    <div className="text-[11px] text-carbon-400">{m.label}</div>
                    <div className="text-[10px] text-carbon-300">{m.sub}</div>
                  </div>
                ))}
              </div>

              <Link to="/talking-postcard">
                <Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white px-7 h-11 text-[13px] font-semibold rounded-full shadow-gold-sm border border-gold-400/30 transition-all duration-300 group">
                  See It In Action <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right — steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="flex gap-5 p-5 rounded-2xl border border-carbon-100 hover:border-carbon-200 hover:shadow-sm transition-all duration-300"
                {...fadeUp(0.1 + i * 0.08)}
              >
                <div className={`text-2xl font-bold ${step.color} opacity-40 font-display shrink-0 w-10`}>{step.num}</div>
                <div>
                  <h3 className="text-[14px] font-semibold text-carbon-900 mb-1">{step.title}</h3>
                  <p className="text-[13px] text-carbon-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   AI Hiring Agents Section
══════════════════════════════════════════════ */
function HiringAgentsSection() {
  const features = [
    { icon: Zap, title: 'Calls every applicant in minutes', desc: 'The moment someone applies, an AI agent calls them for a 10-minute screening interview — no scheduling, no delays.' },
    { icon: BarChart3, title: 'Scores and ranks automatically', desc: 'Each interview is scored against your criteria: experience, fit, availability, qualifications. You see a ranked list, not a pile of resumes.' },
    { icon: CheckCircle2, title: 'Full transcripts + AI analysis', desc: 'Every interview is transcribed, summarized, and analyzed. Strengths, concerns, fit score, and recommendation — all in your dashboard.' },
    { icon: Users, title: 'Your team reviews only the best', desc: 'Stop wasting hours on unqualified candidates. Your team sees a ranked shortlist with everything they need to make the call.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(16,185,129,0.05) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.1]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4 order-2 lg:order-1">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="flex gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-emerald-500/20 transition-all duration-300"
                {...fadeUp(0.1 + i * 0.08)}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white mb-1">{f.title}</div>
                  <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — copy */}
          <div className="order-1 lg:order-2">
            <motion.div {...fadeUp()}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-[10px] font-semibold text-emerald-400 uppercase tracking-[0.18em] mb-5">
                <Users className="w-3 h-3" strokeWidth={1.5} /> AI Hiring Agents
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 font-display leading-tight">
                Screen every applicant.
                <br />
                <span className="text-white/40">Hire the best ones faster.</span>
              </h2>
              <p className="text-[15px] text-white/50 leading-relaxed mb-6">
                Most businesses have the same hiring problem: too many applicants to screen manually, not enough time to call everyone. So great candidates fall through. Voxaris AI Hiring Agents call every single one.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { value: '< 5 min', label: 'Time to first call', sub: 'after application' },
                  { value: '10×', label: 'More candidates', sub: 'screened vs manual' },
                  { value: '80%', label: 'Time saved', sub: 'on initial screening' },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="text-2xl font-bold text-white font-display">{m.value}</div>
                    <div className="text-[11px] text-white/40">{m.label}</div>
                    <div className="text-[10px] text-white/25">{m.sub}</div>
                  </div>
                ))}
              </div>

              <Link to="/hiring-agents">
                <Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white px-7 h-11 text-[13px] font-semibold rounded-full shadow-gold-sm border border-gold-400/30 transition-all duration-300 group">
                  See Hiring Agents <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Presence Section
══════════════════════════════════════════════ */
function PresenceSection() {
  const features = [
    { icon: Globe, title: 'Professional site in days', desc: 'AI-assisted website builder designed for service businesses. No agency, no dev team, no 12-week project.' },
    { icon: Star, title: 'Built for AI search', desc: 'AEO-first architecture means your business gets cited by ChatGPT, Perplexity, and Google AI Overviews — not just ranked on page 5.' },
    { icon: Zap, title: 'Voice AI built in', desc: 'Every Presence site comes with a voice AI assistant that answers questions, qualifies visitors, and books appointments 24/7.' },
    { icon: BarChart3, title: 'Structured data + schema', desc: 'Automatic FAQ markup, local business schema, and AI-optimized content ensure AI search engines trust and cite your business.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <motion.div {...fadeUp()}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200/60 text-[10px] font-semibold text-violet-700 uppercase tracking-[0.18em] mb-5">
                <Globe className="w-3 h-3" strokeWidth={1.5} /> Presence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-5 font-display leading-tight">
                Own your web presence.
                <br />
                <span className="text-carbon-400">Show up where buyers look.</span>
              </h2>
              <p className="text-[15px] text-carbon-500 leading-relaxed mb-8">
                Most businesses have outdated websites that don't show up in AI-powered search results. Presence builds you a modern, voice-AI-enabled site — optimized for the way buyers search today.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    className="flex gap-3 p-4 rounded-xl bg-white border border-carbon-100 hover:border-violet-200/60 transition-all duration-300"
                    {...fadeUp(0.1 + i * 0.07)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-violet-500" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-carbon-800 mb-0.5">{f.title}</div>
                      <p className="text-[11px] text-carbon-400 leading-snug">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/presence">
                <Button className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white px-7 h-11 text-[13px] font-semibold rounded-full shadow-gold-sm border border-gold-400/30 transition-all duration-300 group">
                  Explore Presence <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right — visual */}
          <motion.div
            className="relative"
            {...fadeUp(0.15)}
          >
            <div className="rounded-2xl overflow-hidden border border-carbon-200 shadow-card-luxury bg-white p-6">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-carbon-100">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="ml-3 text-[11px] text-carbon-400 font-mono">voxaris-presence.com</span>
              </div>

              <div className="space-y-3">
                <div className="h-6 rounded-lg bg-carbon-100 w-3/4" />
                <div className="h-4 rounded-lg bg-carbon-50 w-full" />
                <div className="h-4 rounded-lg bg-carbon-50 w-5/6" />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {['bg-violet-50', 'bg-gold-50', 'bg-emerald-50'].map((c, j) => (
                    <div key={j} className={`h-20 rounded-xl ${c} border border-carbon-100`} />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-violet-50 border border-violet-200/60">
                  <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Globe className="w-3.5 h-3.5 text-violet-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-violet-800">AI Search Visibility</div>
                    <div className="text-[10px] text-violet-500">Cited in 12 AI answers this week</div>
                  </div>
                  <div className="ml-auto text-[11px] font-bold text-emerald-500">↑ 340%</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -inset-4 -z-10 blur-3xl opacity-20 rounded-3xl"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.3), transparent 70%)' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FAQ Section
══════════════════════════════════════════════ */
function FAQSection() {
  const faqs = [
    { q: 'How long does setup take?', a: 'Most Voxaris products go live within 48–72 hours. We handle the configuration — your industry, your call flows, your CRM integration. No IT project required.' },
    { q: 'Do the AI agents work with my existing CRM?', a: 'Yes. Voxaris integrates with HubSpot, Salesforce, GoHighLevel, and custom systems via API or webhook. Every call, interview, and scan is logged automatically.' },
    { q: 'What happens when an AI can\'t handle a request?', a: 'Every product has built-in escalation. For calls, the AI transfers to a human with full context. For hiring, ambiguous candidates are flagged for manual review. No one ever gets dead-ended.' },
    { q: 'Can I use multiple Voxaris products together?', a: 'Absolutely. Many clients use V·TEAMS for inbound calls, Talking Postcards for direct mail campaigns, and AI Hiring Agents for their open roles simultaneously. The products share a common dashboard and CRM sync.' },
    { q: 'What industries does Voxaris serve?', a: 'Any business that handles inbound calls, direct mail, hiring, or web presence. Current clients include auto dealerships, home services, healthcare, real estate, legal, and professional services.' },
    { q: 'Is there a contract or minimum term?', a: 'No long-term contracts. We work month-to-month because we want you to stay because the results are there, not because you\'re locked in.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <motion.div className="text-center mb-12" {...fadeUp()}>
          <span className="eyebrow mb-4 block">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">Common questions.</h2>
        </motion.div>
        <div className="space-y-2">
          {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
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

/* ══════════════════════════════════════════════
   Final CTA
══════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.07) 0%, transparent 65%)' }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.1]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <motion.div {...fadeUp()}>
          <span className="eyebrow text-white/30 mb-5 block">Get Started</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 font-display">
            Your competitors are still
            <br />
            <span className="text-white/40">doing it manually.</span>
          </h2>
          <p className="text-[15px] text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
            See all four Voxaris products in a single 30-minute demo. We'll show you exactly how each one works with your business and your existing tools.
          </p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4" {...fadeUp(0.1)}>
          <Link to="/book-demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/talking-postcard">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/40 hover:text-white hover:bg-white/[0.06] h-14 px-8 text-[14px] rounded-full border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              Try Talking Postcards
            </Button>
          </Link>
        </motion.div>

        <motion.p className="mt-7 text-[12px] text-white/20" {...fadeUp(0.2)}>
          No credit card required &middot; Live in 48 hours &middot; No long-term contracts
        </motion.p>
      </div>
    </section>
  );
}
