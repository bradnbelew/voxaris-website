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
    <section data-section="features" className="section-padding-lg bg-carbon-50">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          className="text-center mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">The Problem</span>
          <h2 className="headline-xl text-carbon-900 mb-6">
            You're losing revenue
            <br className="hidden sm:block" />
            <span className="text-carbon-400">while you sleep.</span>
          </h2>
          <p className="text-carbon-400 max-w-xl mx-auto text-lg">
            The average business loses thousands every month from slow response times and missed calls.
          </p>
        </motion.div>

        {/* Comparison */}
        <div className="max-w-3xl mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="text-center">
              <span className="text-[11px] font-medium text-carbon-300 uppercase tracking-[0.2em]">Without Voxaris</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-medium text-carbon-500 uppercase tracking-[0.2em]">With Voxaris</span>
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
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-carbon-200">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center">
                    <X className="w-3 h-3 text-red-400" />
                  </div>
                  <span className="text-[13px] text-carbon-400">{item.without}</span>
                </div>

                {/* With */}
                <div className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-carbon-300">
                  <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="text-[13px] text-carbon-700">{item.with}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
