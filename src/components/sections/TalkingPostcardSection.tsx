import { motion } from "framer-motion";
import { QrCode, Video, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: QrCode,
    title: "Send personalized mailer",
    description: "QR code links to your AI agent, not a form.",
  },
  {
    number: "02",
    icon: Video,
    title: "Customer scans & connects",
    description: "Instant face-to-face video call. No app downloads.",
  },
  {
    number: "03",
    icon: Calendar,
    title: "Appointment booked",
    description: "AI agent qualifies and books—while they're engaged.",
  },
];

export default function TalkingPostcardSection() {
  return (
    <section id="talking-postcard" className="relative section-padding overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="container-editorial relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="eyebrow mb-4 block">The Killer App</span>
            <h2 className="headline-lg text-foreground mb-6">
              Turn direct mail into a{" "}
              <span className="text-primary">FaceTime call.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              When a customer scans a QR code on physical mail, they're immediately 
              in a personalized video conversation with a digital twin who knows 
              their CRM data, vehicle history, and equity status.
            </p>

            {/* Steps */}
            <div className="space-y-6 mb-10">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/technology">
              <Button 
                variant="outline" 
                className="rounded-full px-6 h-12 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                Learn About Our Technology
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Connection visualization */}
            <div className="relative flex items-center justify-center gap-6">
              {/* Postcard */}
              <motion.div
                initial={{ rotate: -5 }}
                whileInView={{ rotate: -5 }}
                className="relative glass-card p-6 w-[200px] h-[280px] flex flex-col items-center justify-between"
              >
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">SERVICE REMINDER</p>
                  <p className="text-sm font-medium text-foreground">Your 2021 Accord is due for its 60k service</p>
                </div>
                
                {/* QR Code placeholder */}
                <div className="w-24 h-24 bg-foreground/10 rounded-lg flex items-center justify-center border border-border">
                  <QrCode className="w-16 h-16 text-foreground/40" />
                </div>
                
                <p className="text-xs text-muted-foreground">Scan to schedule</p>
              </motion.div>

              {/* Animated connection arrow */}
              <div className="relative w-20 flex-shrink-0">
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <div className="w-full h-[2px] bg-gradient-to-r from-primary/50 to-primary" />
                  <ArrowRight className="w-6 h-6 text-primary absolute right-0" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="px-2 py-1 glass rounded text-[10px] font-mono text-primary uppercase tracking-widest -mt-8">
                    QR SCAN
                  </div>
                </motion.div>
              </div>

              {/* Video call interface */}
              <motion.div
                initial={{ rotate: 5 }}
                whileInView={{ rotate: 5 }}
                className="relative glass-card w-[220px] h-[300px] overflow-hidden"
              >
                {/* Video header */}
                <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-background/80 to-transparent z-10">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-xs font-medium text-foreground">LIVE</span>
                  </div>
                  <span className="text-xs text-muted-foreground">00:15</span>
                </div>

                {/* Avatar */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-card via-card to-muted">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-card border-2 border-border/50" />
                </div>

                {/* Speech bubble */}
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-4 left-4 right-4 glass p-3 rounded-lg"
                >
                  <p className="text-xs text-foreground leading-relaxed">
                    "Hi John, I see your 2021 Accord is due for its 60k service. 
                    I have Thursday at 2pm available..."
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
