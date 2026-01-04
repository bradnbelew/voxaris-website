import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

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
              Meet Maria
            </span>
            <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-6">
              Your always-available AI sales representative
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Maria is the voice of Voxaris — a professional, calm, and naturally-sounding AI agent trained to handle real sales conversations with real prospects.
            </p>
            <div className="space-y-4">
              {[
                "Answers inbound calls 24/7",
                "Calls new leads within seconds of form submission",
                "Qualifies prospects with custom logic",
                "Books appointments in real time",
                "Confirms appointments via SMS",
                "Follows up until conversion",
                "Pushes all data to your CRM"
              ].map((capability) => (
                <div key={capability} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-foreground">{capability}</span>
                </div>
              ))}
            </div>
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
