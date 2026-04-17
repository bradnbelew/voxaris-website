import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Users, Mail, BarChart3 } from 'lucide-react';
import {
  Navbar,
  Hero,
  Footer,
  LogoMarquee,
  TabbedScenarios,
  FounderSection,
  FAQ,
} from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease },
});

export function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Voxaris | AI Video Agents for Dealerships & Local Business</title>
        <meta
          name="description"
          content="AI video agents that answer your leads, interview your applicants, and turn direct mail into live conversations. Built for auto dealers, home services, and local businesses."
        />
        <link rel="canonical" href="https://voxaris.io/" />
        <meta
          property="og:title"
          content="Voxaris | AI Video Agents for Dealerships & Local Business"
        />
        <meta
          property="og:description"
          content="AI video agents for hiring, direct mail, website conversion, and AI search. Built in Orlando."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <Hero />
        <LogoMarquee />
        <StatsRow />
        <TabbedScenarios />
        <FounderSection />
        <FAQ />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Stats Row — light surface, big numbers
═════════════════════════════════════════════ */
function StatsRow() {
  const stats = [
    {
      icon: Phone,
      value: '< 5s',
      label: 'Average time to answer a lead',
    },
    {
      icon: Users,
      value: '10×',
      label: 'More candidates screened',
    },
    {
      icon: Mail,
      value: '6–12%',
      label: 'Direct mail response rate',
    },
    {
      icon: BarChart3,
      value: '48h',
      label: 'Website launch time',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-12" {...fadeUp()}>
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-carbon-500 mb-3 block">
            The numbers
          </span>
          <h2 className="text-3xl sm:text-5xl font-light text-carbon-900 leading-[1.05] max-w-2xl">
            What happens when AI
            <br />
            <span className="text-carbon-400">handles the busywork.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-carbon-200 border border-carbon-200 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-white p-7 lg:p-9"
              {...fadeUp(i * 0.08)}
            >
              <s.icon className="w-5 h-5 text-gold-500 mb-5" strokeWidth={1.5} />
              <div className="text-4xl lg:text-5xl font-light text-carbon-900 tabular-nums mb-2">
                {s.value}
              </div>
              <div className="text-[12px] text-carbon-500 leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Bottom CTA — dark, condensed
═════════════════════════════════════════════ */
function BottomCTA() {
  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.08) 0%, transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.h2
          className="text-4xl sm:text-6xl font-light text-white leading-[1.02] mb-6"
          style={{ letterSpacing: '-0.035em' }}
          {...fadeUp()}
        >
          See it answer a live lead.
          <br />
          <span className="text-gold-400">Fifteen minutes.</span>
        </motion.h2>

        <motion.p
          className="text-[16px] sm:text-[18px] text-white/50 leading-relaxed mb-10 max-w-xl mx-auto"
          {...fadeUp(0.1)}
        >
          No slides. No pitch deck. We'll pull up the exact tools, run a call live, and
          quote you the same day.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          {...fadeUp(0.2)}
        >
          <Link to="/book-demo">
            <button className="group flex items-center gap-2 h-[52px] px-9 text-[14px] font-semibold text-white rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 border border-gold-400/30 shadow-gold-btn transition-all duration-300 hover:-translate-y-0.5">
              Book a free demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a
            href="https://audit.voxaris.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center h-[52px] px-7 text-[14px] font-medium text-white/60 hover:text-white rounded-full border border-white/[0.12] hover:border-white/[0.25] transition-all duration-200"
          >
            Free website audit →
          </a>
        </motion.div>

        <motion.p
          className="mt-7 text-[11px] font-mono uppercase tracking-[0.2em] text-white/25"
          {...fadeUp(0.3)}
        >
          No commitment · Same-day response · Live in 48 hours
        </motion.p>
      </div>
    </section>
  );
}
