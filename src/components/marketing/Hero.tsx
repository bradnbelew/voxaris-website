import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

/* Four products shown as live activity — all running right now */
const liveItems = [
  {
    product: 'V·TEAMS',
    status: 'Call in progress',
    detail: '(407) 555-0142 · Qualifier routing to specialist',
    dot: 'bg-emerald-500',
    ping: 'bg-emerald-400',
  },
  {
    product: 'AI Hiring',
    status: 'Interview complete',
    detail: 'Sarah M. · Sales Rep · Fit score: 92 · Strong hire',
    dot: 'bg-blue-400',
    ping: 'bg-blue-300',
  },
  {
    product: 'Talking Postcards',
    status: 'Appointment booked',
    detail: 'Michael T. scanned QR 3 min ago · Synced to CRM',
    dot: 'bg-gold-500',
    ping: 'bg-gold-400',
  },
  {
    product: 'Presence',
    status: 'Cited in AI search',
    detail: 'ChatGPT · "Best HVAC contractor Orlando" · 3× today',
    dot: 'bg-violet-400',
    ping: 'bg-violet-300',
  },
];

export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pt-16"
      style={{ background: '#030303' }}
    >
      {/* Background — single warm amber bloom from top center */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-100"
          style={{
            background:
              'radial-gradient(ellipse at 50% -10%, rgba(212,168,67,0.10) 0%, rgba(212,168,67,0.03) 35%, transparent 65%)',
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.12]" />
      </div>

      {/* Content — centered stack */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 text-center py-20">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] text-[11px] font-semibold text-white/40 uppercase tracking-[0.2em]">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            AI Platform · 4 Products
          </span>
        </motion.div>

        {/* Headline — 2 lines, tight */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
          className="font-bold text-white leading-[1.0] tracking-[-0.04em] mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
        >
          Your business,
          <br />
          <span className="text-gold-gradient">working 24/7.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="text-[17px] sm:text-[18px] text-white/45 leading-[1.75] max-w-2xl mx-auto mb-10"
        >
          Four AI products that answer every call, screen every hire, convert every
          mailer, and own your web presence — automatically.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link to="/book-demo">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white h-13 px-9 text-[15px] font-semibold rounded-full group shadow-gold-btn border border-gold-400/30 transition-all duration-500 hover:-translate-y-0.5 w-full sm:w-auto"
              style={{ height: '52px' }}
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#products">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/40 hover:text-white hover:bg-white/[0.05] h-[52px] px-8 text-[15px] rounded-full border border-white/[0.08] hover:border-white/[0.16] transition-all duration-300 w-full sm:w-auto"
            >
              See All Products
            </Button>
          </a>
        </motion.div>

        {/* Live Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mx-auto max-w-2xl"
        >
          <div
            className="rounded-2xl border border-white/[0.07] overflow-hidden text-left"
            style={{ background: '#0a0a0a' }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-medium text-white/40 font-mono">
                  4 agents active right now
                </span>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] font-mono">
                Live
              </span>
            </div>

            {/* Activity rows */}
            <div>
              {liveItems.map((item, i) => (
                <motion.div
                  key={item.product}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.12, ease }}
                  className="flex items-start gap-3.5 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Status dot */}
                  <span className="relative flex h-2 w-2 shrink-0 mt-[5px]">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${item.ping} opacity-40`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${item.dot}`} />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2.5 flex-wrap">
                      <span className="text-[12px] font-bold text-white/65 font-mono whitespace-nowrap">
                        {item.product}
                      </span>
                      <span className="text-[12px] text-white/45">{item.status}</span>
                    </div>
                    <p className="text-[11px] text-white/25 font-mono mt-0.5 truncate">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subtle glow under card */}
          <div
            className="h-px w-3/4 mx-auto mt-0"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(212,168,67,0.15) 50%, transparent)',
            }}
          />
        </motion.div>

        {/* Social proof — metrics, not logos (early stage) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-[12px] text-white/25"
        >
          {[
            '< 5s answer time',
            'Works with any CRM',
            'Live in 48 hours',
            'No long-term contracts',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-px h-3 bg-white/[0.12]" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade to page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #030303)',
        }}
      />
    </section>
  );
}
