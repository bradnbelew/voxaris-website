import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Brain,
  Database,
  MessageSquare,
  Layers,
  LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  vTag: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'VInstant',
    description: 'Sub-3-second engagement on every lead. Never let an opportunity slip away.',
    vTag: 'Speed',
  },
  {
    icon: Clock,
    title: 'VAlways',
    description: 'Your AI never sleeps. Capture and qualify leads 24/7, weekends included.',
    vTag: 'Availability',
  },
  {
    icon: Brain,
    title: 'VIntelligent',
    description: 'Context-aware AI that remembers, adapts, and qualifies prospects naturally.',
    vTag: 'AI-Powered',
  },
  {
    icon: Database,
    title: 'VSync',
    description: 'Auto-sync to GoHighLevel and major CRMs. Zero manual data entry.',
    vTag: 'Integration',
  },
  {
    icon: MessageSquare,
    title: 'VOmni',
    description: 'Video, voice, and SMS unified in one platform. Meet leads where they are.',
    vTag: 'Multi-Channel',
  },
  {
    icon: Layers,
    title: 'VLabel',
    description: 'Fully rebrandable for agencies. Your brand, powered by Voxaris.',
    vTag: 'White-Label',
  },
];

export function FeaturesSection() {
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
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-navy-50 border border-navy-100 text-xs font-semibold text-navy-700 uppercase tracking-wider mb-4">
            Platform Capabilities
          </span>
          <h2 className="headline-lg text-navy-900 mb-4">
            Everything you need to convert more leads
          </h2>
          <p className="text-platinum-600 max-w-2xl mx-auto text-lg">
            Enterprise-grade AI automation built for businesses that want to scale without sacrificing quality.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="card-modern p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              {/* V-branded tag */}
              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-platinum-100 text-xs font-medium text-platinum-600 mb-5">
                {feature.vTag}
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-5">
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title - V-branded */}
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-platinum-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
