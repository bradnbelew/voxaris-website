import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: 'purple' | 'pink' | 'cyan';
  index?: number;
}

export function FeatureCard({ icon: Icon, title, description, gradient = 'purple', index = 0 }: FeatureCardProps) {
  const gradientClasses = {
    purple: 'from-purple-500/20 to-purple-500/0 group-hover:from-purple-500/30',
    pink: 'from-pink-500/20 to-pink-500/0 group-hover:from-pink-500/30',
    cyan: 'from-cyan-500/20 to-cyan-500/0 group-hover:from-cyan-500/30',
  };

  const iconGradient = {
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    cyan: 'from-cyan-400 to-cyan-600',
  };

  const glowColor = {
    purple: 'group-hover:shadow-purple-500/20',
    pink: 'group-hover:shadow-pink-500/20',
    cyan: 'group-hover:shadow-cyan-500/20',
  };

  return (
    <motion.div
      className={cn(
        'group relative p-6 rounded-2xl bg-navy-800/50 border border-white/5 backdrop-blur-sm',
        'hover:border-white/10 transition-all duration-300',
        'hover:shadow-xl',
        glowColor[gradient]
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Gradient background on hover */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          gradientClasses[gradient]
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
            'bg-gradient-to-br',
            iconGradient[gradient]
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

        {/* Description */}
        <p className="text-sm text-platinum-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
