import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Globe,
  Zap,
  BarChart3,
  CheckCircle2,
  Star,
  MessageSquare,
  Search,
  Layers,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export function Presence() {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Presence | AI Website Builder + AEO Optimization | Voxaris</title>
        <meta name="description" content="Build a professional website in days. Optimize for AI answer engines like ChatGPT, Perplexity, and Google AI Overviews. Voice AI built into every page." />
        <meta name="keywords" content="AEO optimization, AI website builder, answer engine optimization, AI search visibility, ChatGPT SEO, Perplexity optimization, voice AI website" />
        <link rel="canonical" href="https://voxaris.io/presence" />
        <meta property="og:title" content="Presence — AI Web Builder + AEO | Voxaris" />
        <meta property="og:description" content="Build your site. Dominate AI search. Voice AI included." />
        <meta property="og:url" content="https://voxaris.io/presence" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <PresenceHero />
        <WhatIsAEO />
        <FeaturesGrid />
        <PresenceCTA />
      </main>
      <Footer />
    </div>
  );
}

function PresenceHero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-carbon-950 pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 noise-overlay opacity-[0.12]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 w-full py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400/50" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-[0.18em]">Presence · Web + AEO</span>
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              Own your web presence.
              <br />
              <span className="text-gold-gradient">Show up where buyers look.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-white/50 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              Presence builds you a modern, AI-optimized website — and then makes sure you show up when buyers search in ChatGPT, Perplexity, Google AI Overviews, and traditional search. Voice AI is built into every page.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link to="/book-demo">
                <Button size="lg" className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {['Live site in days', 'No dev team needed', 'AEO-first architecture'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-violet-500/50" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — AI search visualization */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-carbon-900 p-5">
              <div className="text-[11px] text-white/30 mb-4 uppercase tracking-wider font-semibold">AI Search Results</div>

              {/* ChatGPT result */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
                    <MessageSquare className="w-2.5 h-2.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/50">ChatGPT</span>
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">
                  "Based on recent reviews and rankings, <span className="text-violet-300 font-semibold">YourBusiness.com</span> is one of the top-rated options in Orlando for..."
                </p>
              </div>

              {/* Perplexity result */}
              <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
                    <Search className="w-2.5 h-2.5 text-blue-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-white/50">Perplexity</span>
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">
                  "Sources indicate <span className="text-violet-300 font-semibold">YourBusiness.com</span> offers the best pricing and availability for same-day service..."
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: 'AI Citations', value: '+340%', color: 'text-emerald-400' },
                  { label: 'Search Rank', value: 'Top 3', color: 'text-gold-400' },
                  { label: 'Voice Queries', value: '+12/day', color: 'text-violet-400' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className={`text-[14px] font-bold ${s.color} font-display`}>{s.value}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="absolute -inset-4 -z-10 blur-3xl opacity-20"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.4), transparent 70%)' }}
            />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-white pointer-events-none" />
    </section>
  );
}

function WhatIsAEO() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div {...fadeUp()}>
            <span className="eyebrow mb-4 block">What is AEO?</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 mb-5 font-display">
              Traditional SEO is
              <br />
              <span className="text-carbon-400">only half the battle.</span>
            </h2>
            <p className="text-[15px] text-carbon-500 leading-relaxed mb-6">
              When buyers have a question today, they ask ChatGPT or Perplexity first. If your business isn't cited in those answers, you don't exist to them — even if you rank on page 1 of Google.
            </p>
            <p className="text-[15px] text-carbon-500 leading-relaxed mb-8">
              <strong className="text-carbon-800">Answer Engine Optimization (AEO)</strong> is the practice of structuring your content so AI answer engines trust your business as a source and cite you in their responses. Presence builds this in from day one.
            </p>
            <ul className="space-y-3">
              {[
                'Structured data and schema markup for AI engines',
                'FAQ content formatted for direct AI citations',
                'E-E-A-T signals that build AI engine trust',
                'Voice search optimization for spoken queries',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] text-carbon-600">
                  <CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Visual comparison */}
          <motion.div {...fadeUp(0.15)} className="space-y-4">
            <div className="p-5 rounded-2xl border border-carbon-200 bg-carbon-50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-carbon-200 flex items-center justify-center text-[10px] font-bold text-carbon-500">✗</div>
                <span className="text-[12px] font-semibold text-carbon-500">Without AEO</span>
              </div>
              <p className="text-[13px] text-carbon-400">
                User asks ChatGPT "best plumber in Orlando" — your business isn't mentioned. They call your competitor instead.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-violet-200/60 bg-violet-50/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-[10px] font-bold text-violet-600">✓</div>
                <span className="text-[12px] font-semibold text-violet-700">With Presence AEO</span>
              </div>
              <p className="text-[13px] text-carbon-600">
                ChatGPT cites your business as a top recommendation, links your site, and highlights your 5-star reviews. They call you.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-carbon-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-carbon-700">AI Search Visibility Score</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-end gap-1 h-16">
                {[20, 30, 35, 45, 55, 70, 85, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-violet-500/20"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-carbon-300">Week 1</span>
                <span className="text-[9px] text-carbon-300">Week 8</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesGrid() {
  const features = [
    { icon: Layers, title: 'Professional site builder', desc: 'AI-assisted drag-and-drop builder designed for service businesses. Launch a polished, fast site in days.' },
    { icon: Search, title: 'AEO-first architecture', desc: 'Every page is structured for AI engine citation — schema markup, FAQ blocks, and E-E-A-T signals built in.' },
    { icon: MessageSquare, title: 'Voice AI on every page', desc: 'A voice AI assistant answers visitor questions, qualifies leads, and books appointments 24/7 — no extra setup.' },
    { icon: Globe, title: 'Local + AI search', desc: 'Optimized for both traditional local SEO and emerging AI search channels simultaneously.' },
    { icon: BarChart3, title: 'AI citation tracking', desc: 'See how often your business is cited in ChatGPT, Perplexity, and Gemini responses. Track growth week over week.' },
    { icon: Zap, title: 'Fast and mobile-first', desc: 'Core Web Vitals optimized out of the box. Every Presence site scores 95+ on PageSpeed Insights.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div className="text-center mb-14" {...fadeUp()}>
          <span className="eyebrow mb-4 block">What's Included</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-carbon-900 font-display">
            Everything you need to
            <br />
            <span className="text-carbon-400">dominate AI search.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-2xl bg-white border border-carbon-200 hover:border-violet-200/80 hover:shadow-sm transition-all duration-300"
              {...fadeUp(i * 0.07)}
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-violet-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-carbon-900 mb-2">{f.title}</h3>
              <p className="text-[13px] text-carbon-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PresenceCTA() {
  return (
    <section className="py-20 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 65%)' }} />
      </div>
      <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 font-display">
            Your competitors don't know
            <br />
            <span className="text-white/40">AEO exists yet.</span>
          </h2>
          <p className="text-[15px] text-white/40 mb-8 max-w-lg mx-auto leading-relaxed">
            The businesses that build AEO-first sites today will own AI search results for years. See how Presence gets you there.
          </p>
          <Link to="/book-demo">
            <Button size="lg" className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5">
              Get Started with Presence
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-5 text-[12px] text-white/20">No contracts · Launch in days · Includes voice AI</p>
        </motion.div>
      </div>
    </section>
  );
}
