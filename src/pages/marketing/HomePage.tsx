import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { BorderBeam } from '@/components/magicui/border-beam';
import {
  ArrowRight,
  Users,
  Mail,
  Globe,
  Search,
  CheckCircle2,
  Phone,
  MapPin,
  Zap,
  BarChart3,
  Star,
} from 'lucide-react';
import { Navbar, Hero, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

/* ── Solution tile data ── */
const solutionTiles = [
  {
    id: 'hiring',
    label: 'Hiring Intelligence',
    href: '/solutions/hiring-intelligence',
    tagline: 'Phone every applicant. Rank the best.',
    body: 'AI agents call every candidate within minutes of applying — consistent 10-minute screen, automatic scoring, ranked dashboard. Your team reviews only the top fits.',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/15',
    glow: 'rgba(59,130,246,0.08)',
    stat: { value: '10×', label: 'more candidates screened' },
    bullets: ['Calls every applicant within minutes', 'AI scores fit, experience & availability', 'Ranked shortlist with full transcripts'],
    wide: true,
  },
  {
    id: 'postcards',
    label: 'Talking Postcards',
    href: '/talking-postcard',
    tagline: 'Your mail just got a face and a voice.',
    body: 'Physical postcards with unique QR codes. Scan → live AI video agent greets them by name, references their exact offer, books the appointment in under 2 minutes.',
    icon: Mail,
    color: 'text-gold-400',
    bg: 'bg-gold-500/10',
    border: 'border-gold-500/15',
    glow: 'rgba(212,168,67,0.07)',
    stat: { value: '6–12%', label: 'response rate' },
    bullets: ['Greets by name, references their offer', 'Books appointment in < 2 minutes', 'Every scan logged to your CRM'],
    wide: false,
  },
  {
    id: 'website',
    label: 'Website Redesign',
    href: '/solutions/website-redesign',
    tagline: 'A site that actually converts.',
    body: 'Fast, modern, mobile-first website built for your business. Conversion-optimized layout, local SEO foundation, and live in weeks — not months.',
    icon: Globe,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/15',
    glow: 'rgba(139,92,246,0.07)',
    stat: { value: '48h', label: 'launch time' },
    bullets: ['Built and launched in 48 hours', 'Mobile-first, PageSpeed 90+', 'Contact forms, maps & local SEO ready'],
    wide: false,
  },
  {
    id: 'aeo',
    label: 'AEO-GEO Optimization',
    href: '/solutions/aeo-geo',
    tagline: 'Show up first. Everywhere that matters.',
    body: 'Get cited by ChatGPT, Perplexity, and Google AI Overviews. Dominate local search. Free audit included — then monthly optimization keeps you ranked and referenced.',
    icon: Search,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/15',
    glow: 'rgba(16,185,129,0.07)',
    stat: { value: '9×', label: 'AI search citations' },
    bullets: ['Free website audit at audit.voxaris.io', 'Optimized for ChatGPT, Perplexity & Google AI', 'Monthly updates + ongoing ranking reports'],
    wide: true,
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Voxaris | AI Hiring, Talking Postcards, Website Redesign & AEO-GEO Optimization</title>
        <meta name="description" content="Four growth solutions for modern businesses: AI Hiring Intelligence, Talking Postcards, Website Redesign, and AEO-GEO Optimization. Built to convert." />
        <link rel="canonical" href="https://voxaris.io/" />
        <meta property="og:title" content="Voxaris | The Growth Stack for Modern Businesses" />
        <meta property="og:description" content="AI hiring agents, direct mail that books appointments, websites that convert, and AI search optimization. Pick one or use all four." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voxaris.io/" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      <Navbar />
      <main id="main-content">
        <Hero />
        <SolutionsBento />
        <StatsStrip />
        <HowItAll />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Solutions Bento Grid
══════════════════════════════════════════════ */
function SolutionsBento() {
  return (
    <section id="solutions" className="py-24 lg:py-32 bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">

        {/* Section header */}
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">Solutions</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
            Four ways your business gets ahead.
          </h2>
          <p className="text-[15px] text-white/40 max-w-xl leading-relaxed">
            Each solution solves a different revenue gap. Use one, or combine them for
            compounding results.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Row 1: wide (2col) + narrow (1col) */}
          {solutionTiles.slice(0, 2).map((tile, i) => (
            <motion.div
              key={tile.id}
              className={`relative rounded-md border ${tile.border} bg-white/[0.03] overflow-hidden group cursor-pointer ${
                tile.wide ? 'md:col-span-2' : 'md:col-span-1'
              }`}
              {...fadeUp(i * 0.08)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${tile.glow} 0%, transparent 60%)` }}
              />

              <Link to={tile.href} className="block p-7 h-full">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl ${tile.bg} flex items-center justify-center`}>
                    <tile.icon className={`w-5 h-5 ${tile.color}`} strokeWidth={1.5} />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-light ${tile.color}`}>{tile.stat.value}</div>
                    <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider">{tile.stat.label}</div>
                  </div>
                </div>

                <div className="mb-1.5">
                  <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.1em]">{tile.label}</span>
                </div>
                <h3 className="text-[20px] font-light text-white leading-snug mb-3">{tile.tagline}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-6">{tile.body}</p>

                <ul className="space-y-2 mb-7">
                  {tile.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12px] text-white/35">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${tile.color} opacity-70 shrink-0 mt-0.5`} strokeWidth={2} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${tile.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Row 2: narrow (1col) + wide (2col) */}
          {solutionTiles.slice(2, 4).map((tile, i) => (
            <motion.div
              key={tile.id}
              className={`relative rounded-md border ${tile.border} bg-white/[0.03] overflow-hidden group cursor-pointer ${
                tile.wide ? 'md:col-span-2' : 'md:col-span-1'
              }`}
              {...fadeUp(0.16 + i * 0.08)}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${tile.glow} 0%, transparent 60%)` }}
              />

              <Link to={tile.href} className="block p-7 h-full">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-10 h-10 rounded-xl ${tile.bg} flex items-center justify-center`}>
                    <tile.icon className={`w-5 h-5 ${tile.color}`} strokeWidth={1.5} />
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-light ${tile.color}`}>{tile.stat.value}</div>
                    <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider">{tile.stat.label}</div>
                  </div>
                </div>

                <div className="mb-1.5">
                  <span className="text-[10px] font-mono text-white/25 uppercase tracking-[0.1em]">{tile.label}</span>
                </div>
                <h3 className="text-[20px] font-light text-white leading-snug mb-3">{tile.tagline}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-6">{tile.body}</p>

                <ul className="space-y-2 mb-7">
                  {tile.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[12px] text-white/35">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${tile.color} opacity-70 shrink-0 mt-0.5`} strokeWidth={2} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className={`inline-flex items-center gap-1.5 text-[12px] font-semibold ${tile.color} opacity-70 group-hover:opacity-100 transition-opacity`}>
                  Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Stats Strip
══════════════════════════════════════════════ */
function StatsStrip() {
  const stats: Array<{ num: number; prefix?: string; suffix: string; label: string }> = [
    { num: 10, suffix: '×', label: 'More candidates screened' },
    { num: 12, suffix: '%', label: 'Direct mail response rate' },
    { num: 5, prefix: '<', suffix: 's', label: 'Average call answer time' },
    { num: 48, suffix: 'h', label: 'Average launch time' },
  ];

  return (
    <section className="py-10 bg-carbon-950 border-y border-white/[0.04]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8">
        <motion.div
          className="flex flex-wrap justify-center gap-10 sm:gap-16"
          {...fadeUp()}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-[22px] font-light text-gold-400 font-display tabular-nums">
                {s.prefix}
                <NumberTicker value={s.num} className="text-gold-400" />
                {s.suffix}
              </span>
              <span className="text-[11px] text-white/30 max-w-[80px] leading-tight font-mono uppercase tracking-wide">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   How It All Fits Together
══════════════════════════════════════════════ */
function HowItAll() {
  const steps = [
    {
      num: '01',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      title: 'Hire faster with AI',
      desc: 'Every applicant gets a call within minutes. AI interviews, scores, and ranks them. Your team only speaks to the top candidates — no more resume piles.',
    },
    {
      num: '02',
      icon: Mail,
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
      title: 'Turn mail into conversations',
      desc: 'A personalized postcard lands in their mailbox. They scan a QR code. An AI agent greets them by name and books the appointment. All while you sleep.',
    },
    {
      num: '03',
      icon: Globe,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      title: 'Launch a site that earns',
      desc: 'A modern, fast, mobile-first website built for your industry. Conversion-optimized from day one. Live in 48 hours — not 6 months.',
    },
    {
      num: '04',
      icon: Search,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      title: 'Dominate AI & local search',
      desc: 'Get cited when people ask ChatGPT, Perplexity, or Google\'s AI for businesses like yours. Monthly optimization keeps you ahead as the algorithms evolve.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-40"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.04) 0%, transparent 65%)' }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div className="text-center mb-16" {...fadeUp()}>
          <span className="eyebrow mb-3 block">How it works</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
            Four problems. Four solutions.
            <br />
            <span className="text-white/35">One partner.</span>
          </h2>
          <p className="text-[15px] text-white/40 max-w-lg mx-auto">
            Each solution is standalone. Combine them and they compound — each one feeds the next.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.10] transition-all duration-300"
              {...fadeUp(i * 0.08)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl ${step.bg} flex items-center justify-center`}>
                  <step.icon className={`w-4 h-4 ${step.color}`} strokeWidth={1.5} />
                </div>
                <span className={`text-[11px] font-mono ${step.color} opacity-50`}>{step.num}</span>
              </div>
              <h3 className="text-[15px] font-medium text-white mb-2.5">{step.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bundle callout */}
        <motion.div
          className="mt-10 relative p-6 border border-gold-500/20 bg-gold-500/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden"
          style={{ borderRadius: '6px' }}
          {...fadeUp(0.3)}
        >
          <BorderBeam size={80} duration={8} colorFrom="#d4a843" colorTo="rgba(212,168,67,0)" />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Star className="w-3.5 h-3.5 text-gold-400" strokeWidth={1.5} />
              <span className="text-[11px] font-mono text-gold-400/70 uppercase tracking-[0.1em]">Best value</span>
            </div>
            <p className="text-[15px] font-medium text-white">
              Bundle Website Redesign + AEO-GEO Optimization
            </p>
            <p className="text-[13px] text-white/40 mt-1">
              New site + ongoing AI search optimization — hosting included.
            </p>
          </div>
          <Link
            to="/book-demo"
            className="shrink-0 flex items-center gap-2 px-6 h-10 bg-white text-black hover:bg-neutral-100 text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5 group"
            style={{ borderRadius: '4px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)' }}
          >
            Get the bundle <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   Final CTA
══════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="py-24 lg:py-32 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 65%)' }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.08]" />
      </div>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center relative z-10">
        <motion.div {...fadeUp()}>
          <span className="eyebrow text-white/25 mb-5 block">Get started</span>
          <h2 className="text-3xl sm:text-[2.75rem] font-light text-white mb-5 leading-tight">
            See exactly how it
            <br />
            <span className="text-gold-gradient">works for your business.</span>
          </h2>
          <p className="text-[15px] text-white/40 mb-10 leading-relaxed">
            15-minute live demo. No slides, no pitch deck.
            We'll show you the exact tools working in real time.
          </p>
        </motion.div>

        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" {...fadeUp(0.1)}>
          <Link to="/book-demo">
            <button
              className="flex items-center gap-2 px-8 bg-white text-black hover:bg-neutral-100 text-[14px] font-medium transition-all duration-200 hover:-translate-y-0.5 group"
              style={{ height: '52px', borderRadius: '4px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px -8px rgba(212,168,67,0.25)' }}
            >
              Book a Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a
            href="https://audit.voxaris.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 h-[52px] border border-white/[0.1] text-white/55 hover:text-white hover:border-white/[0.22] text-[14px] transition-all duration-200"
            style={{ borderRadius: '4px' }}
          >
            Free website audit →
          </a>
        </motion.div>

        <motion.p className="mt-7 text-[11px] text-white/20 font-mono" {...fadeUp(0.2)}>
          No commitment · Same-day response · Live in 48 hours
        </motion.p>
      </div>
    </section>
  );
}
