import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ShineBorder } from '@/components/magicui/shine-border';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      data-section="hero"
      className="relative flex flex-col items-center justify-center min-h-[92vh] overflow-hidden pt-20 pb-16"
      style={{ background: '#000' }}
    >
      {/* Single, subtle amber wash — no competing effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.09) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Founder stamp — grounded, human */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 flex items-center justify-center gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/40">
            Built in Orlando · By Ethan Stopperich
          </span>
        </motion.div>

        {/* Headline — says what we are in one line */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease }}
          className="font-semibold text-white leading-[1.04] mb-7"
          style={{ fontSize: 'clamp(2.5rem, 6.2vw, 4.75rem)', letterSpacing: '-0.035em' }}
        >
          AI video agents{' '}
          <span className="text-gold-400">for dealerships</span>
          <br />
          and local business.
        </motion.h1>

        {/* Subhead — one sentence, concrete */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease }}
          className="text-[17px] sm:text-[19px] text-white/55 leading-[1.6] max-w-2xl mx-auto mb-10"
        >
          We build the AI that answers your leads, interviews your applicants,
          and turns direct mail into live conversations. You run the shop.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link to="/book-demo" className="w-full sm:w-auto">
            <button
              className="group flex w-full sm:w-auto items-center justify-center gap-2 h-[52px] px-9 text-[14px] font-semibold text-white rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 border border-gold-400/30 shadow-gold-btn transition-all duration-300 hover:-translate-y-0.5"
            >
              See one live
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a href="tel:+14077594100" className="w-full sm:w-auto">
            <button
              className="flex w-full sm:w-auto items-center justify-center h-[52px] px-8 text-[14px] font-medium text-white/60 hover:text-white rounded-full border border-white/[0.12] hover:border-white/[0.25] transition-all duration-200"
            >
              Call (407) 759-4100
            </button>
          </a>
        </motion.div>

        {/* Hero Image — real product demo, no fake captions */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="mx-auto max-w-3xl relative"
        >
          <div
            className="relative overflow-hidden border border-white/[0.08]"
            style={{
              borderRadius: '12px',
              boxShadow: '0 30px 80px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03) inset',
            }}
          >
            <img
              src="/maria-hero.png"
              alt="Voxaris AI video agent — photorealistic, answering a live lead"
              className="w-full h-auto block"
              loading="eager"
            />

            {/* Plain live indicator — no invented transcript */}
            <div
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10"
              style={{ borderRadius: '6px' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.15em]">Live call</span>
            </div>

            <ShineBorder
              borderWidth={2}
              duration={18}
              shineColor={['#d4a843', 'transparent', '#f1c578', 'transparent']}
            />
          </div>

          {/* Honest caption underneath — not a fake quote on the image */}
          <p className="mt-5 text-[12px] text-white/35 font-mono tracking-wide">
            An AI video agent answering a live lead. Every call recorded, transcribed, and scored.
          </p>
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
