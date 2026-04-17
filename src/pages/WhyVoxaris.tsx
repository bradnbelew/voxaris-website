import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, Users, Globe, Search, Mail,
  Zap, Clock, Shield, TrendingUp,
} from 'lucide-react';
import { Navbar, Footer } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease },
});

export default function WhyVoxaris() {
  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Why Voxaris | The Growth Stack for Local Businesses</title>
        <meta name="description" content="Voxaris isn't software you have to figure out. It's a done-for-you growth stack — 4 AI tools that work together. Hire better, market smarter, rank higher." />
        <link rel="canonical" href="https://voxaris.io/why-voxaris" />
        <meta property="og:title" content="Why Voxaris | Built for Local Businesses That Want to Grow" />
        <meta property="og:description" content="Done-for-you AI tools for local businesses. We build it, run it, and manage it — you focus on the work." />
        <meta property="og:url" content="https://voxaris.io/why-voxaris" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <TerminalSection />
        <ReasonsSection />
        <StackSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(212,168,67,0.10) 0%, rgba(212,168,67,0.03) 35%, transparent 65%)' }}
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
            <div className="w-8 h-8 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-gold-400" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-mono text-gold-400/70 uppercase tracking-[0.15em]">Why Voxaris</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-white leading-[1.05] tracking-[-0.03em] mb-6">
            Not software you figure out.
            <br />
            <span className="text-gold-400">A stack we run for you.</span>
          </h1>

          <p className="text-[17px] text-white/50 leading-[1.8] mb-8 max-w-2xl">
            Most AI tools hand you a login and wish you luck. We build, configure, and manage four
            AI-powered systems for your business — and you stay focused on the work that actually makes you money.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/book-demo">
              <button className="flex items-center gap-2 px-7 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 group">
                See a live demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a
              href="https://audit.voxaris.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 h-12 rounded-full border border-white/[0.1] text-white/50 hover:text-white hover:border-white/[0.2] text-[14px] transition-all duration-300"
            >
              Free site audit →
            </a>
          </div>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-wrap gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          {[
            { value: '4', label: 'Solutions in one stack' },
            { value: '48h', label: 'Avg. go-live time' },
            { value: '0', label: 'Long-term contracts' },
            { value: 'SMB', label: 'Built for local business' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-[22px] font-light text-gold-400">{s.value}</div>
              <div className="text-[10px] font-mono text-white/25 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Terminal comparison ─── */
function TerminalSection() {
  const others = [
    '$ sign_up_for_saas_tool_#47',
    '> Onboarding: 6 hours of video',
    '> Need dev to integrate APIs',
    '> Annual contract required',
    '> Dashboard full, leads still lost',
    'Error: Expected results not found',
    'Error: Support ticket #3,847 open',
  ];

  const voxaris = [
    '$ voxaris --deploy --for-you',
    '✓ Discovery call: 30 min',
    '✓ Configuration: we handle it',
    '✓ Live in 48h — no dev needed',
    '✓ Month-to-month, cancel anytime',
    '✓ 4 solutions compounding together',
    '✓ Results tracked, reported monthly',
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-[0.06] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div className="text-center mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">The difference</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white">
            Everyone else gives you a login.
            <br />
            <span className="text-white/35">We give you a running system.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Others */}
          <motion.div {...fadeUp(0.1)} className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="text-[11px] font-mono text-white/20 ml-1">other-saas-tool.sh</span>
            </div>
            <div className="p-5 font-mono space-y-2">
              {others.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease }}
                  className={`text-[12px] leading-relaxed ${
                    line.startsWith('Error:') ? 'text-red-400/70' :
                    line.startsWith('>') ? 'text-white/25' : 'text-white/40'
                  }`}
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Voxaris */}
          <motion.div {...fadeUp(0.15)} className="rounded-2xl overflow-hidden border border-gold-500/20 bg-gold-500/[0.03]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gold-500/10 bg-gold-500/[0.03]">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>
              <span className="text-[11px] font-mono text-gold-400/50 ml-1">voxaris.sh</span>
            </div>
            <div className="p-5 font-mono space-y-2">
              {voxaris.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.06, ease }}
                  className={`text-[12px] leading-relaxed ${
                    line.startsWith('✓') ? 'text-emerald-400/80' :
                    line.startsWith('$') ? 'text-gold-400' : 'text-white/40'
                  }`}
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Reasons grid ─── */
function ReasonsSection() {
  const reasons = [
    {
      icon: Zap,
      title: 'Done-for-you, not DIY',
      desc: "We configure, launch, and manage everything. You don't need a dev team, an IT person, or 40 hours to figure out a new platform.",
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
    },
    {
      icon: Users,
      title: 'Built for local businesses',
      desc: "We're not a tool for Fortune 500 companies. We specialize in local businesses that compete on reputation, speed, and service.",
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Shield,
      title: 'No long-term contracts',
      desc: "Month-to-month because we want you to stay for the results, not because you're trapped. Cancel anytime, no questions asked.",
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
    },
    {
      icon: Globe,
      title: 'Four solutions that compound',
      desc: "Each tool feeds the next. A better website ranks higher. Better rankings bring more candidates. More candidates close more jobs. It stacks.",
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Clock,
      title: 'Live in days, not months',
      desc: "Most projects go live in 48 hours to 3 weeks depending on the solution. No six-month implementation project. No consultants.",
      color: 'text-gold-400',
      bg: 'bg-gold-500/10',
    },
    {
      icon: TrendingUp,
      title: 'Results, not reports',
      desc: "We track what matters — hires made, appointments booked, citations earned, leads converted. Not vanity metrics on a dashboard.",
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">Six reasons</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white">
            Why operators choose Voxaris.
            <br />
            <span className="text-white/35">Over and over.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              {...fadeUp(i * 0.07)}
            >
              <div className={`w-9 h-9 rounded-xl ${r.bg} flex items-center justify-center mb-4`}>
                <r.icon className={`w-4 h-4 ${r.color}`} strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{r.title}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stack section ─── */
function StackSection() {
  const solutions = [
    {
      icon: Users,
      label: 'Hiring Intelligence',
      status: 'ACTIVE',
      stat: '247 candidates screened',
      dot: 'bg-blue-400',
      ping: 'bg-blue-300',
      href: '/solutions/hiring-intelligence',
      desc: 'AI calls every applicant within 5 minutes. Scores them. Sends you the top 3.',
    },
    {
      icon: Mail,
      label: 'Talking Postcards',
      status: 'ACTIVE',
      stat: '38 QR scans today',
      dot: 'bg-gold-500',
      ping: 'bg-gold-400',
      href: '/talking-postcard',
      desc: 'Handwritten mailers with QR codes that launch a live AI video conversation.',
    },
    {
      icon: Globe,
      label: 'Website Redesign',
      status: 'LIVE',
      stat: 'PageSpeed 96 · Mobile A+',
      dot: 'bg-violet-400',
      ping: 'bg-violet-300',
      href: '/solutions/website-redesign',
      desc: 'Fast, modern, conversion-optimized site built for your business. Live in weeks.',
    },
    {
      icon: Search,
      label: 'AEO-GEO Optimization',
      status: 'RANKING',
      stat: '9× cited in AI search this week',
      dot: 'bg-emerald-500',
      ping: 'bg-emerald-400',
      href: '/solutions/aeo-geo',
      desc: "Show up when ChatGPT, Perplexity, and Google AI answer 'best [your service] in [your city].'",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-carbon-950 relative overflow-hidden">
      <div className="absolute inset-0 noise-overlay opacity-[0.06] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 relative z-10">
        <motion.div className="mb-14" {...fadeUp()}>
          <span className="eyebrow mb-3 block">The Voxaris stack</span>
          <h2 className="text-3xl sm:text-4xl font-light text-white">
            Four solutions.
            <br />
            <span className="text-white/35">All running. All compounding.</span>
          </h2>
        </motion.div>

        {/* System panel */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-2xl border border-white/[0.07] overflow-hidden mb-10"
          style={{ background: '#0a0a0a' }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-white/40 font-mono">voxaris-stack — 4 solutions active</span>
            </div>
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] font-mono">LIVE</span>
          </div>

          {solutions.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease }}
              className="flex items-start gap-3.5 px-5 py-4 border-b border-white/[0.04] last:border-0"
            >
              <span className="relative flex h-2 w-2 shrink-0 mt-[5px]">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${s.ping} opacity-40`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${s.dot}`} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-[12px] font-bold text-white/65 font-mono">{s.label}</span>
                  <span className="text-[11px] text-white/35 font-mono">[{s.status}]</span>
                </div>
                <p className="text-[11px] text-white/25 font-mono mt-0.5">{s.stat}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Solution cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {solutions.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp(0.15 + i * 0.07)}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <s.icon className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                </div>
                <Link to={s.href} className="text-[11px] font-mono text-white/20 group-hover:text-white/50 transition-colors">
                  explore →
                </Link>
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-2">{s.label}</h3>
              <p className="text-[12px] text-white/35 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <motion.div {...fadeUp()}>
          <h2 className="text-3xl font-light text-white mb-4">
            See it for yourself.
            <br />
            <span className="text-white/35">No pitch deck. Just the product.</span>
          </h2>
          <p className="text-[14px] text-white/35 mb-8">
            30-minute demo. We'll show you exactly what each solution does and what it would look like for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/book-demo">
              <button className="flex items-center gap-2 px-8 h-12 rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white text-[14px] font-semibold border border-gold-400/30 shadow-gold-sm transition-all duration-300 hover:-translate-y-0.5 group">
                Book a free demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <a
              href="https://audit.voxaris.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 h-12 rounded-full border border-white/[0.1] text-white/45 hover:text-white hover:border-white/[0.2] text-[14px] transition-all duration-300"
            >
              Free site audit →
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-[11px] font-mono text-white/20">
            {['No commitment', 'Month-to-month', 'Live in 48h', 'Orlando, FL'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
