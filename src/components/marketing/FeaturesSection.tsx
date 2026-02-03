import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Brain,
  Database,
  Split,
  Layers,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: Zap,
    title: 'Instant Response',
    description: 'Sub-3-second engagement on every lead. Never miss an opportunity.',
    tag: 'Speed',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'AI never sleeps. Capture leads day and night, weekends and holidays.',
    tag: 'Reliability',
  },
  {
    icon: Brain,
    title: 'Intelligent Conversations',
    description: 'Context-aware AI that remembers, adapts, and qualifies naturally.',
    tag: 'AI Powered',
  },
  {
    icon: Database,
    title: 'CRM Integration',
    description: 'Auto-sync to GoHighLevel. No manual data entry, no missed follow-ups.',
    tag: 'Integration',
  },
  {
    icon: Split,
    title: 'Multi-Channel',
    description: 'Video, voice, and SMS in one platform. Meet leads where they are.',
    tag: 'Omnichannel',
  },
  {
    icon: Layers,
    title: 'White-Label Ready',
    description: 'Fully rebrandable for agency partners. Your brand, our technology.',
    tag: 'Scalable',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-cream-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-medium tracking-widest uppercase text-accent-500 mb-4 block">
            Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-navy-900 mb-4">
            Everything you need to
            <span className="italic text-navy-600"> convert more leads</span>
          </h2>
          <p className="text-platinum-600 max-w-2xl mx-auto">
            Enterprise-grade AI automation built for businesses that want to scale without sacrificing quality.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              tag={feature.tag}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
