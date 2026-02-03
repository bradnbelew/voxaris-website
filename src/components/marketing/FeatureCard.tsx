import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  tag?: string;
  index?: number;
}

export function FeatureCard({ icon: Icon, title, description, tag, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-platinum-200"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Tag */}
      {tag && (
        <div className="inline-block px-3 py-1 rounded-full bg-accent-50 mb-4">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-navy-700">
            {tag}
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center mb-4 group-hover:bg-accent-100 transition-colors">
        <Icon className="w-6 h-6 text-accent-500" />
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-medium text-navy-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-platinum-600 text-sm leading-relaxed mb-4">
        {description}
      </p>

      {/* CTA Link */}
      <div className="flex items-center text-sm font-medium text-navy-700 group-hover:text-accent-500 transition-colors">
        <span>Learn more</span>
        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}
