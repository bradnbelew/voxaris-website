import { motion } from "framer-motion";
import { Mail, QrCode, Video, CalendarCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Mail,
    title: "Send",
    description: "Personalized mailer with QR code",
  },
  {
    icon: QrCode,
    title: "Scan",
    description: "Customer scans, instant connection",
  },
  {
    icon: Video,
    title: "Connect",
    description: "Face-to-face with your AI agent",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description: "Appointment confirmed automatically",
  },
];

export default function TalkingPostcardSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">The Breakthrough</span>
          <h2 className="headline-lg text-ink mb-6">
            Direct Mail → Talking Postcard
          </h2>
          <p className="text-lg text-charcoal max-w-2xl mx-auto">
            Turn every postcard into a face-to-face conversation.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connection line (desktop) */}
            <div className="hidden md:block absolute top-[50px] left-[12%] right-[12%] h-[2px] bg-frost" />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative text-center"
              >
                {/* Icon circle */}
                <div className="w-[100px] h-[100px] mx-auto mb-4 rounded-full bg-mist border border-frost flex items-center justify-center relative z-10">
                  <step.icon className="w-10 h-10 text-ink" />
                </div>
                
                {/* Content */}
                <h4 className="text-lg font-medium text-ink mb-2">{step.title}</h4>
                <p className="text-sm text-slate">{step.description}</p>

                {/* Arrow between steps (mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="w-5 h-5 text-slate rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-8"
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-ink font-display">10x</p>
              <p className="text-sm text-slate">vs traditional direct mail</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink font-display">30%</p>
              <p className="text-sm text-slate">conversation-to-booking</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-ink font-display">$0</p>
              <p className="text-sm text-slate">additional labor</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
