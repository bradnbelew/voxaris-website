import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Headphones, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MariaSection() {
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
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 block">
              The voice of Voxaris
            </span>
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-6">
              Meet Maria, Voxaris AI Sales Agent
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Maria handles inbound and outbound calls, qualifies prospects with custom logic, books appointments in real time, captures structured data fields, and pushes outcomes directly into your CRM.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              She sounds natural, responds in under 3 seconds, and works 24/7 without breaks, sick days, or inconsistent performance.
            </p>
            
            <Link to="/demo">
              <Button variant="hero" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Try Maria Live
              </Button>
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-accent rounded-full blur-3xl opacity-60" />
              
              {/* Main circle */}
              <div className="relative w-full h-full rounded-full bg-card border border-border flex items-center justify-center shadow-elegant">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                    <Headphones className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Maria</h3>
                  <p className="text-muted-foreground text-sm">AI Sales Agent</p>
                  
                  {/* Sound wave animation */}
                  <div className="flex items-center justify-center gap-1 mt-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-primary rounded-full"
                        animate={{
                          height: [12, 24, 12],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
