import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Search, MapPin, Brain, BarChart3,
  Zap, TrendingUp, FileText, Sparkles,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ACCENT = '#34d399';
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function SolutionAeoGeo() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>AEO-GEO Optimization | Voxaris — Show Up in AI Search & Local Results</title>
        <meta name="description" content="Get cited by ChatGPT, Perplexity, and Google AI Overviews. Dominate local search. Free audit included." />
        <link rel="canonical" href="https://voxaris.io/solutions/aeo-geo" />
        <meta property="og:title" content="AEO-GEO Optimization | Voxaris" />
        <meta property="og:description" content="AI-powered search visibility for local businesses. Get cited when customers ask AI for businesses like yours. Free audit at audit.voxaris.io." />
        <meta property="og:url" content="https://voxaris.io/solutions/aeo-geo" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <TopStrip />
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

/* ══════════════════════════════════════════════
   Top Strip
═════════════════════════════════════════════ */
function TopStrip() {
  return (
    <div className="border-b border-white/[0.06] bg-black pt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-11 flex items-center justify-between text-[11px] font-mono text-white/40">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
          <span className="uppercase tracking-[0.18em]">Voxaris · AI Search Visibility</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>04 / 04</span>
          <span className="text-white/25">·</span>
          <span>Be the answer, not the link</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Hero
═════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 right-0 h-[700px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(52,211,153,0.10) 0%, transparent 42%), linear-gradient(225deg, rgba(52,211,153,0.05) 0%, transparent 35%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            <motion.div
              className="inline-flex items-center gap-2 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
                [ Solution · 04 ]
              </span>
              <span className="h-px w-10 bg-white/20" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">
                AEO-GEO
              </span>
            </motion.div>

            <motion.h1
              className="font-light text-white leading-[0.95] tracking-[-0.035em] mb-8"
              style={{
                fontSize: 'clamp(2.5rem, 6.5vw, 5.75rem)',
                fontWeight: 500,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              Be the answer
              <br />
              AI{' '}
              <span className="font-editorial italic" style={{ color: ACCENT, fontWeight: 400 }}>
                hands back
              </span>
              <br />
              to your buyer.
            </motion.h1>

            <motion.p
              className="text-[16px] sm:text-[17px] text-white/55 leading-[1.7] max-w-xl mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
            >
              Search has changed. Buyers ask ChatGPT, Perplexity, and Google AI Overviews before
              they touch a blue link. We make sure you're the local business they name back.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              <a
                href="https://audit.voxaris.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 h-[58px] pl-7 pr-5 text-[14px] font-semibold text-black rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[2px_2px_0_0_rgba(212,168,67,0.35)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
              >
                <span className="uppercase tracking-[0.14em]">Run free audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/book-demo"
                className="flex items-center h-[58px] px-6 text-[13px] font-medium text-white/60 hover:text-white transition-colors"
              >
                Book a demo →
              </Link>
            </motion.div>

            {/* Stats rail */}
            <motion.div
              className="grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              {[
                { num: '6×', label: 'more AI citations' },
                { num: '90d', label: 'to page-1 local pack' },
                { num: '0$', label: 'audit cost' },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-3xl sm:text-4xl font-editorial italic tabular-nums mb-1"
                    style={{ color: ACCENT, fontWeight: 400 }}
                  >
                    {s.num}
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — polaroid citation card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease }}
          >
            {/* Peek card behind */}
            <div
              className="absolute top-6 -right-3 w-[88%] aspect-[4/5] bg-[#f5f0e6] p-4 pb-10 opacity-50 grayscale"
              style={{ transform: 'rotate(4deg)' }}
            >
              <div className="w-full h-full bg-carbon-200" />
            </div>

            {/* Main polaroid */}
            <div
              className="relative bg-[#f5f0e6] p-4 pb-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
              style={{ transform: 'rotate(-1.8deg)' }}
            >
              <div className="relative aspect-[4/5] bg-white overflow-hidden border border-carbon-200">
                {/* Mock ChatGPT citation UI */}
                <div className="absolute inset-0 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${ACCENT}25` }}>
                        <Brain className="w-3.5 h-3.5" style={{ color: ACCENT }} strokeWidth={1.8} />
                      </div>
                      <span className="text-[10px] font-mono text-carbon-500 uppercase tracking-wider">ChatGPT · web</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: ACCENT }}>
                      ● Live
                    </span>
                  </div>

                  <div className="border border-carbon-200 bg-carbon-50 px-3 py-2">
                    <p className="text-[11px] font-mono text-carbon-500 italic">
                      "best HVAC contractor in Orlando"
                    </p>
                  </div>

                  <div className="border-l-[3px] pl-3 py-1" style={{ borderColor: ACCENT }}>
                    <p className="text-[11px] text-carbon-700 leading-[1.6]">
                      Based on my research,{' '}
                      <span className="font-semibold text-carbon-900 underline decoration-carbon-300">
                        Orlando HVAC Co.
                      </span>{' '}
                      is highly recommended for HVAC services. They offer same-day service, 24/7
                      emergency response, and are consistently cited as a top local provider.
                    </p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider">
                      <span style={{ color: ACCENT }}>✓ Cited as top result</span>
                      <span className="text-carbon-400">9 this week</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="flex-1 h-1 rounded-full overflow-hidden bg-carbon-200">
                        <div className="h-full" style={{ width: '88%', background: ACCENT }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-mono text-carbon-400 uppercase tracking-wider">
                      <span>Citation score</span>
                      <span>88 / 100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Polaroid label */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between font-mono text-carbon-500">
                <span className="text-[10px] uppercase tracking-wider">AI citation · live</span>
                <span className="text-[10px]">voxaris/aeo-01</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ticker strip */}
      <motion.div
        className="mt-14 border-y border-white/[0.06] py-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 pr-8 text-[11px] font-mono text-white/30 uppercase tracking-[0.15em]">
              <span>· Cited in ChatGPT</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Featured in Perplexity</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Named in Google AI Overviews</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Ranked in Bing Copilot</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Local pack — top 3</span>
              <span style={{ color: ACCENT }}>◆</span>
              <span>· Free audit — same day</span>
              <span style={{ color: ACCENT }}>◆</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Problem Section — light surface
═════════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    {
      num: '01',
      text: 'Your website ranks on Google but ChatGPT and Perplexity have never heard of you.',
    },
    {
      num: '02',
      text: 'AI answers now sit above the blue links — and your competitors are the ones being named.',
    },
    {
      num: '03',
      text: 'Your local pack, schema, and citations are incomplete. AI models skip over businesses they can\'t verify.',
    },
    {
      num: '04',
      text: 'You have no idea how you\'re showing up in AI search — or how to fix it.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa] relative">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">
          <motion.div {...fadeUp()}>
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-4 block">
              The problem
            </span>
            <h2 className="text-4xl sm:text-6xl font-light text-carbon-900 leading-[1.02] tracking-[-0.03em]">
              Search moved.
              <br />
              <span className="text-carbon-400">You didn't.</span>
            </h2>
          </motion.div>

          <div className="space-y-0">
            {problems.map((p, i) => (
              <motion.div
                key={p.num}
                className="py-7 border-t border-carbon-200 first:border-t-0 flex gap-6"
                {...fadeUp(i * 0.08)}
              >
                <span
                  className="text-3xl font-editorial italic shrink-0"
                  style={{ color: ACCENT, fontWeight: 400 }}
                >
                  {p.num}
                </span>
                <p className="text-[17px] text-carbon-700 leading-[1.55] pt-1">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   How It Works — dark
═════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Free audit',
      desc: 'Plug in your URL. In minutes we show you what AI models see — schema gaps, authority signals, missing citations, local pack position.',
    },
    {
      num: '02',
      title: 'Fix the foundation',
      desc: 'Structured data, NAP consistency, speakable schema, FAQ extraction, entity alignment. We rebuild your site to be machine-readable.',
    },
    {
      num: '03',
      title: 'Seed the AI web',
      desc: 'Authority content, local citations, review distribution, and review-schema that ChatGPT, Perplexity, and Google Gemini actively index.',
    },
    {
      num: '04',
      title: 'Compound monthly',
      desc: 'Every month: new content, fresh signals, algorithm tracking. We keep you cited as AI search keeps changing around you.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-16 max-w-2xl" {...fadeUp()}>
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] mb-4 block" style={{ color: ACCENT }}>
            How it works
          </span>
          <h2 className="text-4xl sm:text-5xl font-light text-white leading-[1.02] tracking-[-0.03em]">
            Audit. Rebuild.
            <br />
            <span className="text-white/40">Get cited.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="bg-black p-8 lg:p-10"
              {...fadeUp(i * 0.08)}
            >
              <div
                className="text-[60px] font-editorial italic leading-none mb-6"
                style={{ color: ACCENT, fontWeight: 400 }}
              >
                {s.num}
              </div>
              <h3 className="text-[18px] font-medium text-white mb-3">{s.title}</h3>
              <p className="text-[13px] text-white/45 leading-[1.6]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Feature Grid — light
═════════════════════════════════════════════ */
function FeatureGrid() {
  const features = [
    { icon: Search, title: 'Free AEO-GEO audit', desc: 'Detailed report on schema, citations, AI visibility, and local pack position.' },
    { icon: Brain, title: 'AI search optimization', desc: 'Structure your content so ChatGPT, Perplexity, Gemini, and Copilot cite you.' },
    { icon: MapPin, title: 'Local search domination', desc: 'Schema, Google Business, NAP consistency, geo-targeted authority content.' },
    { icon: FileText, title: 'Monthly content refresh', desc: 'Fresh, AI-optimized copy that keeps your expertise signals current.' },
    { icon: BarChart3, title: 'Monthly citation reports', desc: 'See exactly where you\'re being cited and how rankings moved this month.' },
    { icon: TrendingUp, title: 'Algorithm tracking', desc: 'AI search changes weekly. We adjust before you notice a drop.' },
    { icon: Sparkles, title: 'Review schema', desc: 'Review markup that AI engines extract and quote in their answers.' },
    { icon: Zap, title: 'Ongoing retainer', desc: 'One flat monthly rate. Your site compounds instead of plateauing.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-16 max-w-2xl" {...fadeUp()}>
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-4 block">
            What's included
          </span>
          <h2 className="text-4xl sm:text-5xl font-light text-carbon-900 leading-[1.02] tracking-[-0.03em]">
            From audit to
            <br />
            <span className="text-carbon-400">ongoing dominance.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-carbon-200 border border-carbon-200">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-white p-7 lg:p-8"
              {...fadeUp(i * 0.05)}
            >
              <f.icon className="w-5 h-5 mb-5" style={{ color: ACCENT }} strokeWidth={1.5} />
              <h3 className="text-[15px] font-semibold text-carbon-900 mb-2">{f.title}</h3>
              <p className="text-[12.5px] text-carbon-500 leading-[1.6]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Bottom CTA — dark
═════════════════════════════════════════════ */
function BottomCTA() {
  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${ACCENT}18 0%, transparent 65%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          className="text-4xl sm:text-6xl font-light text-white leading-[1.02] tracking-[-0.035em] mb-6"
          {...fadeUp()}
        >
          See how you show up
          <br />
          <span className="font-editorial italic" style={{ color: ACCENT, fontWeight: 400 }}>
            in AI search today.
          </span>
        </motion.h2>

        <motion.p
          className="text-[16px] sm:text-[18px] text-white/50 leading-relaxed mb-10 max-w-xl mx-auto"
          {...fadeUp(0.1)}
        >
          Free audit. No credit card. Just your URL and a same-day report of what
          ChatGPT, Perplexity, and Google AI think of you.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          {...fadeUp(0.2)}
        >
          <a
            href="https://audit.voxaris.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 h-[58px] pl-7 pr-5 text-[14px] font-semibold text-black rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[2px_2px_0_0_rgba(212,168,67,0.35)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
          >
            <span className="uppercase tracking-[0.14em]">Run free audit</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/book-demo"
            className="flex items-center h-[58px] px-6 text-[13px] font-medium text-white/60 hover:text-white transition-colors"
          >
            Book a demo →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
