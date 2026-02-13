import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  Brain,
  Database,
  Globe,
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
    title: 'Sub-3s Response',
    description: 'Every lead engaged in under 3 seconds. While competitors wait minutes, you\'re already in a conversation.',
  },
  {
    icon: Clock,
    title: '24/7 Coverage',
    description: 'Your AI agents never sleep, never take breaks, never call in sick. Capture every opportunity around the clock.',
  },
  {
    icon: Brain,
    title: 'V·SENSE Intelligence',
    description: 'Emotional AI that reads context, adapts tone in real-time, and handles objections like a seasoned closer.',
  },
  {
    icon: Database,
    title: 'Deep CRM Integration',
    description: 'Native GoHighLevel integration plus every major CRM. Every call logged, every lead tagged, every appointment synced.',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Speak to every lead in their language. Video and voice AI with native-quality translation across dozens of languages.',
  },
  {
    icon: Layers,
    title: 'White-Label Ready',
    description: 'Agencies: deploy under your own brand. Custom domains, custom personas, your logo — Voxaris powers it invisibly.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="section-padding-lg bg-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,1), transparent 70%)' }}
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
          <span className="eyebrow mb-6 block">Why Voxaris</span>
          <h2 className="headline-xl text-carbon-900 mb-6">
            Built for businesses
            <br className="hidden sm:block" />
            <span className="text-carbon-400">that refuse to lose leads.</span>
          </h2>
          <p className="text-carbon-400 max-w-xl mx-auto text-lg">
            Enterprise-grade AI infrastructure that works harder than any human team ever could.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 lg:p-10 rounded-[20px] bg-carbon-50 border border-carbon-200 transition-all duration-500 hover:bg-carbon-100 hover:border-carbon-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-12 h-12 rounded-2xl bg-carbon-100 border border-carbon-200 flex items-center justify-center mb-7 group-hover:bg-carbon-200 transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-carbon-500 group-hover:text-carbon-600 transition-colors" />
              </div>

              <h3 className="text-lg font-bold text-carbon-900 font-display mb-3 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-[14px] text-carbon-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
