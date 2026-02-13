import { motion } from 'framer-motion';

const stats = [
  { value: '<3s', label: 'Average response time' },
  { value: '24/7', label: 'Always-on availability' },
  { value: '3-4x', label: 'More appointments booked' },
  { value: '70%', label: 'Appointment show rate' },
];

export function StatsSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
      {/* Divider line */}
      <div className="divider mb-24" />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`text-center ${index > 0 ? 'lg:border-l lg:border-white/[0.04]' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="stat-number mb-3">
                {stat.value}
              </div>
              <div className="text-[13px] text-white/25 tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider line */}
      <div className="divider mt-24" />
    </section>
  );
}
