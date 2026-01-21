import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Step = {
  id: string
  label: string
  href: string
  isCompleted: boolean
}

interface LaunchpadProps {
  agentCount?: number
  hasIntegration?: boolean
}

export function Launchpad({ agentCount = 0, hasIntegration = false }: LaunchpadProps) {
  const [isVisible, setIsVisible] = useState(true)
  
  const steps: Step[] = [
    { id: "agent", label: "Hire Your First Agent", href: "/dashboard/hiring-hall", isCompleted: agentCount > 0 },
    { id: "crm", label: "Connect CRM Integration", href: "/dashboard/integrations", isCompleted: hasIntegration },
    { id: "test", label: "Run a Test Simulation", href: "/dashboard/agent-test", isCompleted: false },
    { id: "billing", label: "Configure Billing", href: "/dashboard/settings", isCompleted: false },
  ]

  const completedCount = steps.filter(s => s.isCompleted).length
  const progress = (completedCount / steps.length) * 100

  if (!isVisible) return null
  if (progress === 100) return null

  return (
    <Card className="border-frost bg-background/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Getting Started
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {progress === 100 
                ? "You're all set! 🚀" 
                : "Complete these steps to launch your first campaign."
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {Math.round(progress)}% Complete
          </span>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsVisible(false)} 
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {steps.map((step) => (
            <Link
              key={step.id}
              to={step.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                step.isCompleted 
                  ? "bg-muted/50" 
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                {step.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  step.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              {!step.isCompleted && (
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
