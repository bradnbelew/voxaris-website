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
    <section className="section-padding-lg bg-white">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow mb-5 block">The Problem</span>
          <h2 className="headline-lg text-navy-950 mb-5">
            You're losing revenue<br className="hidden sm:block" />while you sleep
          </h2>
          <p className="text-platinum-500 max-w-2xl mx-auto text-lg">
            The average business loses thousands every month from slow response times and missed calls.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="max-w-3xl mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center">
              <span className="text-[13px] font-medium text-platinum-400">Without Voxaris</span>
            </div>
            <div className="text-center">
              <span className="text-[13px] font-semibold text-navy-900">With Voxaris</span>
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
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                {/* Without */}
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-neutral-50 border border-neutral-200/40">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <span className="text-sm text-platinum-600">{item.without}</span>
                </div>

                {/* With */}
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-navy-950 border border-navy-800/50">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-white/90">{item.with}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
