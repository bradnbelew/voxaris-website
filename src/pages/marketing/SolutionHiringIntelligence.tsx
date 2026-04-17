import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

const ACCENT = '#60a5fa'; // blue-400

export function SolutionHiringIntelligence() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Hiring Intelligence | Voxaris — AI Video-Interviews Every Applicant</title>
        <meta name="description" content="An AI video agent interviews every applicant the moment they apply, scores fit, surfaces strengths and concerns, and hands you a ranked shortlist with recordings you can replay." />
        <link rel="canonical" href="https://voxaris.io/solutions/hiring-intelligence" />
        <meta property="og:title" content="Hiring Intelligence | Voxaris" />
        <meta property="og:description" content="Stop losing great hires to slow screening. AI video-interviews every applicant — consistent questions, automatic scoring, ranked shortlists." />
        <meta property="og:url" content="https://voxaris.io/solutions/hiring-intelligence" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <FeatureGrid />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}

function TopStrip() {
  return (
    <div className="relative z-10 border-b border-white/[0.06] pt-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/50">
            Voxaris · Hiring Intelligence
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/30">
          <span>01 / 04</span>
          <span>Interviews on autopilot</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-[900px] h-[800px] rotate-12"
          style={{
            background:
              'radial-gradient(ellipse at 30% 30%, rgba(96,165,250,0.12) 0%, rgba(96,165,250,0.03) 35%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <TopStrip />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-14 lg:pt-20 pb-20">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-start">
          {/* LEFT */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="text-white leading-[0.94] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.75rem)', fontWeight: 500 }}
            >
              Every applicant
              <br />
              <span className="italic font-editorial" style={{ color: ACCENT, fontWeight: 400 }}>
                interviewed.
              </span>{' '}
              <span className="text-white/55">Only the best</span>
              <br />
              <span className="text-white/55">land on your desk.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-8 text-[16px] sm:text-[17px] text-white/55 leading-[1.6] max-w-xl"
            >
              The moment someone applies, an AI video agent interviews them. It scores fit,
              writes up strengths and concerns, and hands you a ranked shortlist with full
              recordings. Your team only sits down with candidates worth their time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link to="/book-demo">
                <button className="group relative flex items-center gap-3 h-[58px] pl-7 pr-5 rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 text-black text-[14px] font-semibold tracking-tight transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[6px_6px_0_0_rgba(212,168,67,0.5)]">
                  See it live
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
                </button>
              </Link>
              <a
                href="tel:+14077594100"
                className="text-[12px] font-mono text-white/45 hover:text-white/80 tracking-wide transition-colors"
              >
                or call (407) 759-4100 →
              </a>
            </motion.div>

            {/* Stats rail */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-14 grid grid-cols-4 gap-5 pt-7 border-t border-white/[0.08] max-w-xl"
            >
              {[
                { n: '< 5m', l: 'First call' },
                { n: '10×', l: 'Screened' },
                { n: '80%', l: 'Time saved' },
                { n: '100%', l: 'Contacted' },
              ].map((s) => (
                <div key={s.l}>
                  <div
                    className="text-[26px] lg:text-[32px] font-editorial italic leading-none mb-2"
                    style={{ color: ACCENT, fontWeight: 400 }}
                  >
                    {s.n}
                  </div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/35">
                    {s.l}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — candidate dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="relative lg:pt-8"
          >
            {/* Peek card */}
            <div
              className="absolute top-[-16px] right-[-22px] w-[80%] aspect-[4/3] bg-carbon-900 border border-white/[0.08] rotate-3 opacity-50"
              style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.8)' }}
              aria-hidden
            />

            {/* Polaroid front — dashboard card */}
            <div
              className="relative bg-[#f5f0e6] p-4 pb-9 -rotate-2"
              style={{ boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-carbon-700">
                    Candidate · complete
                  </span>
                </div>
                <span className="text-[10px] font-mono text-carbon-500 tabular-nums">00:12:47</span>
              </div>

              <div className="bg-carbon-950 p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[14px] font-medium text-blue-300 mb-3">
                      SM
                    </div>
                    <div className="text-[14px] font-medium text-white">Sarah M.</div>
                    <div className="text-[11px] text-white/50">Sales Representative</div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[44px] font-editorial italic leading-none"
                      style={{ color: ACCENT, fontWeight: 400 }}
                    >
                      94
                    </div>
                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.15em] mt-1">
                      fit score
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: 'Experience', v: '9/10' },
                    { l: 'Availability', v: '10/10' },
                    { l: 'Fit', v: '9/10' },
                  ].map((x) => (
                    <div key={x.l} className="border-t border-white/10 pt-2">
                      <div className="text-[14px] font-light text-white tabular-nums">{x.v}</div>
                      <div className="text-[9px] font-mono text-white/35 uppercase tracking-wider mt-0.5">
                        {x.l}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI summary */}
                <div className="border-l-2 pl-3 py-0.5" style={{ borderColor: ACCENT }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-2.5 h-2.5" style={{ color: ACCENT }} strokeWidth={2} />
                    <span className="text-[9px] font-mono uppercase tracking-[0.18em]" style={{ color: ACCENT }}>
                      AI summary
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-[1.55]">
                    7 yrs inside-sales experience. Warm, clear on the phone, answers without filler.
                    Available immediately, flexible on schedule. Handled objections cleanly — would be a
                    <span className="text-white font-medium"> strong hire for the SDR role.</span>
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded w-fit">
                  <span className="text-[9px] font-mono text-emerald-300 uppercase tracking-[0.15em]">
                    ✓ Strong hire
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span
                  className="font-editorial italic text-[18px] text-carbon-900 leading-none"
                  style={{ fontWeight: 400 }}
                >
                  AI interview complete
                </span>
                <span className="text-[10px] font-mono text-carbon-500 uppercase tracking-wider">
                  recording available
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-10 border-y border-white/[0.08] bg-black/40 backdrop-blur-sm overflow-hidden">
        <div
          className="flex py-3.5"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          }}
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center gap-10 pr-10 animate-marquee"
              style={{ ['--gap' as string]: '2.5rem' }}
            >
              {[
                '· Application received',
                '· Video interview scheduled',
                '· Candidate scored 94/100',
                '· Full transcript available',
                '· Ranked shortlist updated',
                '· Zero ghosted applicants',
                '· Strong hire flagged',
              ].map((t, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 whitespace-nowrap"
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    '57% of applicants drop off if not contacted within a week',
    'Manually screening 100 applicants takes 8–12 hours',
    'Inconsistent questions mean inconsistent hires',
    'The best candidates apply somewhere else while you sift resumes',
  ];

  return (
    <section className="py-24 lg:py-28 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          <motion.div {...fadeUp()}>
            <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-5 block">
              The problem
            </span>
            <h2
              className="text-carbon-900 leading-[0.98] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)', fontWeight: 500 }}
            >
              Great hires are
              <br />
              <span className="italic font-editorial text-carbon-400" style={{ fontWeight: 400 }}>
                slipping through
              </span>
              <br />
              the cracks.
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="lg:pt-4">
            <p className="text-[16px] text-carbon-600 leading-relaxed mb-9 max-w-lg">
              Most businesses face the same problem: too many applicants to call, not enough time
              to screen them all. So the best candidates either apply somewhere else or give up
              waiting.
            </p>
            <ul className="space-y-4">
              {problems.map((p, i) => (
                <motion.li
                  key={p}
                  {...fadeUp(0.2 + i * 0.06)}
                  className="flex items-start gap-4 py-4 border-b border-carbon-200"
                >
                  <span
                    className="text-[20px] font-editorial italic leading-none shrink-0"
                    style={{ color: ACCENT, fontWeight: 400 }}
                  >
                    0{i + 1}
                  </span>
                  <span className="text-[15px] text-carbon-700 leading-snug">{p}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '01', t: 'Applicant submits', d: 'Someone applies to your open role. The AI agent reaches out to schedule a video interview — usually within the hour.' },
    { n: '02', t: 'AI conducts the interview', d: 'A structured video interview — same questions, same tone, every time. No bias, no fatigue. Every call recorded.' },
    { n: '03', t: 'Scores automatically', d: 'The AI scores experience, fit, and qualifications against your criteria, and writes up the strengths and concerns.' },
    { n: '04', t: 'You see the shortlist', d: 'Your dashboard shows ranked candidates with recordings, transcripts, scores, and an AI recommendation on each.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp()} className="mb-14">
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-white/40 mb-5 block">
            How it works
          </span>
          <h2
            className="text-white leading-[0.98] tracking-[-0.035em] max-w-3xl"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)', fontWeight: 500 }}
          >
            Apply. <span className="italic font-editorial" style={{ color: ACCENT, fontWeight: 400 }}>Interview.</span>{' '}
            Score. <span className="italic font-editorial text-white/55" style={{ fontWeight: 400 }}>Hire.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06]">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp(i * 0.08)}
              className="bg-black p-8 hover:bg-white/[0.02] transition-colors"
            >
              <div
                className="text-[60px] font-editorial italic leading-none mb-6"
                style={{ color: ACCENT, fontWeight: 400, opacity: 0.8 }}
              >
                {s.n}
              </div>
              <h3 className="text-[16px] font-medium text-white mb-2.5">{s.t}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    { t: 'Calls in under 5 minutes', d: 'The moment an application lands, the AI agent calls. No delays. No human bottleneck.' },
    { t: 'Consistent, every time', d: 'Every candidate gets the exact same interview. No good days, no bad days — just clean data.' },
    { t: 'Ranked dashboard', d: 'See every candidate ranked by fit score. Full transcripts, audio, and AI analysis per candidate.' },
    { t: 'Built-in escalation', d: 'Edge cases get flagged for human review. Nothing slips through.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp()} className="mb-14 max-w-2xl">
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-5 block">
            The features
          </span>
          <h2
            className="text-carbon-900 leading-[0.98] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)', fontWeight: 500 }}
          >
            Built for teams
            <br />
            <span className="italic font-editorial text-carbon-400" style={{ fontWeight: 400 }}>
              that hire at volume.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.t}
              {...fadeUp(i * 0.07)}
              className="p-8 bg-white border border-carbon-200 rounded-xl hover:border-carbon-400 transition-colors"
            >
              <div
                className="text-[22px] font-editorial italic mb-4"
                style={{ color: ACCENT, fontWeight: 400 }}
              >
                ↳
              </div>
              <h3 className="text-[18px] font-medium text-carbon-900 mb-2">{f.t}</h3>
              <p className="text-[14px] text-carbon-600 leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(96,165,250,0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <motion.h2
          {...fadeUp()}
          className="text-white leading-[0.98] tracking-[-0.035em] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 500 }}
        >
          Stop losing great candidates
          <br />
          <span className="italic font-editorial" style={{ color: ACCENT, fontWeight: 400 }}>
            to slow screening.
          </span>
        </motion.h2>

        <motion.p {...fadeUp(0.1)} className="text-[16px] text-white/50 mb-10 max-w-lg mx-auto">
          Live in 48 hours. No long-term contract. Works with any ATS.
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/book-demo">
            <button className="group relative flex items-center gap-3 h-[58px] pl-7 pr-5 rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 text-black text-[14px] font-semibold tracking-tight transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[6px_6px_0_0_rgba(212,168,67,0.5)]">
              See Hiring Intelligence live
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
            </button>
          </Link>
          <a
            href="tel:+14077594100"
            className="text-[13px] font-mono text-white/45 hover:text-white/80 tracking-wide transition-colors"
          >
            or call (407) 759-4100 →
          </a>
        </motion.div>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-9 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/25"
        >
          No commitment · Same-day response · Live in 48 hours
        </motion.p>
      </div>
    </section>
  );
}
