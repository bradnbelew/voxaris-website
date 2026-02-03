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
    <section className="py-24 bg-navy-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Leads Are
            <span className="text-red-400"> Going Cold</span>
          </h2>
          <p className="text-platinum-400 max-w-2xl mx-auto">
            The average business loses thousands in revenue every month from slow response times.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Problems */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">The Problem</span>
            </div>

            {problems.map((problem, index) => (
              <motion.div
                key={problem.text}
                className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-red-400">{problem.stat}</span>
                </div>
                <p className="text-platinum-300">{problem.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Arrow (desktop only) */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
            >
              <ArrowRight className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Solutions */}
          <motion.div
            className="space-y-4 lg:col-start-2 lg:row-start-1"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">The Voxaris Solution</span>
            </div>

            {solutions.map((solution, index) => (
              <motion.div
                key={solution.text}
                className="flex items-center gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">{solution.stat}</span>
                </div>
                <p className="text-platinum-300">{solution.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
