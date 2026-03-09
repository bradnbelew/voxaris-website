import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, PhoneCall, Users, Zap, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ease = [0.22, 1, 0.36, 1] as const;

const squadMembers = [
  { role: 'Receptionist', desc: 'Answers instantly, captures intent, routes cleanly', color: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
  { role: 'Qualifier', desc: 'Identifies intent, gathers context and requirements', color: 'bg-blue-500', glow: 'shadow-blue-500/20' },
  { role: 'Specialist', desc: 'Handles consultative questions, reduces hesitation', color: 'bg-amber-500', glow: 'shadow-amber-500/20' },
  { role: 'Closer', desc: 'Secures the appointment, confirms details, syncs CRM', color: 'bg-rose-500', glow: 'shadow-rose-500/20' },
];

export function Hero() {
  return (
    <section data-section="hero" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      {/* Background — refined with subtle gold warmth */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px]"
          style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(212,168,67,0.04) 0%, rgba(148,163,184,0.04) 30%, transparent 60%)' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />
        {/* Noise texture for depth */}
        <div className="absolute inset-0 noise-overlay opacity-40" />
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
              <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-gold-200/60 bg-gold-50/50 backdrop-blur-sm shadow-gold-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400/60 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500" />
                </span>
                <span className="text-[11px] font-semibold text-gold-700 uppercase tracking-[0.15em]">AI Sales Teams for Every Business</span>
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="headline-hero text-slate-900 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              One AI bot is not enough.
              <br />
              <span className="text-gold-gradient">V·TEAMS</span>{' '}
              <span className="text-slate-400">gives you a full AI sales team.</span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              className="text-lg sm:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              Receptionist, qualifier, specialist, and closer — working together in real time to answer your inbound calls, carry context across every handoff, and book appointments without dropping the lead.
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
                  className="bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-700 hover:via-gold-600 hover:to-gold-700 text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-gold-btn hover:shadow-[0_8px_32px_rgba(212,168,67,0.30)] transition-all duration-500 hover:-translate-y-0.5 border border-gold-400/30"
                >
                  Book a Live Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 px-8 text-[15px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full group border border-slate-200 hover:border-gold-300/50 transition-all duration-300"
                >
                  <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  Hear a Live Call
                </Button>
              </Link>
            </motion.div>

            {/* Proof strip */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {[
                'Works for any industry',
                'Warm transfers with full context',
                'CRM sync in real time',
                'Live in days, not months',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — V·TEAMS squad visualization */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease }}
          >
            <div className="relative w-full max-w-md lg:max-w-[480px]">
              {/* Gold-tinted glow behind card */}
              <div
                className="absolute -inset-12 rounded-[4rem] -z-10"
                style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.08) 0%, rgba(148,163,184,0.08) 40%, transparent 70%)' }}
              />

              {/* Call flow card */}
              <div className="bg-white rounded-3xl shadow-card-luxury overflow-hidden border border-slate-200/80 hover:shadow-card-luxury-hover transition-shadow duration-500">
                {/* Header — with gold accent line */}
                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between relative">
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                      <PhoneCall className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[13px]">Inbound Sales Call</div>
                      <div className="text-[10px] opacity-50">Acme Corp — After Hours</div>
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

                {/* Squad flow */}
                <div className="px-5 py-5 space-y-3">
                  {squadMembers.map((member, i) => (
                    <motion.div
                      key={member.role}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-gold-200/40 transition-colors duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 0.5, ease }}
                    >
                      <div className={`w-2 h-8 rounded-full ${member.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-slate-800">{member.role}</div>
                        <div className="text-[10px] text-slate-400 truncate">{member.desc}</div>
                      </div>
                      {i < squadMembers.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                      )}
                      {i === squadMembers.length - 1 && (
                        <div className="text-[9px] font-semibold text-gold-700 bg-gold-50 border border-gold-200/50 px-2 py-0.5 rounded-full shrink-0">Booked</div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Call result */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Database className="w-3 h-3" />
                      CRM synced · Transcript saved
                    </div>
                    <div className="text-gold-600 font-semibold">Appointment confirmed</div>
                  </div>
                  <motion.div
                    className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, delay: 2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Floating badge — V·TEAMS */}
              <motion.div
                className="absolute -top-4 -left-4 lg:-left-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-gold-200/40 shadow-[0_8px_30px_rgba(212,168,67,0.08)]"
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-1">Powered by</div>
                <div className="text-lg font-bold text-gold-gradient font-display">V·TEAMS</div>
              </motion.div>

              {/* Floating badge — speed */}
              <motion.div
                className="absolute -bottom-4 -right-4 lg:-right-8 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mb-1">Answer Time</div>
                <div className="text-lg font-bold text-slate-900 font-display">&lt; 5s</div>
                <div className="text-[9px] text-slate-400">24/7/365</div>
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
