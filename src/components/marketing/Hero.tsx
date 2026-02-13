import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#fafbff]">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute top-0 right-0 w-[70%] h-[80%] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 70% 20%, rgba(59,108,245,0.12) 0%, transparent 60%)',
          }}
        />
        <div className="absolute bottom-0 left-0 w-[50%] h-[60%] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 30% 80%, rgba(30,58,138,0.1) 0%, transparent 60%)',
          }}
        />
        {/* Grid */}
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-hero w-full pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy-950/[0.04] border border-navy-200/40">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-navy-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-navy-600" />
                </span>
                <span className="text-[13px] font-medium text-navy-800 tracking-wide">AI-Powered Sales Infrastructure</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="headline-xl text-navy-950 mb-7"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Your AI workforce{' '}
              <span className="gradient-text-navy">that never</span>
              <br />
              <span className="gradient-text-navy">clocks out</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              className="text-lg sm:text-xl text-platinum-500 leading-relaxed mb-10 max-w-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Deploy photorealistic video and voice AI agents that engage every lead,
              qualify every prospect, and book every appointment — around the clock.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/book-demo">
                <Button
                  size="lg"
                  className="bg-navy-900 hover:bg-navy-800 text-white h-14 px-8 text-[15px] font-medium rounded-xl group shadow-glow-navy hover:shadow-glow-navy-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-6 text-[15px] text-platinum-600 hover:text-navy-900 hover:bg-navy-50/50 rounded-xl group"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="mt-14 flex items-center gap-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { value: '500+', label: 'Active agents' },
                { value: '2M+', label: 'Conversations' },
                { value: '98%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-10">
                  <div>
                    <div className="text-2xl font-bold text-navy-900 font-display">{stat.value}</div>
                    <div className="text-xs text-platinum-400 mt-0.5">{stat.label}</div>
                  </div>
                  {i < 2 && <div className="w-px h-10 bg-platinum-200" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Video showcase */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-md lg:max-w-[440px]">
              {/* Video container */}
              <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden bg-navy-950 shadow-hero">
                <video
                  src={TAVUS_VIDEO_URL}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />

                {/* Agent info */}
                <div className="absolute bottom-0 inset-x-0 p-7">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.15em]">Live</span>
                      </div>
                      <div className="text-lg font-semibold text-white font-display">VAgent Maria</div>
                      <div className="text-sm text-white/60">Sales Assistant</div>
                    </div>
                    <div className="text-right bg-white/10 backdrop-blur-md rounded-xl px-4 py-3">
                      <div className="text-2xl font-bold text-white font-display">&lt;3s</div>
                      <div className="text-[10px] text-white/60 uppercase tracking-wider">Response</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                className="absolute -top-5 -left-5 lg:-left-10 bg-white rounded-2xl px-5 py-4 shadow-elevated border border-neutral-100"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-2xl font-bold text-navy-900 font-display">24/7</div>
                <div className="text-xs text-platinum-500">Always on</div>
              </motion.div>

              <motion.div
                className="absolute -bottom-5 -right-5 lg:-right-10 bg-white rounded-2xl px-5 py-4 shadow-elevated border border-neutral-100"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="text-2xl font-bold text-navy-900 font-display">3-4x</div>
                <div className="text-xs text-platinum-500">More bookings</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
