import { motion, useScroll, useTransform } from "framer-motion";
import { Video, Zap, Globe, MessageSquare, Smartphone, Eye, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Video,
    title: "Face-to-Face, Anywhere",
    description: "Synchronous dialogue. No scheduling. No waiting.",
    number: "01"
  },
  {
    icon: Smartphone,
    title: "Outbound Intelligence",
    description: "Messages that respond. Personalized triggers that adapt.",
    number: "02"
  },
  {
    icon: Eye,
    title: "Visual Understanding",
    description: "Show, don't tell. Context at a glance.",
    number: "03"
  },
  {
    icon: MessageSquare,
    title: "Natural Latency",
    description: "Sub-second response. Real dialogue rhythm.",
    number: "04"
  },
  {
    icon: Zap,
    title: "Adaptive Presence",
    description: "Every interaction is contextual. Precision response.",
    number: "05"
  },
  {
    icon: Globe,
    title: "Universal Delivery",
    description: "Web. Mobile. SMS. QR. Everywhere.",
    number: "06"
  }
];

export default function CVISection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section id="cvi-section" ref={containerRef} className="section-padding relative overflow-hidden noise-overlay">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div style={{ y }} className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      </div>

      <div className="container-editorial relative">
        {/* Section header - Editorial style */}
        <div className="grid grid-cols-12 gap-8 mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-5"
          >
            <span className="pill-accent mb-6 inline-flex">
              <Video className="w-4 h-4" />
              Core Technology
            </span>
            
            <h2 className="headline-lg text-foreground">
              The Living
              <br />
              <span className="gradient-text-accent">Interface</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-span-12 lg:col-span-6 lg:col-start-7 flex items-end"
          >
            <p className="text-xl text-muted-foreground leading-relaxed">
              Beyond automation. Beyond chatbots. An intelligent layer that sees, hears, and responds—in real time. Powered by human-level conversational timing.
            </p>
          </motion.div>
        </div>

        {/* Feature grid - Distinctive card layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-3xl bg-secondary/30 border border-border/30 hover:border-cyan/30 transition-all duration-500 overflow-hidden">
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Number watermark */}
                <span className="absolute top-6 right-6 text-6xl font-bold text-border/50 select-none">
                  {feature.number}
                </span>

                <div className="relative">
                  {/* Icon with glow */}
                  <div className="relative w-14 h-14 rounded-2xl bg-cyan/10 flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition-colors duration-300">
                    <feature.icon className="h-6 w-6 text-cyan" />
                    <div className="absolute inset-0 rounded-2xl bg-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-cyan transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover arrow */}
                  <div className="mt-6 flex items-center gap-2 text-sm text-cyan opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Learn more
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section - Bold treatment */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 lg:mt-40"
        >
          <div className="relative rounded-[2rem] overflow-hidden">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan/50 via-cyan/20 to-cyan/50 rounded-[2rem]" />
            <div className="absolute inset-[1px] bg-background rounded-[2rem]" />

            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
              {[
                { value: "<200ms", label: "Response Time" },
                { value: "24/7", label: "Always On" },
                { value: "0", label: "Hallucinations" },
                { value: "∞", label: "Scale" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-background p-8 lg:p-12 text-center group hover:bg-secondary/30 transition-colors duration-300"
                >
                  <p className="text-4xl lg:text-5xl font-bold gradient-text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
