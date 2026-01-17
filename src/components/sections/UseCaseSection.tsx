import { motion } from "framer-motion";
import { Mail, QrCode, Video, Calendar } from "lucide-react";

const steps = [
  {
    icon: Mail,
    label: "Send",
    description: "Personalized mailer with QR code",
  },
  {
    icon: QrCode,
    label: "Scan",
    description: "Customer scans, instant connection",
  },
  {
    icon: Video,
    label: "Connect",
    description: "Face-to-face with your AI agent",
  },
  {
    icon: Calendar,
    label: "Book",
    description: "Appointment confirmed",
  },
];

const stats = [
  { value: "10x", label: "Response Rate" },
  { value: "30%", label: "Booking Rate" },
  { value: "$0", label: "Additional Labor" },
];

export default function UseCaseSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="eyebrow mb-4 block">The Killer Use Case</span>
          <h2 className="headline-lg text-foreground">
            From Inbox to Face-to-Face
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Connection line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-frost" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                {/* Icon circle */}
                <div className="w-24 h-24 rounded-full bg-mist border border-frost flex items-center justify-center mx-auto mb-4 relative z-10">
                  <step.icon className="w-8 h-8 text-foreground" />
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {step.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-mist rounded-xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
