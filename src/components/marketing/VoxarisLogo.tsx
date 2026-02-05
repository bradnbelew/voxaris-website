import { cn } from '@/lib/utils';

interface VoxarisLogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
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
  const textColor = dark ? 'text-white' : 'text-navy-900';
  const aiColor = dark ? 'text-white/80' : 'text-navy-700';
  const taglineColor = dark ? 'text-white/60' : 'text-platinum-500';

  const sizes = {
    sm: { text: 'text-lg', ai: 'text-base', tagline: 'text-[10px]', gap: 'gap-1.5' },
    md: { text: 'text-xl', ai: 'text-lg', tagline: 'text-xs', gap: 'gap-2' },
    lg: { text: 'text-2xl', ai: 'text-xl', tagline: 'text-sm', gap: 'gap-2.5' },
    xl: { text: 'text-3xl', ai: 'text-2xl', tagline: 'text-base', gap: 'gap-3' },
  };

  const s = sizes[size];

  // Modern tech wordmark with stylized A
  const Wordmark = () => (
    <div className="flex items-baseline">
      <span
        className={cn(
          'font-light tracking-[0.15em] uppercase leading-none',
          s.text,
          textColor
        )}
        style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}
      >
        VOX
      </span>
      {/* Stylized A with flat top */}
      <span
        className={cn(
          'font-light tracking-[0.15em] uppercase leading-none relative',
          s.text,
          textColor
        )}
        style={{
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        }}
      >
        <span className="inline-block" style={{
          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
          transform: 'scaleY(0.95)'
        }}>A</span>
      </span>
      <span
        className={cn(
          'font-light tracking-[0.15em] uppercase leading-none',
          s.text,
          textColor
        )}
        style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}
      >
        RIS
      </span>
      <span
        className={cn(
          'font-extralight tracking-[0.2em] uppercase leading-none ml-2',
          s.ai,
          aiColor
        )}
        style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" }}
      >
        AI
      </span>
    </div>
  );

  if (variant === 'icon') {
    // Simple V icon for favicon/small contexts
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <span
          className={cn('font-light tracking-wider', s.text, textColor)}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          V
        </span>
      </div>
    );
  }

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex flex-col', className)}>
        <Wordmark />
        {showTagline && (
          <span className={cn('tracking-[0.1em] mt-1 font-light', s.tagline, taglineColor)}>
            Personalizing Your Outreach
          </span>
        )}
      </div>
    );
  }

  // Full logo (same as wordmark for this design)
  return (
    <div className={cn('flex flex-col', className)}>
      <Wordmark />
      {showTagline && (
        <span className={cn('tracking-[0.1em] mt-1 font-light', s.tagline, taglineColor)}>
          Personalizing Your Outreach
        </span>
      )}
    </div>
  );
}
