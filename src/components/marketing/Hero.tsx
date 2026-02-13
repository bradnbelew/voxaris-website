import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TAVUS_VIDEO_URL = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-white">
      {/* Background — subtle light texture */}
      <div className="absolute inset-0">
        {/* Primary ambient glow — warm grey */}
        <div
          className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.015) 0%, transparent 55%)',
          }}
        />
        {/* Secondary glow — offset */}
        <div
          className="absolute top-[10%] right-[5%] w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.01) 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-hero w-full pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10"
            >
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-carbon-200 bg-carbon-50">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400/80" />
                </span>
                <span className="text-[11px] font-semibold text-carbon-500 uppercase tracking-[0.2em]">The Human Interface</span>
              </span>
            </motion.div>

            {/* Headline — massive, Apple-style */}
            <motion.h1
              className="headline-hero text-carbon-900 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Every lead gets
              <br />
              <span className="text-carbon-900">a face, a voice,</span>
              <br />
              <span className="text-carbon-400">a conversation.</span>
            </motion.h1>

            {/* Sub — clean, understated */}
            <motion.p
              className="text-lg sm:text-xl text-carbon-400 leading-relaxed mb-12 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Voxaris deploys photorealistic video and natural voice AI agents
              that engage, qualify, and convert your leads — 24/7, at scale,
              with zero human effort.
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
                  className="bg-carbon-900 hover:bg-carbon-800 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-0.5"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-carbon-400 hover:text-carbon-700 hover:bg-carbon-50 rounded-full group border border-carbon-200 hover:border-carbon-300 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  See It Live
                </Button>
              </Link>
            </motion.div>

            {/* Metrics bar */}
            <motion.div
              className="mt-16 pt-10 border-t border-carbon-100 flex items-center gap-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {[
                { value: '<3s', label: 'Response time' },
                { value: '24/7', label: 'Always on' },
                { value: '3-4x', label: 'More bookings' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-12">
                  <div>
                    <div className="text-2xl font-bold text-carbon-900 font-display tracking-tight">{stat.value}</div>
                    <div className="text-[11px] text-carbon-400 mt-1 tracking-wide">{stat.label}</div>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-carbon-100" />}
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
              <div className="absolute -inset-12 opacity-10 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.08) 0%, transparent 65%)' }}
              />

              {/* Video container */}
              <div className="relative aspect-[3/4] rounded-[32px] overflow-hidden bg-carbon-50 border border-carbon-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <video
                  src={TAVUS_VIDEO_URL}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                {/* Top badge */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
                  <div className="bg-white/90 backdrop-blur-xl rounded-full px-4 py-1.5 border border-carbon-200">
                    <span className="text-[10px] font-semibold text-carbon-700 uppercase tracking-[0.15em]">V·FACE</span>
                  </div>
                </div>

                {/* Bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

                {/* Agent info overlay */}
                <div className="absolute bottom-0 inset-x-0 p-7">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-[0.15em]">Live Conversation</span>
                      </div>
                      <div className="text-lg font-semibold text-white font-display">Talking Postcard</div>
                      <div className="text-[12px] text-white/30 mt-0.5">Personalized video outreach</div>
                    </div>
                    <div className="text-right bg-white/[0.06] backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/[0.06]">
                      <div className="text-2xl font-bold text-white font-display">&lt;3s</div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">Response</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating tag — top left */}
              <motion.div
                className="absolute -top-3 -left-3 lg:-left-6 bg-white backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-carbon-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-[10px] text-carbon-400 uppercase tracking-[0.15em] mb-1">Powered by</div>
                <div className="text-lg font-bold text-carbon-900 font-display">V·SENSE</div>
              </motion.div>

              {/* Floating tag — bottom right */}
              <motion.div
                className="absolute -bottom-3 -right-3 lg:-right-6 bg-white backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-carbon-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="text-[10px] text-carbon-400 uppercase tracking-[0.15em] mb-1">Conversion</div>
                <div className="text-lg font-bold text-carbon-900 font-display">3-4x</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white" />
    </section>
  );
}
