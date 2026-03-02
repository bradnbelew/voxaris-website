import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CVIProvider, Conversation } from '@/components/cvi';
import { Navbar } from '@/components/marketing';

const ease = [0.22, 1, 0.36, 1] as const;
const AGENT_VIDEO = "https://cdn.replica.tavus.io/39359/cd603e65.mp4";

interface PersonaConfig {
  slug: string;
  name: string;
  title: string;
  tagline: string;
}

const PERSONAS: Record<string, PersonaConfig> = {
  ethan: {
    slug: 'ethan',
    name: 'Ethan Stopperich',
    title: 'Founder & CEO',
    tagline: 'See what our AI can do — live, right now.',
  },
  mike: {
    slug: 'mike',
    name: 'Mike Stopperich',
    title: 'Sales',
    tagline: 'See what our AI can do — live, right now.',
  },
};

export function BusinessCardAgent({ persona }: { persona: string }) {
  const config = PERSONAS[persona] || PERSONAS.ethan;

  const [state, setState] = useState<'idle' | 'loading' | 'live' | 'ended'>('idle');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(async () => {
    setState('loading');
    setError(null);

    try {
      const res = await fetch('/api/voxaris/tavus/business-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: config.slug }),
      });

      const data = await res.json();

      if (data.success && data.conversation_url) {
        setConversationUrl(data.conversation_url);
        setState('live');
      } else {
        setError('Could not start session. Please try again.');
        setState('idle');
      }
    } catch {
      setError('Connection error. Please try again.');
      setState('idle');
    }
  }, [config.slug]);

  const handleLeave = useCallback(() => {
    setState('ended');
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-[80px]">
        <AnimatePresence mode="wait">

          {/* ── Idle: Hero ── */}
          {state === 'idle' && (
            <motion.section
              key="idle"
              className="relative w-full min-h-[calc(100vh-80px)] flex items-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {/* Background — matching homepage hero */}
              <div className="absolute inset-0">
                <div
                  className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1600px] h-[1000px]"
                  style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(148,163,184,0.06) 0%, transparent 60%)' }}
                />
                <div className="absolute inset-0 grid-pattern opacity-[0.025]" />
                <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full py-16 lg:py-0">
                <div className="max-w-2xl mx-auto text-center">

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
                      <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-[0.15em]">
                        {config.name} &middot; {config.title}
                      </span>
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    className="headline-hero text-slate-900 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease }}
                  >
                    Meet our
                    <br />
                    <span className="text-slate-400">AI agent.</span>
                  </motion.h1>

                  {/* Maria video preview */}
                  <motion.div
                    className="relative mx-auto mb-10 w-48 h-48 sm:w-56 sm:h-56"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease }}
                  >
                    {/* Silver glow behind */}
                    <div
                      className="absolute -inset-8 rounded-full -z-10"
                      style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(148,163,184,0.12) 0%, transparent 70%)' }}
                    />
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.12)] ring-[6px] ring-white/90">
                      <video
                        src={AGENT_VIDEO}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 text-white text-[10px] font-medium flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                        </span>
                        Maria · AI Agent
                      </div>
                    </div>
                  </motion.div>

                  {/* Subhead */}
                  <motion.p
                    className="text-xl sm:text-[22px] text-slate-600 mb-4 max-w-lg mx-auto font-medium leading-snug"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease }}
                  >
                    {config.tagline}
                  </motion.p>

                  <motion.p
                    className="text-[17px] text-slate-400 leading-relaxed mb-10 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3, ease }}
                  >
                    She can see you, hear you, and have a real conversation — no forms, no waiting.
                  </motion.p>

                  {/* Error */}
                  {error && (
                    <motion.p
                      className="text-red-500 text-sm mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* CTA */}
                  <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, ease }}
                  >
                    <Button
                      size="lg"
                      onClick={startSession}
                      className="bg-slate-900 hover:bg-black text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-0.5"
                    >
                      Start Conversation
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>

                  {/* Trust points */}
                  <motion.div
                    className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    {[
                      'Real-time video AI',
                      'No downloads required',
                      'Works on any device',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </motion.div>

                  {/* Founder note */}
                  <motion.div
                    className="mt-12 pt-8 border-t border-slate-100 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600">
                        {config.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <div className="text-[13px] font-semibold text-slate-700">{config.name}</div>
                        <div className="text-[11px] text-slate-400">{config.title}, Voxaris</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ── Loading ── */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              className="text-center py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-5" />
              <p className="text-slate-500 text-sm font-medium">Starting your AI conversation...</p>
              <p className="text-slate-400 text-xs mt-2">This takes a few seconds</p>
            </motion.div>
          )}

          {/* ── Live: Video agent ── */}
          {state === 'live' && conversationUrl && (
            <motion.div
              key="live"
              className="w-full max-w-4xl mx-auto px-6 sm:px-8 py-8"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {/* Context bar */}
              <div className="flex items-center justify-between px-5 py-3 mb-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 text-sm">
                    You're chatting with <span className="text-slate-900 font-medium">Maria</span> from Voxaris
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.1em]">Live</span>
                </div>
              </div>

              {/* Video container */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <CVIProvider>
                  <Conversation
                    conversationUrl={conversationUrl}
                    onLeave={handleLeave}
                    className="w-full h-full rounded-2xl"
                  />
                </CVIProvider>
              </div>

              <p className="mt-4 text-slate-400 text-xs text-center">
                Speak naturally — the agent hears you and responds in real time.
              </p>
            </motion.div>
          )}

          {/* ── Ended: CTAs ── */}
          {state === 'ended' && (
            <motion.div
              key="ended"
              className="text-center max-w-lg mx-auto px-6 py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease }}
              >
                <svg className="w-7 h-7 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </motion.div>

              <h2 className="headline-lg text-slate-900 mb-4">
                That was a live
                <br />
                <span className="text-slate-400">AI agent.</span>
              </h2>

              <p className="text-[17px] text-slate-500 mb-10 leading-relaxed max-w-md mx-auto">
                Imagine that on your website, 24/7 — greeting every visitor, qualifying leads, and booking appointments automatically.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/book-demo">
                  <Button
                    size="lg"
                    className="bg-slate-900 hover:bg-black text-white h-14 px-10 text-[15px] font-semibold rounded-full group shadow-[0_4px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-0.5"
                  >
                    Book a Strategy Call
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => {
                    setConversationUrl(null);
                    setState('idle');
                  }}
                  className="h-14 px-8 text-[15px] text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full group border border-slate-200 hover:border-slate-300 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2 group-hover:-rotate-45 transition-transform" />
                  Try Again
                </Button>
              </div>

              {/* Trust signals */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-400">
                  Want this for your business?{' '}
                  <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                    Learn more at voxaris.io
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — matching marketing footer */}
      <footer className="bg-carbon-950 border-t border-white/[0.04]">
        <div className="container-wide py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link to="/">
              <img src="/voxaris-logo-white.png" alt="Voxaris AI" className="h-12 w-auto opacity-40" />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { label: 'Technology', href: '/technology' },
                { label: 'Demo', href: '/demo' },
                { label: 'Contact', href: '/book-demo' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-[13px] text-white/20 hover:text-white/40 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-white/10">
              &copy; {new Date().getFullYear()} Voxaris AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
