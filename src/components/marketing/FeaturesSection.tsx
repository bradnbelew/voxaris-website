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
  tag: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Instant Engagement',
    description: 'Sub-3-second response on every lead. The speed gap between you and competitors disappears.',
    tag: 'Speed',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Your AI workforce never sleeps. Capture and qualify leads 24/7 — weekends, holidays, 3am.',
    tag: 'Availability',
  },
  {
    icon: Brain,
    title: 'Context-Aware AI',
    description: 'Remembers past conversations, adapts to tone, and qualifies prospects with human-like intuition.',
    tag: 'Intelligence',
  },
  {
    icon: Database,
    title: 'CRM Auto-Sync',
    description: 'Connects to GoHighLevel and every major CRM. Zero manual data entry, zero dropped leads.',
    tag: 'Integration',
  },
  {
    icon: MessageSquare,
    title: 'Omnichannel',
    description: 'Video, voice, and SMS unified in one platform. Meet every lead on their preferred channel.',
    tag: 'Channels',
  },
  {
    icon: Layers,
    title: 'White-Label Ready',
    description: 'Fully rebrandable for agencies. Your clients see your brand, powered by Voxaris under the hood.',
    tag: 'Agencies',
  },
];

export function FeaturesSection() {
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
          <span className="eyebrow mb-5 block">Platform Capabilities</span>
          <h2 className="headline-lg text-navy-950 mb-5">
            Everything you need to<br className="hidden sm:block" />convert more leads
          </h2>
          <p className="text-platinum-500 max-w-2xl mx-auto text-lg">
            Enterprise-grade AI automation built for businesses that demand results, not excuses.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative bg-white border border-neutral-200/60 rounded-2xl p-8 transition-all duration-300 hover:shadow-card-hover hover:border-neutral-300/60 hover:-translate-y-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
            >
              {/* Tag */}
              <div className="inline-block px-2.5 py-1 rounded-md bg-navy-50 mb-6">
                <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-navy-600">{feature.tag}</span>
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-navy-950 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-navy-950 font-display mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-platinum-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
