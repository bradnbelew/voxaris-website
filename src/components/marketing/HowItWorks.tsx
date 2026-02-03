import { motion } from 'framer-motion';
import { Link2, Sliders, CalendarCheck } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'VConnect',
    description: 'Integrate with your CRM in under 5 minutes. Works seamlessly with GoHighLevel and all major platforms.',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'VConfigure',
    description: 'Customize your AI agent\'s personality, knowledge base, and conversation style to match your brand.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'VConvert',
    description: 'Watch leads turn into booked appointments automatically. Your AI works around the clock.',
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding-lg bg-white">
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow mb-4 block">How It Works</span>
          <h2 className="headline-lg text-ink mb-4">
            Get started in minutes, not months
          </h2>
          <p className="text-slate max-w-2xl mx-auto text-lg">
            Our streamlined setup gets you converting leads fast. No complex integrations required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-frost" />
              )}

              {/* Step number badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mist mb-6">
                <span className="text-xs font-bold text-ink">Step {step.number}</span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-ink mb-3">{step.title}</h3>
              <p className="text-slate leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
