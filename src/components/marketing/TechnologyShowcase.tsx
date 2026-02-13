import { motion } from 'framer-motion';
import { Video, Phone, Check, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function TechnologyShowcase() {
  return (
    <section className="section-padding-lg bg-black">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          className="text-center mb-20 lg:mb-28"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow mb-6 block">Proprietary Technology</span>
          <h2 className="headline-xl text-white mb-6">
            Two powerful AI agents.
            <br className="hidden sm:block" />
            <span className="text-chrome">One unified platform.</span>
          </h2>
          <p className="text-white/30 max-w-xl mx-auto text-lg">
            Built from the ground up for enterprise-grade conversations. 100% Voxaris technology.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* VVideo */}
          <motion.div
            className="group relative bg-carbon-950 border border-white/[0.04] rounded-[24px] overflow-hidden transition-all duration-500 hover:border-white/[0.08]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <video
                src={TAVUS_VIDEO_URL}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent" />
            </div>

            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
                  <Video className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">VVideo</h3>
                  <p className="text-[11px] text-white/30 tracking-wide">Photorealistic Video AI</p>
                </div>
              </div>

              <p className="text-white/35 mb-8 leading-relaxed text-[15px]">
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
                    <div className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
                      <Check className="w-3 h-3 text-white/50" />
                    </div>
                    <span className="text-[13px] text-white/45">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/technology" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/40 hover:text-white transition-colors group/link">
                Learn more
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* VVoice */}
          <motion.div
            className="group relative bg-carbon-950 border border-white/[0.04] rounded-[24px] overflow-hidden transition-all duration-500 hover:border-white/[0.08]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="aspect-[16/10] flex items-center justify-center relative overflow-hidden bg-carbon-950">
              <div className="absolute inset-0 opacity-30"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(192,192,192,0.08) 0%, transparent 60%)' }}
              />
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-[3px] mb-5">
                  {[...Array(24)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-[2px] bg-white/40 rounded-full"
                      animate={{
                        height: [10, 24 + Math.random() * 24, 10],
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
                <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.25em]">VVoice Active</span>
              </div>
            </div>

            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center border border-white/[0.06]">
                  <Phone className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-display">VVoice</h3>
                  <p className="text-[11px] text-white/30 tracking-wide">Natural Voice AI</p>
                </div>
              </div>

              <p className="text-white/35 mb-8 leading-relaxed text-[15px]">
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
                    <div className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0 border border-white/[0.06]">
                      <Check className="w-3 h-3 text-white/50" />
                    </div>
                    <span className="text-[13px] text-white/45">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/technology" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/40 hover:text-white transition-colors group/link">
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
