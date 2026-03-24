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
    <section data-section="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
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
              className="flex items-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
            >
              {metrics.map((m, i) => (
                <div key={m.label} className="flex flex-col">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">{m.value}</div>
                  <div className="text-xs text-slate-500 font-medium">{m.label}</div>
                  <div className="text-[10px] text-slate-400">{m.sub}</div>
                  {i < metrics.length - 1 && <div className="hidden" />}
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
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                'Built for auto dealers',
                'Works with any DMS / CRM',
                'Live in 48 hours',
                'No contracts',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Talking Postcard flow visualization */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <div className="relative w-full max-w-md lg:max-w-[480px]">
              {/* Glow */}
              <div
                className="absolute -inset-12 rounded-[4rem] -z-10"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.08) 0%, rgba(148,163,184,0.08) 40%, transparent 70%)' }}
              />

              {/* Main card — the postcard flow */}
              <div className="bg-white rounded-3xl shadow-card-luxury overflow-hidden border border-slate-200/80 hover:shadow-card-luxury-hover transition-shadow duration-500">
                {/* Header */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between relative">
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[13px]">Talking Postcard</div>
                      <div className="text-[10px] opacity-50">VIP Buyback Campaign — Orlando Motors</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium">Live</span>
                  </div>
                </div>

                {/* Customer context */}
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[13px] font-bold text-slate-600">JS</div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-800">John Smith</div>
                      <div className="text-[10px] text-slate-400">2022 Kia Telluride — Scanned 12s ago</div>
                    </div>
                  </div>

                  {/* Agent speaking */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">M</span>
                      </div>
                      <span className="text-[10px] font-semibold text-gold-700">Maria — AI Agent</span>
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed italic">
                      "Hey John! You scanned the mailer — those Tellurides are super popular right now. We've got buyers looking for yours specifically. Can I get you in for a quick 15-minute VIP appraisal?"
                    </p>
                  </div>
                </div>

                {/* Flow steps */}
                <div className="px-5 pb-4 space-y-2.5">
                  {flowSteps.map((step, i) => (
                    <motion.div
                      key={step.label}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-gold-200/40 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.2, duration: 0.5, ease }}
                    >
                      <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center ring-4 ${step.ring} shrink-0`}>
                        <step.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-slate-800">{step.label}</div>
                        <div className="text-[10px] text-slate-400 truncate">{step.detail}</div>
                      </div>
                      {i < flowSteps.length - 1 ? (
                        <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                      ) : (
                        <div className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-2 py-0.5 rounded-full shrink-0">Done</div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Result bar */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <TrendingUp className="w-3 h-3" />
                      CRM synced · Confirmation text sent
                    </div>
                    <div className="text-emerald-600 font-semibold">Appointment booked</div>
                  </div>
                  <motion.div
                    className="h-1.5 bg-slate-100 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-emerald-500 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, delay: 2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Floating badge — response rate */}
              <motion.div
                className="absolute -top-4 -left-4 lg:-left-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-gold-200/40 shadow-[0_8px_30px_rgba(212,168,67,0.08)]"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-1">Response Rate</div>
                <div className="text-lg font-bold text-gold-gradient font-display">6-12%</div>
                <div className="text-[9px] text-slate-400">vs 0.5% email</div>
              </motion.div>

              {/* Floating badge — speed */}
              <motion.div
                className="absolute -bottom-4 -right-4 lg:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-1">Time to Appt</div>
                <div className="text-lg font-bold text-slate-900 font-display">Under 2 min</div>
                <div className="text-[9px] text-slate-400">Scan → Booked</div>
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
