import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

const ACCENT = '#a78bfa'; // violet-400

export function SolutionWebsiteRedesign() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Website Redesign | Voxaris — Modern Sites Built to Convert</title>
        <meta name="description" content="A fast, modern, mobile-first website built for your business. Conversion-optimized from day one. Live in 48 hours." />
        <link rel="canonical" href="https://voxaris.io/solutions/website-redesign" />
        <meta property="og:title" content="Website Redesign | Voxaris" />
        <meta property="og:description" content="Stop losing customers to a slow, outdated site. Voxaris builds modern, conversion-optimized websites for local businesses. Live in 48 hours." />
        <meta property="og:url" content="https://voxaris.io/solutions/website-redesign" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <Hero />
        <WhatYouGet />
        <ProcessSection />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}

function TopStrip() {
  return (
    <div className="relative z-10 border-b border-white/[0.06]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
          <span className="text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/50">
            Voxaris · Website Redesign
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10.5px] font-mono uppercase tracking-[0.2em] text-white/30">
          <span>03 / 04</span>
          <span>Live in 48 hours</span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-[900px] h-[800px] -rotate-12"
          style={{
            background:
              'radial-gradient(ellipse at 70% 30%, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0.03) 35%, transparent 65%)',
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
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease }}
              className="text-white leading-[0.94] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.75rem)', fontWeight: 500 }}
            >
              Your current site
              <br />
              <span className="italic font-editorial" style={{ color: ACCENT, fontWeight: 400 }}>
                is costing you
              </span>
              <br />
              <span className="text-white/55">customers.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="mt-8 text-[16px] sm:text-[17px] text-white/55 leading-[1.6] max-w-xl"
            >
              A slow, outdated website tells every visitor — before they read a word —
              that you're not the right choice. We fix that. Fast, modern, mobile-first,
              built for your business. <span className="text-white/80">Live in 48 hours.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <Link to="/book-demo">
                <button className="group relative flex items-center gap-3 h-[58px] pl-7 pr-5 rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 text-black text-[14px] font-semibold tracking-tight transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0_0_rgba(212,168,67,0.35)] hover:shadow-[6px_6px_0_0_rgba(212,168,67,0.5)]">
                  Get a free quote
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
                </button>
              </Link>
              <a
                href="https://audit.voxaris.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-mono text-white/45 hover:text-white/80 tracking-wide transition-colors"
              >
                free site audit →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-14 grid grid-cols-4 gap-5 pt-7 border-t border-white/[0.08] max-w-xl"
            >
              {[
                { n: '48h', l: 'Launch' },
                { n: '90+', l: 'PageSpeed' },
                { n: 'A+', l: 'Mobile' },
                { n: '100%', l: 'Custom' },
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

          {/* Right — Browser chrome mockup card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="relative lg:pt-8"
          >
            <div
              className="absolute top-[-16px] left-[-22px] w-[80%] aspect-[16/10] bg-carbon-900 border border-white/[0.08] -rotate-3 opacity-50"
              style={{ boxShadow: '0 20px 60px -10px rgba(0,0,0,0.8)' }}
              aria-hidden
            />

            <div
              className="relative bg-[#f5f0e6] p-4 pb-9 rotate-2"
              style={{ boxShadow: '0 30px 80px -15px rgba(0,0,0,0.95)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: ACCENT }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-carbon-700">
                    Deploy · LIVE
                  </span>
                </div>
                <span className="text-[10px] font-mono text-carbon-500 tabular-nums">v1.0.0</span>
              </div>

              <div className="bg-white aspect-[16/11] overflow-hidden border border-carbon-200">
                {/* Fake browser chrome */}
                <div className="flex items-center gap-1.5 px-3 h-8 bg-carbon-100 border-b border-carbon-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <div className="ml-3 flex-1 h-4 bg-white border border-carbon-200 rounded-sm flex items-center px-2">
                    <span className="text-[8.5px] font-mono text-carbon-500 truncate">
                      your-new-site.com
                    </span>
                  </div>
                </div>
                <img
                  src="/roofing-hero.png"
                  alt="New website screenshot"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-3">
                <span
                  className="font-editorial italic text-[18px] text-carbon-900 leading-none"
                  style={{ fontWeight: 400 }}
                >
                  Built & shipped in 48h
                </span>
                <span className="text-[10px] font-mono text-carbon-500 uppercase tracking-wider shrink-0">
                  PageSpeed 94
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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
                '· Kickoff call',
                '· Design locked',
                '· Build overnight',
                '· QA pass',
                '· Deploy to production',
                '· Analytics wired',
                '· Live in 48 hours',
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

function WhatYouGet() {
  const features = [
    { t: 'Blazing fast load times', d: 'Optimized for Core Web Vitals. Google ranks fast sites higher — users bounce from slow ones in under three seconds.' },
    { t: 'Mobile-first design', d: 'Over 60% of searches happen on mobile. Your site will feel right on every device, every screen size.' },
    { t: 'Conversion-optimized layout', d: 'Every page structured to guide visitors toward a call, form fill, or booking. Clear CTAs, logical flow, no dead ends.' },
    { t: 'Local SEO foundation', d: 'Structured for Google Business, local keywords, and geographic targeting. Built to rank for your service area.' },
    { t: 'Secure and reliable', d: "SSL included. Hosting-ready. Built on proven platforms. Your site won't go down during your busiest hours." },
    { t: 'Your brand, elevated', d: 'Clean, professional design that makes you look like the premium option — because you are. First impressions close deals.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp()} className="mb-14 max-w-2xl">
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-5 block">
            What you get
          </span>
          <h2
            className="text-carbon-900 leading-[0.98] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)', fontWeight: 500 }}
          >
            Everything a modern
            <br />
            <span className="italic font-editorial text-carbon-400" style={{ fontWeight: 400 }}>
              website needs.
            </span>{' '}
            Nothing it doesn't.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.t}
              {...fadeUp(i * 0.06)}
              className="p-7 bg-white border border-carbon-200 rounded-xl hover:border-carbon-400 transition-colors"
            >
              <div
                className="text-[22px] font-editorial italic mb-4"
                style={{ color: ACCENT, fontWeight: 400 }}
              >
                0{i + 1}
              </div>
              <h3 className="text-[16px] font-medium text-carbon-900 mb-2">{f.t}</h3>
              <p className="text-[13px] text-carbon-600 leading-relaxed">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { n: '01', t: 'Kickoff call', d: 'A 20-minute call to capture your business, goals, and voice. One conversation is all we need.' },
    { n: '02', t: 'Design sprint', d: 'We draft the layout, write the copy, lock a direction — same day. You review and approve.' },
    { n: '03', t: 'Build & optimize', d: 'We build overnight with speed, SEO, and conversion in mind. No templates. Custom for you.' },
    { n: '04', t: 'Launch & hand off', d: 'Site goes live within 48 hours. You get analytics, editing access, and full ownership.' },
  ];

  return (
    <section className="py-24 lg:py-32 bg-black">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div {...fadeUp()} className="mb-14">
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-white/40 mb-5 block">
            The process
          </span>
          <h2
            className="text-white leading-[0.98] tracking-[-0.035em] max-w-3xl"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)', fontWeight: 500 }}
          >
            From kickoff to{' '}
            <span className="italic font-editorial" style={{ color: ACCENT, fontWeight: 400 }}>
              live in 48 hours.
            </span>
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

function BottomCTA() {
  return (
    <section className="py-24 lg:py-32 bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
        <motion.h2
          {...fadeUp()}
          className="text-carbon-900 leading-[0.98] tracking-[-0.035em] mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 500 }}
        >
          Stop losing deals to
          <br />
          <span className="italic font-editorial" style={{ color: ACCENT, fontWeight: 400 }}>
            a bad website.
          </span>
        </motion.h2>

        <motion.p {...fadeUp(0.1)} className="text-[16px] text-carbon-600 mb-10 max-w-lg mx-auto">
          Free audit, no obligation. Most projects launch in under 48 hours.
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/book-demo">
            <button className="group relative flex items-center gap-3 h-[58px] pl-7 pr-5 rounded-none border border-gold-400/60 bg-gold-500 hover:bg-gold-400 text-black text-[14px] font-semibold tracking-tight transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] shadow-[4px_4px_0_0_rgba(212,168,67,0.45)] hover:shadow-[6px_6px_0_0_rgba(212,168,67,0.6)]">
              Book a free demo
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2} />
            </button>
          </Link>
          <a
            href="https://audit.voxaris.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-mono text-carbon-500 hover:text-carbon-900 tracking-wide transition-colors"
          >
            free site audit →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
