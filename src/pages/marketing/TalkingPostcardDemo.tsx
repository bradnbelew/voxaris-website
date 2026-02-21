import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Loader2,
  ArrowRight,
  CalendarCheck,
  RotateCcw,
  Shield,
  Sparkles,
} from 'lucide-react';
import { CVIProvider, Conversation } from '@/components/cvi';

/**
 * /talking-postcard/demo
 *
 * Polished embed page for the Tavus CVI video agent.
 * Uses the proper Daily React SDK via CVIProvider + Conversation component
 * instead of raw DailyIframe.createFrame().
 *
 * Expects query params:
 *   ?url=<conversation_url>&dealership=<name>&name=<gm_name>
 */

export function TalkingPostcardDemo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const conversationUrl = searchParams.get('url');
  const dealership = searchParams.get('dealership') || 'your dealership';
  const gmName = searchParams.get('name') || '';

  const [hasEnded, setHasEnded] = useState(false);

  const handleLeave = useCallback(() => {
    setHasEnded(true);
  }, []);

  // No conversation URL — show error
  if (!conversationUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Shield className="w-7 h-7 text-zinc-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Session Not Found</h1>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            This demo session has expired or the link is invalid.
            Generate a new demo to talk to your AI agent.
          </p>
          <Link
            to="/talking-postcard"
            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-semibold text-lg py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5"
          >
            Generate New Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/voxaris-logo-white.png"
              alt="Voxaris"
              className="h-6 w-auto opacity-50 group-hover:opacity-70 transition-opacity"
            />
          </Link>
          <div className="w-px h-5 bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400 text-sm font-medium">Talking Postcard Demo</span>
          </div>
        </div>

        {!hasEnded && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Live
            </span>
          </motion.div>
        )}
      </header>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10">
        {/* Context bar */}
        <motion.div
          className="w-full max-w-4xl mb-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
            <div>
              <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold">
                Demo for
              </span>
              <p className="text-white font-semibold text-sm mt-0.5">{dealership}</p>
            </div>
            {gmName && (
              <div className="text-right">
                <span className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-semibold">
                  Requested by
                </span>
                <p className="text-white font-semibold text-sm mt-0.5">{gmName}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Video / End-state container */}
        <div className="w-full max-w-4xl aspect-video relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 shadow-2xl shadow-black/40">
          <AnimatePresence mode="wait">
            {hasEnded ? (
              /* ── Ended state ── */
              <motion.div
                key="ended"
                className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#0a0a0a]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center max-w-lg"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CalendarCheck className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                    That was your AI agent.
                  </h2>
                  <p className="text-zinc-500 mb-8 leading-relaxed">
                    Imagine that running 24/7 for every lead that contacts{' '}
                    <span className="text-zinc-300 font-medium">{dealership}</span>.
                    No missed calls. No slow follow-ups. Just booked appointments.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      to="/book-demo"
                      className="bg-white hover:bg-zinc-100 text-black font-semibold py-4 px-8 rounded-2xl inline-flex items-center gap-2 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Book a Strategy Call
                    </Link>
                    <button
                      onClick={() => navigate('/talking-postcard')}
                      className="text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 font-medium py-4 px-6 rounded-2xl transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Generate Another
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* ── Live CVI conversation ── */
              <motion.div
                key="conversation"
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <CVIProvider>
                  <Conversation
                    conversationUrl={conversationUrl}
                    onLeave={handleLeave}
                    className="w-full h-full rounded-2xl"
                  />
                </CVIProvider>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tip bar */}
        {!hasEnded && (
          <motion.p
            className="mt-5 text-zinc-600 text-xs text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Speak naturally — the agent hears you and responds in real time.
            Your mic is on by default.
          </motion.p>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="px-6 py-4 border-t border-zinc-800/40 text-center">
        <p className="text-zinc-700 text-xs">
          Powered by <span className="text-zinc-500">Voxaris AI</span> &bull;{' '}
          <Link
            to="/talking-postcard"
            className="text-zinc-500 hover:text-zinc-400 transition-colors"
          >
            Generate another demo
          </Link>
        </p>
      </footer>
    </div>
  );
}
