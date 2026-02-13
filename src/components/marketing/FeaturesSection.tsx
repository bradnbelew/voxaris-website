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
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Instant Engagement',
    description: 'Sub-3-second response on every lead. The speed gap between you and competitors disappears.',
  },
  {
    icon: Clock,
    title: 'Always Available',
    description: 'Your AI workforce never sleeps. Capture and qualify leads 24/7 — weekends, holidays, 3am.',
  },
  {
    icon: Brain,
    title: 'Context-Aware AI',
    description: 'Remembers past conversations, adapts to tone, and qualifies prospects with human-like intuition.',
  },
  {
    icon: Database,
    title: 'CRM Auto-Sync',
    description: 'Connects to GoHighLevel and every major CRM. Zero manual data entry, zero dropped leads.',
  },
  {
    icon: MessageSquare,
    title: 'Omnichannel',
    description: 'Video, voice, and SMS unified in one platform. Meet every lead on their preferred channel.',
  },
  {
    icon: Layers,
    title: 'White-Label Ready',
    description: 'Fully rebrandable for agencies. Your clients see your brand, powered by Voxaris under the hood.',
  },
];

export function FeaturesSection() {
  return (
    <section className="section-padding-lg bg-black relative">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, rgba(192,192,192,1), transparent 70%)' }}
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">Platform Capabilities</span>
          <h2 className="headline-xl text-white mb-6">
            Everything you need to
            <br className="hidden sm:block" />
            <span className="text-chrome">convert more leads.</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-lg">
            Enterprise-grade AI automation built for businesses that demand results.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 lg:p-10 rounded-[20px] bg-white/[0.02] border border-white/[0.04] transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.08]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-7 group-hover:bg-white/[0.06] transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-white/50 group-hover:text-white/70 transition-colors" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white font-display mb-3 tracking-tight">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-white/30 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
