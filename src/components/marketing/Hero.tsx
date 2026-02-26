import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

const MARIA_VIDEO = "https://cdn.replica.tavus.io/40242/2fe8396c.mp4";

export function Hero() {
  return (
    <section data-section="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      {/* Background — ultra-subtle silver ambient */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px]"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(148,163,184,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.025]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-10"
            >
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-200 bg-slate-50/80 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.15em]">Now in Early Access</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="headline-hero text-slate-900 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              Every lead gets
              <br />
              <span className="text-slate-900">a face, a voice,</span>
              <br />
              <span className="text-slate-400">a conversation.</span>
            </motion.h1>

            {/* Value prop */}
            <motion.p
              className="text-xl sm:text-[22px] text-slate-600 mb-4 max-w-lg font-medium leading-snug"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              Meet <span className="font-bold text-slate-900">V·GUIDE</span> — the video agent that actually works on your website.
            </motion.p>

            <motion.p
              className="text-[17px] text-slate-400 leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease }}
            >
              A photorealistic avatar that visibly controls your live site — scrolling, clicking, filling forms, and completing bookings — while having a natural conversation with every visitor.
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
                  className="bg-slate-900 hover:bg-black text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-0.5"
                >
                  Book a Personalized Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full group border border-slate-200 hover:border-slate-300 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Watch 45-Second Demo
                </Button>
              </Link>
            </motion.div>

            {/* Trust points */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                'Live in days, not months',
                'Works on any existing website',
                'Double confirmation on every action',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* Founder note */}
            <motion.div
              className="mt-12 pt-8 border-t border-slate-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="text-[14px] text-slate-400 leading-relaxed italic max-w-md">
                "I built V·GUIDE because I watched businesses lose leads every night to empty websites. Now every visitor gets a guide who actually helps them."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600">E</div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-700">Ethan Stopperich</div>
                  <div className="text-[11px] text-slate-400">Founder, Voxaris</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — V·GUIDE mock website visual */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <div className="relative w-full max-w-md lg:max-w-[460px]">
              {/* Silver glow */}
              <div
                className="absolute -inset-12 rounded-[4rem] -z-10"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(148,163,184,0.15) 0%, transparent 70%)' }}
              />

              {/* Mock website card */}
              <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-slate-200/80">
                {/* Browser chrome */}
                <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-3 py-1 border border-slate-200/60 text-[10px] text-slate-400 font-mono">
                    oceanfrontresort.com/book
                  </div>
                </div>

                {/* Mock header */}
                <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-white/15 rounded-lg" />
                    <div>
                      <div className="font-medium text-[12px]">Oceanfront Resort</div>
                      <div className="text-[9px] opacity-40">Book your escape</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-[10px] text-white/40">
                    <span>Rooms</span>
                    <span>Dining</span>
                    <span className="text-white/80 font-medium">Book</span>
                  </div>
                </div>

                {/* Maria avatar + control indicator */}
                <div className="relative aspect-[16/11] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
                  {/* Avatar frame */}
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.15)] ring-[6px] ring-white/90">
                    <video
                      src={MARIA_VIDEO}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 text-white text-[10px] font-medium flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                      </span>
                      Speaking · Scrolling for you
                    </div>
                  </div>

                  {/* Vox badge */}
                  <motion.div
                    className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-700 text-[10px] font-medium px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 border border-slate-100"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <span className="text-amber-500 text-xs">↻</span>
                    Vox is moving the page
                  </motion.div>
                </div>

                {/* Mock form showing live action */}
                <div className="px-5 py-4 space-y-3 text-sm border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="text-slate-400 text-[11px]">Dates · Guests</div>
                    <div className="text-emerald-600 font-medium text-[10px]">Maria selected Mar 15–22</div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-slate-400 to-slate-600 rounded-full"
                      initial={{ width: '20%' }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 2.5, delay: 1.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded bg-emerald-100 flex items-center justify-center">
                      <svg className="w-2 h-2 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-500">Awaiting guest confirmation</span>
                  </div>
                </div>
              </div>

              {/* Floating badge — V·GUIDE */}
              <motion.div
                className="absolute -top-4 -left-4 lg:-left-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-1">Powered by</div>
                <div className="text-lg font-bold text-slate-900 font-display">V·GUIDE</div>
              </motion.div>

              {/* Floating badge — early access */}
              <motion.div
                className="absolute -bottom-4 -right-4 lg:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-1">Early Results</div>
                <div className="text-lg font-bold text-slate-900 font-display">3-4x</div>
                <div className="text-[9px] text-slate-400">more bookings</div>
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
