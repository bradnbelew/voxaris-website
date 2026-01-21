import { cn } from "@/lib/utils"

interface NeuralGridProps extends React.HTMLAttributes<HTMLDivElement> {
  opacity?: number
}

export function NeuralGrid({ className, opacity = 0.5, ...props }: NeuralGridProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 select-none", className)}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,${opacity * 0.08}) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,${opacity * 0.08}) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
      />
    </div>
  )
}
