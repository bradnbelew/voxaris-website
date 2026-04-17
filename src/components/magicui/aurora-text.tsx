import { memo, type ReactNode } from 'react';

interface AuroraTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

/**
 * Text with an animated multi-color aurora gradient.
 */
export const AuroraText = memo(
  ({
    children,
    className = '',
    colors = ['#d4a843', '#f1c578', '#ecae4a', '#d4a843'],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle: React.CSSProperties = {
      backgroundImage: `linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]})`,
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      color: 'transparent',
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span className={`relative inline-block ${className}`}>
        <span className="sr-only">{children}</span>
        <span className="animate-aurora" style={gradientStyle} aria-hidden="true">
          {children}
        </span>
      </span>
    );
  },
);

AuroraText.displayName = 'AuroraText';
