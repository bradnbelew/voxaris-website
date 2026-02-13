import { motion } from 'framer-motion';

const vSuite = [
  {
    name: 'V·FACE',
    label: 'Photorealistic Rendering',
    description: 'Industry-leading video synthesis that generates photorealistic facial movements, expressions, and lip sync in real-time.',
  },
  {
    name: 'V·SENSE',
    label: 'Emotional Intelligence',
    description: 'Detects prospect sentiment, engagement level, and conversation context to dynamically adapt tone, pacing, and messaging.',
  },
  {
    name: 'V·FLOW',
    label: 'Conversation Orchestration',
    description: 'Manages the entire conversation lifecycle — from greeting to objection handling to appointment booking — with zero human intervention.',
  },
];

export function VSuiteSection() {
  return (
    <section className="relative py-28 lg:py-36 bg-black overflow-hidden">
      {/* Background ambient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse, rgba(192,192,192,0.02) 0%, transparent 60%)' }}
        />
      </div>

      <div className="container-editorial relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">Under The Hood</span>
          <h2 className="headline-xl text-white mb-6">
            The V·Suite
          </h2>
          <p className="text-white/25 max-w-lg mx-auto text-lg">
            Three proprietary AI systems working in concert to deliver
            conversations that feel genuinely human.
          </p>
        </motion.div>

        {/* V-Suite cards — horizontal */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04] rounded-[24px] overflow-hidden">
          {vSuite.map((item, index) => (
            <motion.div
              key={item.name}
              className="group bg-carbon-950 p-8 lg:p-10 transition-all duration-500 hover:bg-white/[0.02]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Name — chrome styled */}
              <div className="mb-8">
                <span className="text-chrome text-3xl lg:text-4xl font-bold font-display tracking-tight">
                  {item.name}
                </span>
              </div>

              {/* Label */}
              <div className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em] mb-4">
                {item.label}
              </div>

              {/* Divider */}
              <div className="w-8 h-px bg-white/[0.08] mb-5" />

              {/* Description */}
              <p className="text-[14px] text-white/25 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-[13px] text-white/15">
            100% proprietary technology. Built from the ground up by Voxaris.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
