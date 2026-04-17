import * as React from 'react';
import { cn } from '@/lib/utils';

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
}

/**
 * Animated shine traveling around the border.
 * Parent must have `position: relative` and a matching `borderRadius`.
 */
export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = '#d4a843',
  className,
  style,
  ...props
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          '--border-width': `${borderWidth}px`,
          '--duration': `${duration}s`,
          backgroundImage: `radial-gradient(transparent, transparent, ${
            Array.isArray(shineColor) ? shineColor.join(',') : shineColor
          }, transparent, transparent)`,
          backgroundSize: '300% 300%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: 'var(--border-width)',
          animationDuration: `${duration}s`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'motion-safe:animate-shine pointer-events-none absolute inset-0 size-full rounded-[inherit]',
        className,
      )}
      {...props}
    />
  );
}
