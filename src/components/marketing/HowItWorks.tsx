import { motion } from 'framer-motion';
import { Link2, Sliders, CalendarCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Connect',
    description: 'Integrate with your CRM in under 5 minutes. Works with GoHighLevel and major platforms.',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'Configure',
    description: "Customize your AI agent's personality, knowledge base, and conversation style.",
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Convert',
    description: 'Watch leads turn into booked appointments automatically, 24/7.',
    gradient: 'from-cyan-500 to-cyan-600',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-navy-800 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-platinum-400 max-w-2xl mx-auto">
            Get started in minutes, not months. Our streamlined setup gets you converting leads fast.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Step number */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className={`text-lg font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-platinum-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
