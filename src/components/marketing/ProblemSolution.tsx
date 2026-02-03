import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const problems = [
  { text: '87% of leads go cold within 5 minutes', stat: '87%' },
  { text: "Sales teams can't respond after hours", stat: '40%' },
  { text: "Manual follow-up doesn't scale", stat: '3x' },
];

const solutions = [
  { text: 'Voxaris responds in under 3 seconds', stat: '<3s' },
  { text: 'AI works 24/7, never takes breaks', stat: '24/7' },
  { text: 'Handle 1000+ conversations simultaneously', stat: '1000+' },
];

export function ProblemSolution() {
  return (
    <section className="py-24 bg-cream-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-accent-500 mb-4 block">
            The Challenge
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 mb-4">
            Your leads are
            <span className="italic text-red-500"> going cold</span>
          </h2>
          <p className="text-platinum-600 max-w-2xl mx-auto">
            The average business loses thousands in revenue every month from slow response times.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Problems */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-600">The Problem</span>
            </div>

            {problems.map((problem, index) => (
              <motion.div
                key={problem.text}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-red-100 shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-500">{problem.stat}</span>
                </div>
                <p className="text-navy-700">{problem.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Arrow (desktop only) */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-full bg-navy-900 flex items-center justify-center shadow-lg"
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Solutions */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600">The Voxaris Solution</span>
            </div>

            {solutions.map((solution, index) => (
              <motion.div
                key={solution.text}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-sm"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-500">{solution.stat}</span>
                </div>
                <p className="text-navy-700">{solution.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
