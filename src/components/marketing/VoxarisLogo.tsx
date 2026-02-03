import { cn } from '@/lib/utils';

interface VoxarisLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
  dark?: boolean;
}

export function VoxarisLogo({
  variant = 'full',
  size = 'md',
  className,
  showTagline = false,
  dark = false
}: VoxarisLogoProps) {
  const textColor = dark ? 'text-white' : 'text-ink';
  const taglineColor = dark ? 'text-white/60' : 'text-slate';

  const sizes = {
    sm: { icon: 24, text: 'text-lg', tagline: 'text-[10px]', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-xl', tagline: 'text-xs', gap: 'gap-2' },
    lg: { icon: 44, text: 'text-2xl', tagline: 'text-sm', gap: 'gap-3' },
  };

  const s = sizes[size];

  // The iconic V mark
  const VIcon = () => (
    <svg
      viewBox="0 0 48 44"
      fill="currentColor"
      style={{ width: s.icon, height: s.icon * (44/48) }}
      className={textColor}
    >
      <polygon points="24,44 10,0 0,0 18,44" />
      <polygon points="24,44 38,0 48,0 30,44" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center', className)}>
        <VIcon />
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex flex-col', className)}>
        <span className={cn(
          'font-bold tracking-[0.2em] uppercase',
          s.text,
          textColor
        )}>
          VOXARIS
        </span>
        {showTagline && (
          <span className={cn('tracking-wide', s.tagline, taglineColor)}>
            Personalizing Your Outreach
          </span>
        )}
      </div>
    );
  }

  // Full logo with icon + wordmark
  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <VIcon />
      <div className="flex flex-col">
        <span className={cn(
          'font-bold tracking-[0.15em] uppercase leading-none',
          s.text,
          textColor
        )}>
          VOXARIS
        </span>
        {showTagline && (
          <span className={cn('tracking-wide mt-0.5', s.tagline, taglineColor)}>
            Personalizing Your Outreach
          </span>
        )}
      </div>
    </div>
  );
}
