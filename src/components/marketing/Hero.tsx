import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { AuroraText } from '@/components/magicui/aurora-text';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { Meteors } from '@/components/magicui/meteors';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pt-16"
      style={{ background: '#000' }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm amber bloom */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% -10%, rgba(212,168,67,0.14) 0%, rgba(212,168,67,0.04) 35%, transparent 65%)',
          }}
        />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-0 noise-overlay opacity-[0.1]" />
      </div>

      {/* Meteors — subtle ambient motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Meteors number={14} minDuration={4} maxDuration={10} />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 text-center py-20">
        {/* Eyebrow — shimmering pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-9 flex justify-center"
        >
          <div
            className="group relative inline-flex items-center gap-2 px-4 py-1.5 border border-white/[0.1] bg-white/[0.03] backdrop-blur-sm"
            style={{ borderRadius: '999px' }}
          >
            <Sparkles className="w-3 h-3 text-gold-400" />
            <AnimatedShinyText className="text-[11px] font-mono uppercase tracking-[0.15em]">
              Four solutions · One growth stack
            </AnimatedShinyText>
          </div>
        </motion.div>

        {/* Headline — clean bold sans with aurora gold */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08, ease }}
          className="font-bold text-white leading-[1.02] mb-6"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', letterSpacing: '-0.04em' }}
        >
          The tools your competitors
          <br />
          <AuroraText colors={['#d4a843', '#f1c578', '#ecae4a', '#fbefd6', '#d4a843']}>
            don't have yet.
          </AuroraText>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease }}
          className="text-[17px] sm:text-[18px] text-white/50 leading-[1.7] max-w-2xl mx-auto mb-10"
        >
          AI hiring that phones every applicant. Direct mail that books appointments.
          Websites that convert. Search visibility that compounds. Pick one or use all four.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link to="/book-demo" className="w-full sm:w-auto">
            <button
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2 h-[52px] px-8 text-[14px] font-medium text-black bg-white hover:bg-neutral-100 transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
              style={{
                borderRadius: '6px',
                boxShadow:
                  '0 1px 0 rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px -8px rgba(212,168,67,0.3)',
              }}
            >
              See a Live Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href="#solutions" className="w-full sm:w-auto">
            <button
              className="flex w-full sm:w-auto items-center justify-center h-[52px] px-8 text-[14px] font-medium text-white/60 hover:text-white hover:border-white/25 transition-all duration-200"
              style={{ borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent' }}
            >
              Explore Solutions
            </button>
          </a>
        </motion.div>

        {/* Hero Image with Border Beam */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="mx-auto max-w-3xl relative"
        >
          {/* Ambient glow */}
          <div
            className="absolute -inset-12 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.2) 0%, transparent 60%)' }}
          />

          <div
            className="relative overflow-hidden border border-white/[0.08]"
            style={{
              borderRadius: '12px',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}
          >
            <img
              src="/maria-hero.png"
              alt="Voxaris AI video agent — photorealistic, live, answering calls and booking appointments 24/7"
              className="w-full h-auto block"
              loading="eager"
            />

            {/* Live indicator overlay */}
            <div
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10"
              style={{ borderRadius: '6px' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.15em]">Live</span>
            </div>

            {/* Bottom caption bar */}
            <div
              className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))',
              }}
            >
              <div className="text-left">
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mb-0.5">
                  Maria · AI Video Agent
                </div>
                <div className="text-[12px] text-white/75">
                  "Hi Michael — let's find you a time that works."
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/30">00:42</div>
            </div>

            {/* Animated border beams (two, offset) */}
            <BorderBeam size={120} duration={8} colorFrom="#d4a843" colorTo="rgba(212,168,67,0)" />
            <BorderBeam
              size={120}
              duration={8}
              delay={4}
              colorFrom="#f1c578"
              colorTo="rgba(241,197,120,0)"
              reverse
            />
          </div>

          {/* Subtle glow line under image */}
          <div
            className="h-px w-3/4 mx-auto mt-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,67,0.25) 50%, transparent)' }}
          />
        </motion.div>

        {/* Stat row with NumberTicker */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
        >
          {[
            { value: 5, suffix: 's', label: 'Avg answer time', prefix: '<' },
            { value: 48, suffix: 'h', label: 'Website launch' },
            { value: 9, suffix: '×', label: 'AI search citations' },
            { value: 24, suffix: '/7', label: 'Live coverage' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[28px] font-light text-white tabular-nums leading-none">
                {stat.prefix}
                <NumberTicker value={stat.value} className="text-gold-400" />
                <span className="text-gold-400">{stat.suffix}</span>
              </div>
              <div className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #000)' }}
      />
    </section>
  );
}
