import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

interface MeteorStyle {
  top: string;
  left: string;
  animationDelay: string;
  animationDuration: string;
}

/**
 * Animated falling meteors background.
 * Parent must have `position: relative` and `overflow: hidden`.
 */
export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteors, setMeteors] = useState<MeteorStyle[]>([]);

  useEffect(() => {
    const arr: MeteorStyle[] = Array.from({ length: number }, (_, i) => {
      const position = i * (800 / number) - 400;
      return {
        top: '-5%',
        left: `${position}px`,
        animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
        animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
      };
    });
    setMeteors(arr);
  }, [number, minDelay, maxDelay, minDuration, maxDuration]);

  return (
    <>
      {meteors.map((style, idx) => (
        <span
          key={idx}
          style={{ ...style, ['--angle' as string]: `-${angle}deg` }}
          className={cn(
            'pointer-events-none absolute size-0.5 rotate-[var(--angle)] animate-meteor rounded-full bg-white shadow-[0_0_0_1px_#ffffff10]',
            className,
          )}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-white to-transparent" />
        </span>
      ))}
    </>
  );
};
