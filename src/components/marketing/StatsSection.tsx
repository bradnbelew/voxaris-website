import { motion } from 'framer-motion';

const stats = [
  { value: '<3s', label: 'Response time', vLabel: 'VSpeed' },
  { value: '24/7', label: 'Availability', vLabel: 'VReliable' },
  { value: '3-4x', label: 'More bookings', vLabel: 'VResults' },
  { value: '70%', label: 'Show rate', vLabel: 'VEfficient' },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-white border-y border-frost">
      <div className="container-wide">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* V-branded label */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-mist mb-5">
                <span className="text-xs font-bold tracking-wide text-ink">{stat.vLabel}</span>
              </div>

              {/* Large number */}
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink tracking-tight mb-3">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-slate">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
