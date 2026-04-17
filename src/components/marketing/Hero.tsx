import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pt-16"
      style={{ background: '#000' }}
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
          <span className="inline-flex items-center gap-2.5 px-3 py-1.5 border border-white/[0.08] bg-white/[0.04] text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]" style={{ borderRadius: '3px' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            Four solutions. One growth stack.
          </span>
        </motion.div>

        {/* Headline — clean, tight bold sans */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
          className="font-bold text-white leading-[1.02] mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
        >
          The tools your competitors
          <br />
          <span className="text-gold-gradient">don't have yet.</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="text-[17px] sm:text-[18px] text-white/45 leading-[1.75] max-w-2xl mx-auto mb-10"
        >
          AI hiring that phones every applicant. Direct mail that books appointments.
          Websites that convert. Search visibility that compounds. Pick one or use all four.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <Link to="/book-demo" className="w-full sm:w-auto">
            <button
              className="group flex w-full sm:w-auto items-center justify-center gap-2 h-[52px] px-8 text-[14px] font-medium text-black bg-white hover:bg-neutral-100 transition-all duration-200 hover:-translate-y-0.5"
              style={{ borderRadius: '4px', boxShadow: '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px -8px rgba(212,168,67,0.25)' }}
            >
              See a Live Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href="#solutions" className="w-full sm:w-auto">
            <button
              className="flex w-full sm:w-auto items-center justify-center h-[52px] px-8 text-[14px] font-medium text-white/55 hover:text-white transition-all duration-200"
              style={{ borderRadius: '4px', border: '1px solid rgba(255,255,255,0.10)', background: 'transparent' }}
            >
              Explore Solutions
            </button>
          </a>
        </motion.div>

        {/* Hero Image — photorealistic AI agent */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mx-auto max-w-3xl relative"
        >
          {/* Ambient glow under image */}
          <div
            className="absolute -inset-8 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 60%)' }}
          />

          <div
            className="relative overflow-hidden border border-white/[0.08]"
            style={{ borderRadius: '8px', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.02) inset' }}
          >
            <img
              src="/maria-hero.png"
              alt="Voxaris AI video agent — photorealistic, live, answering calls and booking appointments 24/7"
              className="w-full h-auto block"
              loading="eager"
            />

            {/* Live indicator overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10" style={{ borderRadius: '4px' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.15em]">Live</span>
            </div>

            {/* Bottom gradient fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }}
            />
          </div>

          {/* Subtle glow line under image */}
          <div
            className="h-px w-3/4 mx-auto mt-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.2) 50%, transparent)' }}
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
          background: 'linear-gradient(to bottom, transparent, #000)',
        }}
      />
    </section>
  );
}
