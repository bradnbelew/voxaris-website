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
    gradient: 'purple' as const,
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'AI never sleeps. Capture leads day and night, weekends and holidays.',
    gradient: 'pink' as const,
  },
  {
    icon: Brain,
    title: 'Intelligent Conversations',
    description: 'Context-aware AI that remembers, adapts, and qualifies naturally.',
    gradient: 'cyan' as const,
  },
  {
    icon: Database,
    title: 'CRM Integration',
    description: 'Auto-sync to GoHighLevel. No manual data entry, no missed follow-ups.',
    gradient: 'purple' as const,
  },
  {
    icon: Split,
    title: 'Multi-Channel',
    description: 'Video, voice, and SMS in one platform. Meet leads where they are.',
    gradient: 'pink' as const,
  },
  {
    icon: Layers,
    title: 'White-Label Ready',
    description: 'Fully rebrandable for agency partners. Your brand, our technology.',
    gradient: 'cyan' as const,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-navy-900 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Convert More Leads
            </span>
          </h2>
          <p className="text-platinum-400 max-w-2xl mx-auto">
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
              gradient={feature.gradient}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
