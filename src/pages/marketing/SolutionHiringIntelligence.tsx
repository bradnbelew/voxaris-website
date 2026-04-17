import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, Phone, BarChart3, CheckCircle2,
  Clock, Zap, Shield, Star,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function SolutionHiringIntelligence() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Hiring Intelligence | Voxaris — AI That Video-Interviews Every Applicant</title>
        <meta name="description" content="An AI video agent interviews every applicant the moment they apply, scores fit, surfaces strengths and concerns, and hands you a ranked shortlist with recordings you can replay." />
        <link rel="canonical" href="https://voxaris.io/solutions/hiring-intelligence" />
        <meta property="og:title" content="Hiring Intelligence | Voxaris" />
        <meta property="og:description" content="Stop losing great hires to slow screening. AI calls every applicant in minutes — consistent interviews, automatic scoring, ranked shortlists." />
        <meta property="og:url" content="https://voxaris.io/solutions/hiring-intelligence" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <FeatureGrid />
        <CTAB />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.03) 35%, transparent 65%)' }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.08]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-mono text-blue-400/70 uppercase tracking-[0.15em]">Hiring Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-white leading-[1.05] tracking-[-0.03em] mb-6">
            Every applicant interviewed.
            <br />
            <span className="text-blue-400">Only the best land on your desk.</span>
          </h1>

          <p className="text-[17px] text-white/50 leading-[1.8] mb-8 max-w-2xl">
            The moment someone applies, an AI video agent interviews them. It scores fit,
            writes up strengths and concerns, and hands you a ranked shortlist with full
            recordings you can replay. Your team only sits down with the candidates worth
            their time.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/book-demo">
              <button className="flex items-center gap-2 px-7 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 group">
                See it live <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-wrap gap-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          {[
            { value: '< 5 min', label: 'Time to first call' },
            { value: '10×', label: 'More candidates screened' },
            { value: '80%', label: 'Time saved on screening' },
            { value: '100%', label: 'Applicants contacted' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-[22px] font-light text-blue-400">{s.value}</div>
              <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-20 bg-carbon-950">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp()}>
            <span className="eyebrow mb-3 block">The problem</span>
            <h2 className="text-3xl font-light text-white mb-5">
              Great candidates are falling through
              <span className="text-white/35"> your hiring cracks.</span>
            </h2>
            <p className="text-[15px] text-white/45 leading-relaxed mb-6">
              Most businesses face the same problem: too many applicants to call, not enough time to screen
              them all manually. So the best candidates either apply somewhere else or give up waiting to hear back.
            </p>
            <ul className="space-y-3">
              {[
                '57% of candidates drop off if not contacted within a week',
                'Manually screening 100 applicants takes 8–12 hours',
                'Inconsistent interviews mean inconsistent hires',
                'Great candidates get overlooked because of resume bias',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13px] text-white/45">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0 mt-2" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="space-y-4" {...fadeUp(0.1)}>
            {/* Mock candidate card */}
            <div className="rounded-2xl border border-blue-500/15 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono text-white/30 uppercase tracking-wider">Interview complete</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">Strong hire</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-[13px] font-medium text-blue-400 shrink-0">SM</div>
                <div>
                  <div className="text-[14px] font-medium text-white">Sarah M.</div>
                  <div className="text-[11px] text-white/35">Applying for: Sales Representative</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[24px] font-light text-blue-400">94</div>
                  <div className="text-[10px] font-mono text-white/25">fit score</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Experience', score: '9/10' },
                  { label: 'Availability', score: '10/10' },
                  { label: 'Fit', score: '9/10' },
                ].map((s) => (
                  <div key={s.label} className="text-center p-2.5 rounded-xl bg-white/[0.03]">
                    <div className="text-[13px] font-light text-white">{s.score}</div>
                    <div className="text-[10px] text-white/25 font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-white/25 uppercase tracking-wider">Today's pipeline</span>
                <span className="text-[10px] font-mono text-white/20">12 screened · 3 shortlisted</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Sarah M.', score: 94, tag: 'Strong hire', color: 'text-emerald-400', tagBg: 'bg-emerald-500/10 border-emerald-500/20' },
                  { name: 'James R.', score: 87, tag: 'Consider', color: 'text-blue-400', tagBg: 'bg-blue-500/10 border-blue-500/20' },
                  { name: 'Priya K.', score: 91, tag: 'Strong hire', color: 'text-emerald-400', tagBg: 'bg-emerald-500/10 border-emerald-500/20' },
                ].map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="text-[12px] text-white/55">{c.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[12px] font-light ${c.color}`}>{c.score}</span>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${c.tagBg} ${c.color}`}>{c.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: '01', icon: Phone, title: 'Applicant submits', desc: 'Someone applies to your open role. The AI agent reaches out to schedule a video interview — usually within the hour.' },
    { num: '02', icon: Users, title: 'AI conducts interview', desc: 'A structured video interview — same questions, same tone, every time. No bias, no fatigue. Every call recorded.' },
    { num: '03', icon: BarChart3, title: 'Scores automatically', desc: 'The AI scores experience, fit, and qualifications against your criteria, and writes up the strengths and concerns.' },
    { num: '04', icon: Star, title: 'You see the shortlist', desc: 'Your dashboard shows ranked candidates with recordings, transcripts, scores, and an AI recommendation on each one.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="text-center mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">How it works</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white">
            Apply. Call. Score. Hire.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/20 transition-all duration-300"
              {...fadeUp(i * 0.08)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-mono text-blue-400/40">{step.num}</span>
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { icon: Clock, title: 'Calls in under 5 minutes', desc: 'The moment an application comes in, the AI agent calls. No delays, no scheduling, no human bottleneck.' },
    { icon: Zap, title: 'Consistent every time', desc: 'Every candidate gets the exact same interview experience. No good days, no bad days — just consistent data.' },
    { icon: BarChart3, title: 'Ranked dashboard', desc: 'See every candidate ranked by fit score. Full transcripts, audio recordings, and AI analysis included.' },
    { icon: Shield, title: 'Built-in escalation', desc: 'Edge cases get flagged for human review. Nothing slips through the cracks.' },
  ];

  return (
    <section className="py-20 bg-carbon-950">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">Features</span>
          <h2 className="text-3xl font-light text-white">Built for businesses that hire at volume.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-blue-500/15 transition-all duration-300 flex gap-5"
              {...fadeUp(i * 0.08)}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <f.icon className="w-4.5 h-4.5 text-blue-400" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAB() {
  return (
    <section className="py-20 bg-carbon-950">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl font-light text-white mb-4">
            Stop losing great candidates
            <br />
            <span className="text-white/35">to slow screening.</span>
          </h2>
          <p className="text-[14px] text-white/35 mb-8">
            Live in 48 hours. No long-term contract. Works with any ATS.
          </p>
          <Link to="/book-demo">
            <button className="flex items-center gap-2 mx-auto px-8 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-btn transition-all duration-300 hover:-translate-y-0.5 group">
              See Hiring Intelligence live <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Link>
          <p className="mt-5 text-[11px] text-white/20 font-mono">
            No commitment · Live in 48 hours · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
