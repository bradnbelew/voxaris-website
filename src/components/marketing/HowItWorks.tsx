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
    <section className="section-padding-lg bg-neutral-50/50">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow mb-5 block">How It Works</span>
          <h2 className="headline-lg text-navy-950 mb-5">
            Live in minutes,<br className="hidden sm:block" />not months
          </h2>
          <p className="text-platinum-500 max-w-2xl mx-auto text-lg">
            Three steps to an AI workforce that never stops selling.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-neutral-300 to-neutral-200" />
              )}

              <div className="bg-white border border-neutral-200/60 rounded-2xl p-8 lg:p-10 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[64px] font-bold text-navy-100 font-display leading-none">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-navy-950 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                  <step.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-navy-950 font-display mb-3">{step.title}</h3>
                <p className="text-sm text-platinum-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
