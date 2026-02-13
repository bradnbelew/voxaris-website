import { motion } from 'framer-motion';

const stats = [
  { value: '<3s', label: 'Average response time', accent: 'Speed' },
  { value: '24/7', label: 'Always-on availability', accent: 'Uptime' },
  { value: '3-4x', label: 'More appointments booked', accent: 'Results' },
  { value: '70%', label: 'Appointment show rate', accent: 'Efficiency' },
];

export function StatsSection() {
  return (
    <section className="relative py-20 lg:py-24 bg-navy-950 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(59,108,245,0.15) 0%, transparent 70%)' }}
      />

      <div className="container-wide relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center lg:px-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] mb-5">
                <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-navy-300">{stat.accent}</span>
              </div>

              <div className="text-4xl md:text-5xl font-bold text-white font-display mb-3 tracking-tight">
                {stat.value}
              </div>

              <div className="text-sm text-white/40">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
