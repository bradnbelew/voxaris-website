import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative py-32 lg:py-44 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.015) 0%, transparent 55%)' }}
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
          <img src="/voxaris-logo-white.png" alt="Voxaris" className="h-8 w-auto mb-4 opacity-50" />
          <span className="text-[10px] font-medium text-white/15 uppercase tracking-[0.25em]">The Human Interface</span>
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
          <span className="text-chrome">already losing leads to AI.</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="text-lg text-white/20 mb-14 max-w-lg mx-auto"
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
              className="bg-white hover:bg-white/90 text-black h-14 px-10 text-[15px] font-semibold rounded-full group shadow-glow hover:shadow-glow-lg transition-all duration-500 hover:-translate-y-0.5"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/35 hover:text-white hover:bg-white/[0.04] h-14 px-8 text-[15px] font-medium rounded-full border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              Talk to Sales
            </Button>
          </Link>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 text-[13px] text-white/15"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          {['No credit card required', 'Setup in 5 minutes', 'Cancel anytime'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500/30" fill="currentColor" viewBox="0 0 20 20">
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
