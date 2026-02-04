import { motion } from 'framer-motion';

const stats = [
  { value: '<3s', label: 'Response time', vLabel: 'VSpeed' },
  { value: '24/7', label: 'Availability', vLabel: 'VReliable' },
  { value: '3-4x', label: 'More bookings', vLabel: 'VResults' },
  { value: '70%', label: 'Show rate', vLabel: 'VEfficient' },
];

export function StatsSection() {
  return (
    <section className="section-padding bg-platinum-50 border-y border-platinum-200">
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
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-navy-50 border border-navy-100 mb-5">
                <span className="text-xs font-bold tracking-wide text-navy-700">{stat.vLabel}</span>
              </div>

              {/* Large number */}
              <div className="stat-number mb-3">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm text-platinum-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
