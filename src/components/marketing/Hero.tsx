import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ScanLine, Video, CalendarCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

const flowSteps = [
  { icon: ScanLine, label: 'Customer scans QR', detail: 'Personalized mailer hits their mailbox', color: 'bg-blue-500', ring: 'ring-blue-500/20' },
  { icon: Video, label: 'AI video agent greets them', detail: 'By name, referencing their exact vehicle', color: 'bg-gold-500', ring: 'ring-gold-500/20' },
  { icon: CalendarCheck, label: 'Appointment booked', detail: 'Synced to your CRM in real time', color: 'bg-emerald-500', ring: 'ring-emerald-500/20' },
];

const metrics = [
  { value: '6-12%', label: 'Response rate', sub: 'vs 0.5% email' },
  { value: '<3s', label: 'First response', sub: 'instant engagement' },
  { value: '47', label: 'Appts booked', sub: 'week one avg' },
];

export function Hero() {
  return (
    <section data-section="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px]"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(212,168,67,0.04) 0%, rgba(148,163,184,0.04) 30%, transparent 60%)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />
        <div className="absolute inset-0 noise-overlay opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="max-w-xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gold-200/60 bg-gold-50/50 backdrop-blur-sm shadow-gold-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400/60 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                </span>
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.15em]">Talking Postcards for Dealerships</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="headline-hero text-slate-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              Your mailer just became{' '}
              <span className="text-gold-gradient">your best salesperson.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="text-lg sm:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              Personalized postcards with QR codes that launch a live AI video agent — she greets your customer by name, talks about their exact vehicle, and books the appraisal. All before your BDC opens.
            </motion.p>

            {/* Metrics row */}
            <motion.div
              className="flex items-center gap-5 sm:gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
            >
              {metrics.map((m, i) => (
                <div key={m.label} className="flex flex-col">
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 font-display">{m.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{m.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease }}
            >
              <Link to="/talking-postcard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn hover:shadow-[0_8px_32px_rgba(212,168,67,0.30)] transition-all duration-500 hover:-translate-y-0.5 border border-gold-400/30"
                >
                  See It In Action
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/book-demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full group border border-slate-200 hover:border-gold-300/50 transition-all duration-300"
                >
                  <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Book a Demo
                </Button>
              </Link>
            </motion.div>

            {/* Proof strip */}
            <motion.div
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                'Works with any CRM',
                'Live in 48 hours',
                'No contracts',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gold-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Julia AI agent video */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <div className="relative w-full max-w-md lg:max-w-[440px]">
              {/* Glow */}
              <div
                className="absolute -inset-10 rounded-[3rem] -z-10"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.08) 0%, rgba(148,163,184,0.04) 40%, transparent 70%)' }}
              />

              {/* Video container */}
              <div className="rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-slate-200/60">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster="/julia-avatar-still.jpg"
                  className="w-full aspect-[4/5] object-cover bg-slate-900"
                >
                  <source src="/julia-avatar.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Name badge */}
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-full px-5 py-2.5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center gap-2.5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[13px] font-semibold text-slate-900">Julia</span>
                <span className="text-[11px] text-slate-400">AI Sales Agent</span>
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
