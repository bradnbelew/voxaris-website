import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Search, MapPin, Brain, BarChart3, CheckCircle2,
  Zap, Globe, Star, TrendingUp,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

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
        <HeroSection />
        <WhatIsAeoGeo />
        <WhatYouGet />
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
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.03) 35%, transparent 65%)' }}
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
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Search className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-mono text-emerald-400/70 uppercase tracking-[0.15em]">AEO-GEO Optimization</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-white leading-[1.05] tracking-[-0.03em] mb-6">
            When someone asks AI
            <br />
            <span className="text-emerald-400">for a business like yours —</span>
            <br />
            do you show up?
          </h1>

          <p className="text-[17px] text-white/50 leading-[1.8] mb-8 max-w-2xl">
            Search has changed. ChatGPT, Perplexity, Google's AI Overviews, and Bing Copilot are now where
            buyers go first. AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) are
            the new SEO — and most businesses don't have it yet.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://audit.voxaris.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-[14px] font-semibold border border-emerald-400/30 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Get your free audit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link
              to="/book-demo"
              className="flex items-center gap-2 px-7 h-12 rounded-full border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] text-[14px] transition-all duration-300"
            >
              Book a demo →
            </Link>
          </div>
        </motion.div>

        {/* Live citation mockup */}
        <motion.div
          className="mt-14 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <div className="rounded-2xl border border-emerald-500/15 bg-white/[0.03] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-emerald-500/20 flex items-center justify-center">
                  <Brain className="w-2.5 h-2.5 text-emerald-400" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-mono text-white/30">ChatGPT web search</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/50 uppercase tracking-wider">Live</span>
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-[12px] text-white/35 font-mono italic">User: "best HVAC contractor in Orlando"</p>
              <div className="border-l-2 border-emerald-500/30 pl-4">
                <p className="text-[13px] text-white/70 leading-relaxed">
                  Based on my research, <span className="text-white font-medium">Orlando HVAC Co.</span> is highly recommended for HVAC services in the Orlando area.
                  They offer same-day service, 24/7 emergency calls, and have been consistently cited as a top
                  local provider across review platforms...
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] font-mono text-emerald-400/70">✓ Cited as top result</span>
                <span className="text-[10px] font-mono text-white/20">·</span>
                <span className="text-[10px] font-mono text-white/30">9 citations this week</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function WhatIsAeoGeo() {
  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-[0.06] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">What is AEO-GEO?</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-5">
            The new frontier of search.
          </h2>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed">
            Traditional SEO gets you ranked on Google's blue links. AEO-GEO gets you cited in the AI-generated
            answers that now appear above those links — and in standalone AI search tools that your customers
            are already using.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          <motion.div
            className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07]"
            {...fadeUp(0.05)}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[16px] font-medium text-white">AEO — Answer Engine Optimization</h3>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed mb-5">
              AEO structures your website's content so that AI models — ChatGPT, Perplexity, Google Gemini, Bing Copilot —
              can find, trust, and cite your business when users ask questions related to what you do.
            </p>
            <ul className="space-y-2.5">
              {[
                'Schema markup & structured data',
                'FAQ content optimized for AI extraction',
                'Authority signals that AI models trust',
                'Speakable content for voice search',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-white/35">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="p-7 rounded-2xl bg-white/[0.03] border border-white/[0.07]"
            {...fadeUp(0.1)}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[16px] font-medium text-white">GEO — Generative Engine Optimization</h3>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed mb-5">
              GEO optimizes your presence for AI-generated search results that include local context — so when
              someone near you asks an AI for a recommendation, your business is the one that gets named.
            </p>
            <ul className="space-y-2.5">
              {[
                'Local business schema & NAP consistency',
                'Google Business Profile optimization',
                'Geo-targeted content that AI cites',
                'Local authority building & citations',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-white/35">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  const deliverables = [
    { icon: Search, title: 'Free website audit', desc: 'Before we touch a thing, we run your site through our full AEO-GEO audit tool. You get a detailed report showing exactly where you stand and what\'s being missed.' },
    { icon: Brain, title: 'AI search optimization', desc: 'We restructure your content and technical setup so ChatGPT, Perplexity, Google Gemini, and Bing Copilot can discover, trust, and cite your business.' },
    { icon: MapPin, title: 'Local search domination', desc: 'Full local SEO foundation — schema markup, Google Business optimization, NAP consistency, and geo-targeted content for your service area.' },
    { icon: BarChart3, title: 'Monthly reports', desc: 'Every month you\'ll see exactly where you\'re being cited, how your rankings moved, what changed in the algorithms, and what we\'re doing about it.' },
    { icon: TrendingUp, title: 'Ongoing optimization', desc: 'AI search algorithms evolve fast. Our monthly retainer keeps your content, schema, and signals current — so you compound, not plateau.' },
    { icon: Zap, title: 'Content updates', desc: 'We update your site\'s content monthly with fresh, AI-optimized copy that signals expertise and authority to both human readers and AI models.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">What's included</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white">
            Everything from audit to
            <br />
            <span className="text-white/35">ongoing dominance.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deliverables.map((d, i) => (
            <motion.div
              key={d.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300"
              {...fadeUp(i * 0.07)}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <d.icon className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{d.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTAB() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl font-light text-white mb-4">
            Start with a free audit.
            <br />
            <span className="text-white/35">See exactly where you stand.</span>
          </h2>
          <p className="text-[14px] text-white/35 mb-8">
            No account, no credit card. Just your URL and a report that shows
            what AI search engines see when they look at your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://audit.voxaris.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-btn transition-all duration-300 hover:-translate-y-0.5 group"
            >
              Run your free audit <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link
              to="/book-demo"
              className="flex items-center gap-2 px-7 h-12 rounded-full border border-white/20 hover:border-white/35 text-white/60 hover:text-white text-[14px] transition-all duration-200"
            >
              Book a demo →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
