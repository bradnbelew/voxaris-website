
import { AgentShowcase } from "@/components/dashboard/agent-showcase"
import { NeuralGrid } from "@/components/ui/neural-grid"

export default function HiringHall() {
  return (
    <div className="relative min-h-screen container mx-auto py-12 px-4">
      <NeuralGrid opacity={0.4} />
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Hiring Hall</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Browse and activate pre-trained AI talent for your workforce.
          Experience the V-Suite Living Interface.
        </p>
      </div>

      <AgentShowcase />
    </div>
  )
}
