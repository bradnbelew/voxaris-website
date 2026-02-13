import { motion } from 'framer-motion';
import { Video, Phone, Check, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function TechnologyShowcase() {
  return (
    <section className="section-padding-lg bg-white">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="eyebrow mb-5 block">Proprietary Technology</span>
          <h2 className="headline-lg text-navy-950 mb-5">
            Two powerful AI agents.<br className="hidden sm:block" />One unified platform.
          </h2>
          <p className="text-platinum-500 max-w-2xl mx-auto text-lg">
            Built from the ground up for enterprise-grade conversations. 100% Voxaris technology.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* VVideo */}
          <motion.div
            className="group relative bg-white border border-neutral-200/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-hero hover:border-neutral-300/60"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[16/10] bg-neutral-50 overflow-hidden">
              <video
                src={TAVUS_VIDEO_URL}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-950 font-display">VVideo</h3>
                  <p className="text-xs text-platinum-400">Photorealistic Video AI</p>
                </div>
              </div>

              <p className="text-platinum-500 mb-7 leading-relaxed">
                Deploy photorealistic AI video agents that have real, face-to-face conversations with your leads on any web page.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Photorealistic video avatars',
                  'Real-time lip sync & expressions',
                  'Custom personas per client',
                  'Embeds on any webpage',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-platinum-600">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/technology" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors group/link">
                Learn more
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* VVoice */}
          <motion.div
            className="group relative bg-white border border-neutral-200/60 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-hero hover:border-neutral-300/60"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="aspect-[16/10] bg-navy-950 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(59,108,245,0.3) 0%, transparent 60%)' }}
              />
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-[3px] mb-5">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[3px] bg-white/80 rounded-full"
                      animate={{
                        height: [12, 28 + Math.random() * 28, 12],
                      }}
                      transition={{
                        duration: 0.8 + Math.random() * 0.6,
                        repeat: Infinity,
                        delay: i * 0.04,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.2em]">VVoice Active</span>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-navy-950 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-950 font-display">VVoice</h3>
                  <p className="text-xs text-platinum-400">Natural Voice AI</p>
                </div>
              </div>

              <p className="text-platinum-500 mb-7 leading-relaxed">
                Natural-sounding voice AI that handles inbound and outbound calls, qualifies leads, and books appointments.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Human-quality voice conversations',
                  'Inbound & outbound calling',
                  'Intelligent interruption handling',
                  'CRM auto-sync on every call',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-sm text-platinum-600">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/technology" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900 transition-colors group/link">
                Learn more
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
