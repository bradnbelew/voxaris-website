import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const comparisons = [
  {
    without: 'Leads wait 5+ minutes for a response',
    with: 'Every lead engaged in under 3 seconds',
  },
  {
    without: 'No one available after hours',
    with: '24/7 coverage — nights, weekends, holidays',
  },
  {
    without: 'Manual follow-up that can\'t scale',
    with: '1,000+ simultaneous conversations',
  },
  {
    without: 'Opportunities quietly slipping away',
    with: 'Every lead captured, qualified, and booked',
  },
];

export function ProblemSolution() {
  return (
    <section data-section="features" className="section-padding-lg bg-carbon-50">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        {/* Header — softer tone */}
        <motion.div
          className="text-center mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="eyebrow mb-6 block">The Gap</span>
          <h2 className="headline-xl text-carbon-900 mb-6">
            Every missed call is
            <br className="hidden sm:block" />
            <span className="text-carbon-400">a missed opportunity.</span>
          </h2>
          <p className="text-carbon-400 max-w-xl mx-auto text-lg">
            Most businesses respond to leads in hours. The ones winning respond in seconds.
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
                transition={{ duration: 0.5, delay: index * 0.08, ease }}
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
