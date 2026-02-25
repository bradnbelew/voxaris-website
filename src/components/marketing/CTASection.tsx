import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section data-section="cta" className="relative py-20 lg:py-28 bg-carbon-900 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 55%)' }}
        />
      </div>

      <div className="container-narrow text-center relative z-10">
        {/* Logo + tagline */}
        <motion.div
          className="flex flex-col items-center mb-14"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <img src="/voxaris-logo-white.png" alt="Voxaris AI" className="h-32 w-auto opacity-60" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="headline-xl text-white mb-7"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Your competitors are
          <br />
          <span className="text-white/60">already losing leads to AI.</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="text-lg text-white/40 mb-14 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          The question isn't whether AI will handle your sales conversations.
          It's whether you'll be the one using it — or losing to it.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/book-demo">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-carbon-900 h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-0.5"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/[0.06] h-14 px-8 text-[15px] font-medium rounded-full border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              Talk to Sales
            </Button>
          </Link>
        </motion.div>

        {/* Phone CTA */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[14px] text-white/30">Or call our AI agent now:</span>
          <a
            href="tel:+14077594100"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-white/80 hover:text-white transition-colors group"
          >
            <svg className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            (407) 759-4100
          </a>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 text-[13px] text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {['No credit card required', 'Setup in 5 minutes', 'Cancel anytime'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500/40" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
