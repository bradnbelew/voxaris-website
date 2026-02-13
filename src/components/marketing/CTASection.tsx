import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative py-28 lg:py-36 bg-navy-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(59,108,245,0.3) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      </div>

      <div className="container-editorial text-center relative z-10">
        {/* Logo mark */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/[0.07] border border-white/[0.1] flex items-center justify-center backdrop-blur-sm">
            <span className="text-3xl font-bold text-white font-display">V</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="headline-lg text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Ready to stop losing<br />
          leads to slow follow-up?
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="text-lg text-white/40 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Join forward-thinking businesses using Voxaris AI to capture every opportunity. Get started in minutes, not months.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/book-demo">
            <Button
              size="lg"
              className="bg-white hover:bg-neutral-100 text-navy-950 h-14 px-8 text-[15px] font-medium rounded-xl group shadow-elevated transition-all duration-300 hover:-translate-y-0.5"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/demo">
            <Button
              size="lg"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/[0.06] h-14 px-8 text-[15px] font-medium rounded-xl border border-white/10"
            >
              Talk to Sales
            </Button>
          </Link>
        </motion.div>

        {/* Trust */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {['No credit card required', '14-day free trial', 'Cancel anytime'].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500/60" fill="currentColor" viewBox="0 0 20 20">
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
