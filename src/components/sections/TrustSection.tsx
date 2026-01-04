import { motion } from "framer-motion";
import { Shield, Server, RefreshCw, Lock } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    title: "Enterprise reliability",
    description: "99.9% uptime SLA with redundant systems and real-time monitoring."
  },
  {
    icon: Server,
    title: "Scalable infrastructure",
    description: "Handle thousands of concurrent calls across multiple locations or clients."
  },
  {
    icon: RefreshCw,
    title: "Consistent performance",
    description: "Same quality on call 1 as on call 10,000. No training gaps, no off days."
  },
  {
    icon: Lock,
    title: "Secure by design",
    description: "SOC 2 compliant infrastructure with encrypted data at rest and in transit."
  }
];

export default function TrustSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-heading font-semibold text-foreground mb-4">
            Infrastructure you can trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Voxaris is built for serious operators who need systems that work — every time, at any scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPoints.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-7 w-7 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
