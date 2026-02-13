import { motion } from 'framer-motion';
import { Link2, Sliders, CalendarCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Connect',
    description: 'Integrate with your CRM in under 5 minutes. Works seamlessly with GoHighLevel and all major platforms.',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'Configure',
    description: 'Customize your AI agent\'s personality, knowledge base, and conversation flow to match your brand perfectly.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Convert',
    description: 'Watch leads transform into booked appointments automatically. Your AI works around the clock so you don\'t have to.',
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding-lg bg-black relative">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          className="text-center mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">How It Works</span>
          <h2 className="headline-xl text-white mb-6">
            Live in minutes,
            <br className="hidden sm:block" />
            <span className="text-chrome">not months.</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-lg">
            Three steps to an AI workforce that never stops selling.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-white/[0.06] to-white/[0.02]" />
              )}

              <div className="p-8 lg:p-10 rounded-[20px] bg-white/[0.02] border border-white/[0.04] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.08]">
                {/* Step number */}
                <div className="mb-8">
                  <span className="text-[56px] font-bold text-white/[0.04] font-display leading-none">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-7 group-hover:bg-white/[0.06] transition-colors duration-300">
                  <step.icon className="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white font-display mb-3 tracking-tight">{step.title}</h3>
                <p className="text-[14px] text-white/30 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
