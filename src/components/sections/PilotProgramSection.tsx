import { motion } from "framer-motion";
import { Rocket, Gift, Users, MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pilotBenefits = [
  {
    icon: Gift,
    title: "Free 30-Day Trial",
    description: "Test Voxaris on one campaign or lead source. No credit card required."
  },
  {
    icon: Users,
    title: "Founder Access",
    description: "Work directly with our product team. Your feedback shapes our roadmap."
  },
  {
    icon: MessageSquare,
    title: "Custom Setup",
    description: "We build your scripts, integrations, and workflows — not you."
  }
];

const metrics = [
  { value: "22", unit: "sec", label: "Response Time" },
  { value: "94%", unit: "", label: "Contact Rate" },
  { value: "47%", unit: "", label: "Appointment Rate" },
];

export default function PilotProgramSection() {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <Rocket className="w-4 h-4" />
              Limited Availability
            </span>
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
              Join Our Pilot Program & Shape the Future
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We're rolling out to select businesses who want first access. Early adopters get lifetime pricing advantages and direct influence on our product.
            </p>

            <div className="space-y-4 mb-8">
              {pilotBenefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/book-demo">
              <Button variant="hero" size="lg">
                Apply for Pilot Program
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Metrics card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl border border-border p-8 lg:p-10">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Current Performance Metrics
                </h3>
                <p className="text-sm text-muted-foreground">
                  Live demo available immediately
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {metrics.map((metric) => (
                  <div key={metric.label} className="text-center p-4 rounded-xl bg-secondary/40">
                    <div className="flex items-baseline justify-center gap-0.5 mb-1">
                      <span className="text-3xl lg:text-4xl font-bold text-foreground">
                        {metric.value}
                      </span>
                      <span className="text-lg font-medium text-primary">{metric.unit}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{metric.label}</span>
                  </div>
                ))}
              </div>

              {/* Proof elements */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">Full call recordings available</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">Live demo with your scenario</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">Transparent reporting dashboard</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
