import { motion } from 'framer-motion';
import { Link2, Sliders, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Connect',
    description: 'Link your CRM — GoHighLevel, HubSpot, Salesforce, or any platform. We pull your leads, your scripts, your brand voice. Five minutes.',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'Configure',
    description: 'Build your AI agent\'s persona, train it on your pitch, set your qualification criteria. Our V·FLOW engine handles the conversation logic.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Launch',
    description: 'Flip the switch. Your AI agents start engaging every lead with video, voice, or Talking Postcards — booking appointments while you sleep.',
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
          <span className="eyebrow mb-6 block">Getting Started</span>
          <h2 className="headline-xl text-white mb-6">
            Live in minutes.
            <br className="hidden sm:block" />
            <span className="text-chrome">Not months.</span>
          </h2>
          <p className="text-white/25 max-w-xl mx-auto text-lg">
            From zero to a fully operational AI sales team in three steps.
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
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[calc(50%+60px)] w-[calc(100%-120px)] h-px">
                  <div className="w-full h-full bg-gradient-to-r from-white/[0.06] to-white/[0.02]" />
                </div>
              )}

              <div className="h-full p-8 lg:p-10 rounded-[20px] bg-white/[0.02] border border-white/[0.04] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.08]">
                {/* Step number */}
                <div className="mb-8">
                  <span className="text-chrome text-[52px] font-bold font-display leading-none opacity-30">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-7 group-hover:bg-white/[0.06] transition-colors duration-300">
                  <step.icon className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white font-display mb-3 tracking-tight">{step.title}</h3>
                <p className="text-[14px] text-white/25 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
