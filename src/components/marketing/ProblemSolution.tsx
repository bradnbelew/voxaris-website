import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const comparisons = [
  {
    without: 'Leads go cold in 5+ minutes',
    with: 'Every lead engaged in under 3 seconds',
  },
  {
    without: 'Sales team unavailable after hours',
    with: '24/7 coverage — nights, weekends, holidays',
  },
  {
    without: 'Manual follow-up that doesn\'t scale',
    with: '1,000+ simultaneous conversations',
  },
  {
    without: 'Lost opportunities every single day',
    with: 'Every lead captured, qualified, and booked',
  },
];

export function ProblemSolution() {
  return (
    <section className="section-padding-lg bg-black">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">The Problem</span>
          <h2 className="headline-xl text-white mb-6">
            You're losing revenue
            <br className="hidden sm:block" />
            <span className="text-chrome">while you sleep.</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-lg">
            The average business loses thousands every month from slow response times and missed calls.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="max-w-3xl mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center">
              <span className="text-[11px] font-medium text-white/20 uppercase tracking-[0.2em]">Without Voxaris</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-medium text-white/50 uppercase tracking-[0.2em]">With Voxaris</span>
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {comparisons.map((item, index) => (
              <motion.div
                key={item.without}
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Without */}
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <X className="w-3 h-3 text-red-400/60" />
                  </div>
                  <span className="text-[13px] text-white/30">{item.without}</span>
                </div>

                {/* With */}
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400/70" />
                  </div>
                  <span className="text-[13px] text-white/60">{item.with}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
