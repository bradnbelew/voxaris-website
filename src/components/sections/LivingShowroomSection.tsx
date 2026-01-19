import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import VIcon from "@/components/ui/VIcon";

export default function LivingShowroomSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <VIcon size="md" variant="solid" />
              <span className="eyebrow">V·WEB</span>
            </div>
            <h2 className="headline-lg text-ink mb-6">
              Websites that sell
            </h2>
            <p className="text-lg text-charcoal mb-8 leading-relaxed">
              Your website becomes an active participant in the sales funnel. Integrated with CVI, it guides visitors through complex decisions in real-time.
            </p>

            {/* Bullet points */}
            <ul className="space-y-3 mb-8">
              {[
                "Embedded video agent on any page",
                "Real-time inventory knowledge",
                "Instant appointment booking",
                "24/7 without human staffing"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate">
                  <div className="w-1.5 h-1.5 rounded-full bg-ink" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/solutions/dealerships" className="group inline-flex items-center gap-2 text-charcoal font-medium hover:text-ink transition-colors">
              Learn more
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right - Website Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Browser window mockup */}
            <div className="glass-card overflow-hidden shadow-lg">
              {/* Browser header */}
              <div className="flex items-center gap-2 p-4 border-b border-frost bg-mist">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-slate text-center border border-frost">
                    yourwebsite.com
                  </div>
                </div>
              </div>

              {/* Website content */}
              <div className="relative aspect-[4/3] bg-snow p-6">
                {/* Hero section placeholder */}
                <div className="mb-6">
                  <div className="h-4 w-32 bg-frost rounded mb-4" />
                  <div className="h-8 w-64 bg-frost rounded mb-2" />
                  <div className="h-4 w-48 bg-frost/60 rounded" />
                </div>

                {/* Car grid placeholder */}
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[4/3] bg-frost rounded-lg" />
                  ))}
                </div>

                {/* CVI Widget */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute bottom-6 right-6 w-[160px]"
                >
                  <div className="glass-card overflow-hidden shadow-lg">
                    {/* Video area */}
                    <div className="aspect-[4/3] bg-mist relative flex items-center justify-center">
                      {/* Live badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-white rounded-full shadow-sm">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        <span className="text-[9px] font-medium text-ink">LIVE</span>
                      </div>
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-frost border border-frost" />
                    </div>

                    {/* Chat input */}
                    <div className="p-2 bg-white">
                      <div className="flex items-center gap-2 px-3 py-2 bg-mist rounded-lg">
                        <div className="flex-1 text-[10px] text-slate">Ask about inventory...</div>
                        <ArrowRight className="w-3 h-3 text-ink" />
                      </div>
                    </div>
                  </div>

                  {/* Speech bubble */}
                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8], y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-14 -left-4 glass-card p-2 max-w-[130px] shadow-sm"
                  >
                    <p className="text-[9px] text-ink leading-relaxed">
                      "I can show you our 2024 models. Want to schedule a test drive?"
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
