
import { cn } from "@/lib/utils"

interface NeuralGridProps extends React.HTMLAttributes<HTMLDivElement> {
  opacity?: number
}

export function NeuralGrid({ className, opacity = 0.5, ...props }: NeuralGridProps) {
  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none -z-10", className)} 
      {...props}
    >
      <div 
        className="absolute inset-0" 
        style={{
          opacity: opacity,
          backgroundImage: `
            linear-gradient(hsl(var(--frost, 240 5% 96%)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--frost, 240 5% 96%)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }} 
      />
    </div>
  )
}
