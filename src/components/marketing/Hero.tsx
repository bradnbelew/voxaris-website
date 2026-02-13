import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-black">
      {/* Background — cinematic radial glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)',
          }}
        />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        {/* Subtle top-down gradient to push content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-hero w-full pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10"
            >
              <span className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/80" />
                </span>
                <span className="text-[12px] font-medium text-white/50 tracking-wide">AI-Powered Sales Infrastructure</span>
              </span>
            </motion.div>

            {/* Headline — massive, Apple-style */}
            <motion.h1
              className="headline-hero text-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Your AI workforce
              <br />
              <span className="text-chrome">that never</span>
              <br />
              <span className="text-chrome">clocks out.</span>
            </motion.h1>

            {/* Sub — clean, understated */}
            <motion.p
              className="text-lg sm:text-xl text-white/35 leading-relaxed mb-12 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Deploy photorealistic video and voice AI agents that engage every lead,
              qualify every prospect, and book every appointment — around the clock.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/book-demo">
                <Button
                  size="lg"
                  className="bg-white hover:bg-white/90 text-black h-14 px-10 text-[15px] font-semibold rounded-full group shadow-glow hover:shadow-glow-lg transition-all duration-500 hover:-translate-y-0.5"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-white/40 hover:text-white hover:bg-white/[0.04] rounded-full group border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Metrics bar */}
            <motion.div
              className="mt-16 pt-10 border-t border-white/[0.04] flex items-center gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {[
                { value: '500+', label: 'Active agents' },
                { value: '2M+', label: 'Conversations' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-12">
                  <div>
                    <div className="text-2xl font-bold text-white font-display tracking-tight">{stat.value}</div>
                    <div className="text-[11px] text-white/25 mt-1 tracking-wide">{stat.label}</div>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-white/[0.06]" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Video showcase */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-md lg:max-w-[420px]">
              {/* Glow behind video */}
              <div className="absolute -inset-8 opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(192,192,192,0.15) 0%, transparent 70%)' }}
              />

              {/* Video container */}
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-carbon-900 border border-white/[0.06] shadow-elevated">
                <video
                  src={TAVUS_VIDEO_URL}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Agent info overlay */}
                <div className="absolute bottom-0 inset-x-0 p-7">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span className="text-[10px] font-semibold text-white/60 uppercase tracking-[0.15em]">Live</span>
                      </div>
                      <div className="text-lg font-semibold text-white font-display">VAgent Maria</div>
                      <div className="text-[13px] text-white/40">Sales Assistant</div>
                    </div>
                    <div className="text-right bg-white/[0.06] backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/[0.06]">
                      <div className="text-2xl font-bold text-white font-display">&lt;3s</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">Response</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating metric — top left */}
              <motion.div
                className="absolute -top-4 -left-4 lg:-left-8 bg-carbon-900/90 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/[0.06]"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-2xl font-bold text-white font-display">24/7</div>
                <div className="text-[11px] text-white/30">Always on</div>
              </motion.div>

              {/* Floating metric — bottom right */}
              <motion.div
                className="absolute -bottom-4 -right-4 lg:-right-8 bg-carbon-900/90 backdrop-blur-xl rounded-2xl px-5 py-4 border border-white/[0.06]"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="text-2xl font-bold text-white font-display">3-4x</div>
                <div className="text-[11px] text-white/30">More bookings</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}
