import { motion } from 'framer-motion';

const stats = [
  { label: 'SPEED', value: '<3s', description: 'Response Time' },
  { label: 'RELIABILITY', value: '24/7', description: 'Available' },
  { label: 'RESULTS', value: '3-4x', description: 'More Bookings' },
  { label: 'EFFICIENCY', value: '70%', description: 'Show Rate' },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-navy-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-accent-300 mb-4 block">
            Performance Metrics
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white">
            Proven results across
            <span className="italic text-accent-300"> industries</span>
          </h2>
        </motion.div>

        {/* Stats grid with connecting lines */}
        <div className="relative">
          {/* Horizontal connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 hidden md:block" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="relative text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Vertical line connector on md+ */}
                <div className="hidden md:block absolute top-1/2 left-1/2 w-px h-8 bg-white/10 -translate-x-1/2 -translate-y-full" />

                {/* Label tag */}
                <div className="inline-block px-3 py-1 rounded bg-accent-50 mb-6">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-navy-800">
                    {stat.label}
                  </span>
                </div>

                {/* Large number - serif font */}
                <div className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-white mb-2">
                  {stat.value}
                </div>

                {/* Description */}
                <div className="text-sm text-white/60">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
