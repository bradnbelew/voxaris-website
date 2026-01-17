import { motion } from "framer-motion";
import { MousePointer, Video, Car, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  { icon: MousePointer, label: "Visitor lands on site" },
  { icon: Video, label: "CVI agent appears" },
  { icon: Car, label: "Guides through inventory" },
  { icon: Calendar, label: "Books test drive" },
];

export default function LivingShowroomSection() {
  return (
    <section id="living-showroom" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-card" />
      
      <div className="container-editorial relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Website Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            {/* Browser window mockup */}
            <div className="glass-card overflow-hidden">
              {/* Browser header */}
              <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-card/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-muted/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center">
                    hillnissan.com
                  </div>
                </div>
              </div>

              {/* Website content */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-muted/20 to-card">
                {/* Hero section placeholder */}
                <div className="p-6">
                  <div className="h-4 w-32 bg-foreground/10 rounded mb-4" />
                  <div className="h-8 w-64 bg-foreground/10 rounded mb-2" />
                  <div className="h-4 w-48 bg-foreground/5 rounded" />
                </div>

                {/* Car grid placeholder */}
                <div className="px-6 grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-foreground/5 rounded-lg" />
                  ))}
                </div>

                {/* CVI Widget - The star of the show */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute bottom-6 right-6 w-[180px]"
                >
                  {/* Video widget */}
                  <div className="glass rounded-2xl overflow-hidden shadow-glow">
                    {/* Video area */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-card to-muted relative">
                      {/* Live badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded-full backdrop-blur-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                        </span>
                        <span className="text-[9px] font-medium text-foreground">LIVE</span>
                      </div>

                      {/* Avatar */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted to-card border border-border/50" />
                      </div>
                    </div>

                    {/* Chat input area */}
                    <div className="p-2 bg-card/80">
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
                        <div className="flex-1 text-[10px] text-muted-foreground">Ask about inventory...</div>
                        <ArrowRight className="w-3 h-3 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Speech bubble */}
                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8], y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-16 -left-4 glass p-2 rounded-lg max-w-[140px]"
                  >
                    <p className="text-[9px] text-foreground leading-relaxed">
                      "I can show you our 2024 Pathfinders in stock. Would you like to schedule a test drive?"
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="eyebrow mb-4 block">Agentic Web Ecosystems</span>
            <h2 className="headline-lg text-foreground mb-6">
              Websites that{" "}
              <span className="text-primary">actually sell.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Not static brochures. Living showrooms with an integrated CVI layer 
              that guides users through complex transactions in real-time.
            </p>

            {/* Steps */}
            <div className="flex flex-wrap gap-4 mb-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-full"
                >
                  <step.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">{step.label}</span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-muted-foreground ml-1" />
                  )}
                </motion.div>
              ))}
            </div>

            <Link to="/solutions/dealerships">
              <Button 
                className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow hover:shadow-glow-lg transition-all"
              >
                See Dealership Solutions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
