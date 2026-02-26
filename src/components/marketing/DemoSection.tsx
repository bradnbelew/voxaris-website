import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;
const MARIA_VIDEO = "https://cdn.replica.tavus.io/40242/2fe8396c.mp4";

const DEMO_STEPS = [
  { label: 'Greeting', caption: '"Welcome to Oceanfront Resort! I\'m Maria — let me help you find the perfect stay."', action: 'idle' },
  { label: 'Browsing', caption: '"Let me scroll down to our available suites for your dates..."', action: 'scroll' },
  { label: 'Filtering', caption: '"I\'ll filter for ocean-view rooms with a balcony — those book fast."', action: 'filter' },
  { label: 'Selecting', caption: '"The Sunrise Suite looks perfect. Let me select March 15–22 for you."', action: 'select' },
  { label: 'Booking', caption: '"I\'ve filled in the reservation form. Can you confirm these details?"', action: 'book' },
  { label: 'Confirmed', caption: '"You\'re all set! Confirmation sent to your email. Have a wonderful trip."', action: 'done' },
];

export function DemoSection() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (inView && !autoPlay) {
      setAutoPlay(true);
    }
  }, [inView, autoPlay]);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % DEMO_STEPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const current = DEMO_STEPS[step];

  return (
    <section ref={ref} data-section="demo" className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14 lg:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.25em] mb-6 block">See It In Action</span>
          <h2 className="headline-xl text-slate-900 mb-6">
            Watch V·GUIDE
            <br className="hidden sm:block" />
            <span className="text-slate-400">work a live website.</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto text-lg">
            From greeting to confirmed booking — in under 90 seconds.
          </p>
        </motion.div>

        {/* Split-screen demo */}
        <motion.div
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-stretch"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {/* Left — Mock booking page */}
          <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden">
            {/* Browser bar */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 border border-slate-200/60 text-[10px] text-slate-400 font-mono">
                oceanfrontresort.com/book
              </div>
            </div>

            {/* Page content — interactive */}
            <div className="p-6 lg:p-8 space-y-5 min-h-[400px] relative">
              {/* Mock nav */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-200 rounded-lg" />
                  <span className="text-[12px] font-semibold text-slate-700">Oceanfront Resort</span>
                </div>
                <div className="flex gap-4 text-[11px] text-slate-400">
                  <span>Rooms</span>
                  <span>Dining</span>
                  <span className={`transition-colors duration-500 ${step >= 1 ? 'text-slate-900 font-medium' : ''}`}>Book</span>
                </div>
              </div>

              {/* Filter bar */}
              <div className={`flex flex-wrap gap-2 transition-all duration-700 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all duration-500 ${step >= 2 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                  Ocean View
                </span>
                <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium border transition-all duration-500 ${step >= 2 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                  Balcony
                </span>
                <span className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-white text-slate-400 border border-slate-200">
                  Suite
                </span>
                <span className="px-3 py-1.5 rounded-full text-[10px] font-medium bg-white text-slate-400 border border-slate-200">
                  King Bed
                </span>
              </div>

              {/* Room cards */}
              <div className="space-y-3">
                {[
                  { name: 'Sunrise Suite', price: '$489', selected: step >= 3 },
                  { name: 'Coral Room', price: '$329', selected: false },
                  { name: 'Palm Studio', price: '$259', selected: false },
                ].map((room) => (
                  <div
                    key={room.name}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-700 ${
                      room.selected
                        ? 'border-emerald-300 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl transition-all duration-500 ${room.selected ? 'bg-emerald-100' : 'bg-slate-100'}`} />
                      <div>
                        <div className="text-[13px] font-semibold text-slate-800">{room.name}</div>
                        <div className="text-[10px] text-slate-400">Ocean view · Balcony · King</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[14px] font-bold text-slate-900">{room.price}</div>
                      <div className="text-[9px] text-slate-400">per night</div>
                    </div>
                    {room.selected && (
                      <motion.div
                        className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center ml-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Booking form */}
              <div className={`space-y-3 transition-all duration-700 ${step >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Check-in</div>
                    <div className={`text-[12px] font-medium transition-all duration-500 ${step >= 4 ? 'text-slate-900' : 'text-slate-300'}`}>
                      {step >= 4 ? 'Mar 15, 2026' : '—'}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60">
                    <div className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Check-out</div>
                    <div className={`text-[12px] font-medium transition-all duration-500 ${step >= 4 ? 'text-slate-900' : 'text-slate-300'}`}>
                      {step >= 4 ? 'Mar 22, 2026' : '—'}
                    </div>
                  </div>
                </div>
                {step >= 5 && (
                  <motion.div
                    className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-emerald-700 text-[13px] font-semibold">Booking Confirmed</div>
                    <div className="text-emerald-600 text-[10px] mt-1">Sunrise Suite · Mar 15–22 · $3,423 total</div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Avatar + narration */}
          <div className="flex flex-col gap-6">
            {/* Maria video */}
            <div className="bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-slate-200/80 overflow-hidden flex-1">
              <div className="relative aspect-square bg-slate-900">
                <video
                  src={MARIA_VIDEO}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

                {/* Status */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[9px] font-semibold text-slate-700 uppercase tracking-wider">
                    V·GUIDE
                  </div>
                  <div className="bg-emerald-500 rounded-full px-2.5 py-1 text-[9px] font-semibold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Caption bubble */}
                <div className="absolute bottom-4 left-4 right-4">
                  <motion.div
                    key={step}
                    className="bg-black/60 backdrop-blur-md rounded-2xl px-4 py-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-white text-[12px] leading-relaxed">{current.caption}</p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex gap-1.5">
              {DEMO_STEPS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setStep(i); setAutoPlay(false); }}
                  className="flex-1 group"
                >
                  <div className={`h-1 rounded-full transition-all duration-500 ${
                    i === step ? 'bg-slate-900' : i < step ? 'bg-slate-300' : 'bg-slate-200'
                  }`} />
                  <div className={`text-[9px] mt-2 font-medium transition-colors ${
                    i === step ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {s.label}
                  </div>
                </button>
              ))}
            </div>

            {/* CTA */}
            <Link to="/book-demo" className="block">
              <Button className="w-full bg-slate-900 hover:bg-black text-white h-12 rounded-xl text-[14px] font-semibold group shadow-sm transition-all duration-300 hover:shadow-md">
                See V·GUIDE on Your Website
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
