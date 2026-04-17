import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Globe, Zap, Smartphone, BarChart3,
  Search, Star, Shield,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

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
        <HeroSection />
        <WhatYouGet />
        <ProcessSection />
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
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 35%, transparent 65%)' }}
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
            <div className="w-8 h-8 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-violet-400" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-mono text-violet-400/70 uppercase tracking-[0.15em]">Website Redesign</span>
          </div>

          <h1
            className="font-editorial text-white leading-[1.02] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', letterSpacing: '-0.025em' }}
          >
            Your current site is
            <br />
            <em className="text-violet-400 not-italic" style={{ fontStyle: 'italic' }}>costing you customers.</em>
          </h1>

          <p className="text-[17px] text-white/50 leading-[1.8] mb-8 max-w-2xl">
            A slow, outdated website tells every visitor — before they even read a word — that you're not the
            right choice. We fix that. Fast, modern, built for your business. Live in 48 hours, not months.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/book-demo">
              <button
                className="flex items-center gap-2 px-7 h-12 bg-white text-black hover:bg-neutral-100 text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ borderRadius: '4px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)' }}
              >
                Get a free quote <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a
              href="https://audit.voxaris.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 h-12 border border-white/[0.1] text-white/55 hover:text-white hover:border-white/[0.22] text-[14px] transition-all duration-200"
              style={{ borderRadius: '4px' }}
            >
              Free site audit →
            </a>
          </div>
        </motion.div>

        {/* Stat bar */}
        <motion.div
          className="mt-14 flex flex-wrap gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          {[
            { value: '48 hours', label: 'Avg. launch time' },
            { value: '90+', label: 'PageSpeed score' },
            { value: 'A+', label: 'Mobile grade' },
            { value: '100%', label: 'Custom-built' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-[22px] font-light text-violet-400">{s.value}</div>
              <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  const features = [
    { icon: Zap, title: 'Blazing fast load times', desc: 'Optimized for Core Web Vitals. Google rewards fast sites with higher rankings — and users bounce from slow ones in under 3 seconds.' },
    { icon: Smartphone, title: 'Mobile-first design', desc: 'Over 60% of searches are on mobile. Your site will look and work perfectly on every device, every screen size.' },
    { icon: BarChart3, title: 'Conversion-optimized layout', desc: 'Every page structured to guide visitors toward a phone call, form fill, or booking. Clear CTAs, logical flow, no dead ends.' },
    { icon: Search, title: 'Local SEO foundation', desc: 'Structured for Google Business, local keywords, and geographic targeting. Built to rank for the customers in your area.' },
    { icon: Shield, title: 'Secure and reliable', desc: 'SSL included, hosting-ready, and built on proven platforms. No worrying about your site going down during your busiest hours.' },
    { icon: Star, title: 'Your brand, elevated', desc: 'Clean, professional design that makes you look like the premium option — because you are. First impressions close deals.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-[0.06] pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">What you get</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
            Everything a modern website needs.
            <br />
            <span className="text-white/35">Nothing you don't.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-md bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/20 transition-all duration-300"
              {...fadeUp(i * 0.07)}
            >
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                <f.icon className="w-4 h-4 text-violet-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { num: '01', title: 'Kickoff call', desc: 'A quick 20-minute call to capture your business, goals, and voice. That one conversation is all we need.' },
    { num: '02', title: 'Design sprint', desc: 'We draft the layout, write the copy, and lock in a direction — same day. You review and approve.' },
    { num: '03', title: 'Build & optimize', desc: 'We build overnight with speed, SEO, and conversion in mind. No templates — custom for you.' },
    { num: '04', title: 'Launch & hand off', desc: 'Site goes live within 48 hours. You get analytics, editing access, and full ownership.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-14 text-center" {...fadeUp()}>
          <span className="eyebrow mb-3 block">The process</span>
          <h2
            className="font-editorial text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', letterSpacing: '-0.02em' }}
          >
            From kickoff to live in <em className="text-violet-400" style={{ fontStyle: 'italic' }}>48 hours.</em>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="p-6 rounded-md bg-white/[0.03] border border-white/[0.06]"
              {...fadeUp(i * 0.08)}
            >
              <div className="text-3xl font-light text-violet-400/30 font-mono mb-4">{step.num}</div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{step.desc}</p>
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
          <h2
            className="font-editorial text-white mb-4"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            Ready to stop losing customers
            <br />
            to a <em className="text-violet-400" style={{ fontStyle: 'italic' }}>bad website?</em>
          </h2>
          <p className="text-[14px] text-white/35 mb-8">
            Free audit, no obligation. Most projects launch in under 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/book-demo">
              <button
                className="flex items-center gap-2 px-8 h-12 bg-white text-black hover:bg-neutral-100 text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ borderRadius: '4px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)' }}
              >
                Book a Free Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a
              href="https://audit.voxaris.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 h-12 border border-white/[0.1] text-white/55 hover:text-white hover:border-white/[0.22] text-[14px] transition-all duration-200"
              style={{ borderRadius: '4px' }}
            >
              Free site audit →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
