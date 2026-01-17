import { motion } from "framer-motion";
import { Mail, QrCode, Video, CalendarCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: Mail,
    title: "Send",
    description: "Personalized mailer with QR code",
  },
  {
    number: "02",
    icon: QrCode,
    title: "Scan",
    description: "Customer scans, instant connection",
  },
  {
    number: "03",
    icon: Video,
    title: "Connect",
    description: "Face-to-face with Maria",
  },
  {
    number: "04",
    icon: CalendarCheck,
    title: "Book",
    description: "Appointment confirmed",
  },
];

export default function TalkingPostcardSection() {
  return (
    <section id="talking-postcard" className="relative section-padding overflow-hidden">
      {/* Ambient effects */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="container-editorial relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">The Killer App</span>
          <h2 className="headline-lg text-foreground mb-6">
            Direct Mail, Meet{" "}
            <span className="text-primary">Digital Twin.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            When a customer scans a QR code on physical mail, they're immediately in a personalized video conversation with an AI that knows their name, vehicle, and service history.
          </p>
        </motion.div>

        {/* Horizontal Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />
            
            {/* Animated progress line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="hidden md:block absolute top-1/2 left-[12.5%] right-[12.5%] h-[2px] bg-gradient-to-r from-primary via-primary to-primary/50 -translate-y-1/2 origin-left"
            />

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="relative"
                >
                  <div className="glass-card p-6 text-center card-hover">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    
                    {/* Number badge */}
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border border-primary/30 flex items-center justify-center text-xs font-mono text-primary font-bold">
                      {step.number}
                    </span>

                    {/* Content */}
                    <h4 className="text-lg font-bold text-foreground mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Arrow between steps (mobile) */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-4">
                      <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Visual Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16"
        >
          {/* Postcard */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ rotate: -3 }}
              whileInView={{ rotate: -3 }}
              className="glass-card p-6 w-full max-w-[320px] transform"
            >
              <div className="text-center mb-6">
                <p className="text-xs text-primary uppercase tracking-widest mb-2">Service Reminder</p>
                <h4 className="text-lg font-bold text-foreground mb-2">Your 2021 Accord</h4>
                <p className="text-sm text-muted-foreground">is due for its 60k service</p>
              </div>
              
              {/* QR Code placeholder */}
              <div className="w-32 h-32 mx-auto bg-foreground/10 rounded-xl flex items-center justify-center border border-border mb-4">
                <QrCode className="w-20 h-20 text-foreground/40" />
              </div>
              
              <p className="text-center text-xs text-muted-foreground">Scan to meet Maria, your Service Advisor</p>
            </motion.div>

            {/* Scan animation */}
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 right-0 lg:right-auto lg:left-full transform -translate-y-1/2 lg:-translate-x-1/2"
            >
              <div className="glass px-4 py-2 rounded-full text-xs font-mono text-primary">
                SCANNING...
              </div>
            </motion.div>
          </div>

          {/* Video call interface */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ rotate: 3 }}
              whileInView={{ rotate: 3 }}
              className="glass-card w-full max-w-[320px] overflow-hidden transform"
            >
              {/* Video header */}
              <div className="p-3 flex items-center justify-between bg-card/50 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-xs font-medium text-foreground">LIVE</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">00:15</span>
              </div>

              {/* Avatar */}
              <div className="aspect-[4/3] relative bg-gradient-to-br from-card via-card to-muted flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted to-card border-2 border-border/50" />
              </div>

              {/* Speech bubble */}
              <div className="p-4">
                <motion.div
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="glass p-3 rounded-lg"
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    "Hi John, I see your 2021 Accord is due for its 60k service. I have Thursday at 2pm available..."
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary font-display">10x</p>
              <p className="text-sm text-muted-foreground">Response Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary font-display">30%</p>
              <p className="text-sm text-muted-foreground">Booking Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary font-display">$0</p>
              <p className="text-sm text-muted-foreground">Additional Labor</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link to="/technology">
            <Button 
              variant="outline" 
              className="rounded-full px-8 h-12 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              Learn About Our Technology
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
