import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section data-section="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[1400px] h-[900px]"
          style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.015) 0%, transparent 55%)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-10"
            >
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-carbon-200 bg-carbon-50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-carbon-600 uppercase tracking-[0.15em]">Now live: V·GUIDE</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="headline-hero text-carbon-900 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              Every lead gets
              <br />
              <span className="text-carbon-900">a face, a voice,</span>
              <br />
              <span className="text-carbon-400">a conversation.</span>
            </motion.h1>

            {/* V·GUIDE value prop */}
            <motion.p
              className="text-xl sm:text-2xl text-carbon-600 mb-3 max-w-lg font-medium"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              Meet <span className="font-bold text-carbon-900">V·GUIDE</span> — the world's first embodied real-time video agent that actually works on your website.
            </motion.p>

            <motion.p
              className="text-lg text-carbon-400 leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              One single {'<script>'} tag. A photorealistic avatar that scrolls, clicks, fills forms, and completes bookings in full view — while having a natural conversation.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link to="/book-demo">
                <Button
                  size="lg"
                  className="bg-carbon-900 hover:bg-black text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-0.5"
                >
                  Add V·GUIDE to Your Site
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-carbon-500 hover:text-carbon-700 hover:bg-carbon-50 rounded-full group border border-carbon-200 hover:border-carbon-300 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch 45-Second Demo
                </Button>
              </Link>
            </motion.div>

            {/* Trust points */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-carbon-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                'Zero code changes',
                'Works on any existing website',
                'Double confirmation on bookings',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-12 pt-8 border-t border-carbon-100 flex items-center gap-12"
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

          {/* Right — V·GUIDE mock website visual */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <div className="relative w-full max-w-md lg:max-w-[440px]">
              {/* Silver glow */}
              <div className="absolute -inset-10 bg-gradient-to-br from-slate-200/30 to-transparent rounded-[4rem] -z-10" />

              {/* Mock website card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-carbon-200">
                {/* Mock header */}
                <div className="bg-carbon-900 text-white p-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-xl" />
                    <div>
                      <div className="font-medium text-[13px]">Oceanfront Resort</div>
                      <div className="text-[10px] opacity-50">Book your escape</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                </div>

                {/* Maria avatar + control indicator */}
                <div className="relative aspect-video bg-carbon-50 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-carbon-50 to-carbon-100" />

                  {/* Avatar frame */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-br from-carbon-200 to-carbon-400 rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/80">
                    <video
                      src="https://cdn.replica.tavus.io/40242/2fe8396c.mp4"
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                    <div className="absolute bottom-3 left-3 text-white text-[11px] font-medium flex items-center gap-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      Speaking · Scrolling for you
                    </div>
                  </div>

                  {/* Rover badge */}
                  <motion.div
                    className="absolute top-4 right-4 bg-white text-carbon-800 text-[11px] font-medium px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2 border border-carbon-100"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <span className="text-amber-500">↻</span>
                    Rover is moving the page
                  </motion.div>
                </div>

                {/* Mock form showing live action */}
                <div className="p-5 space-y-3 text-sm border-t border-carbon-100">
                  <div className="flex justify-between items-center">
                    <div className="text-carbon-400 text-[12px]">Dates · Guests</div>
                    <div className="text-emerald-600 font-medium text-[11px]">Maria just selected Mar 15–22</div>
                  </div>
                  <div className="h-2 bg-carbon-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-carbon-400 to-carbon-600 rounded-full"
                      initial={{ width: '20%' }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 2, delay: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-md bg-emerald-100 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-carbon-500">Awaiting guest confirmation</span>
                  </div>
                </div>
              </div>

              {/* Floating badge — V·GUIDE */}
              <motion.div
                className="absolute -top-3 -left-3 lg:-left-6 bg-white backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-carbon-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-[10px] text-carbon-400 uppercase tracking-[0.15em] mb-1">Powered by</div>
                <div className="text-lg font-bold text-carbon-900 font-display">V·GUIDE</div>
              </motion.div>

              {/* Floating badge — conversion */}
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
