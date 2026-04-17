import { motion, type Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

/**
 * Animated gradient beam that travels around the border of the parent.
 * Parent must have `position: relative` and a `borderRadius`.
 */
export const BorderBeam = ({
  className,
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = '#d4a843',
  colorTo = 'rgba(212,168,67,0)',
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        border: `${borderWidth}px solid transparent`,
        WebkitMask:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'xor',
        mask: 'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'exclude',
      }}
    >
      <motion.div
        className={cn('absolute aspect-square', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          ...style,
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
};
