import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

const comparisons = [
  {
    without: 'Leads go cold in 5+ minutes',
    with: 'VInstant responds in under 3 seconds',
  },
  {
    without: 'Sales team unavailable after hours',
    with: 'VAlways works 24/7, never sleeps',
  },
  {
    without: 'Manual follow-up that doesn\'t scale',
    with: 'VScale handles 1000+ conversations',
  },
  {
    without: 'Lost opportunities every day',
    with: 'VCapture catches every single lead',
  },
];

export function ProblemSolution() {
  return (
    <section className="section-padding-lg bg-mist">
      <div className="container-editorial">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow mb-4 block">The Problem</span>
          <h2 className="headline-lg text-ink mb-4">
            You're losing leads while you sleep
          </h2>
          <p className="text-slate max-w-2xl mx-auto text-lg">
            The average business loses thousands in revenue every month from slow response times. Here's how Voxaris changes that.
          </p>
        </motion.div>

        {/* Comparison table */}
        <div className="max-w-3xl mx-auto">
          {/* Header row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <span className="text-sm font-medium text-slate">Without Voxaris</span>
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-ink">With Voxaris</span>
            </div>
          </div>

          {/* Comparison rows */}
          <div className="space-y-4">
            {comparisons.map((item, index) => (
              <motion.div
                key={item.without}
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* Without */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-frost">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <X className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-sm text-charcoal">{item.without}</span>
                </div>

                {/* With */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-ink text-white">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-sm">{item.with}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
