import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2, CalendarCheck, Sparkles, Play, ArrowRight } from 'lucide-react';
import { CVIProvider, Conversation } from '@/components/cvi';

interface PersonaConfig {
  slug: string;
  name: string;
  title: string;
  tagline: string;
  ctaLabel: string;
}

const PERSONAS: Record<string, PersonaConfig> = {
  ethan: {
    slug: 'ethan',
    name: 'Ethan Stopperich',
    title: 'Founder & CEO',
    tagline: 'Talk to our AI — live, right now.',
    ctaLabel: 'Start Conversation',
  },
  mike: {
    slug: 'mike',
    name: 'Mike Stopperich',
    title: 'Sales',
    tagline: 'Talk to our AI — live, right now.',
    ctaLabel: 'Start Conversation',
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
    <div
      className="min-h-screen bg-[#07080a] text-white flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/40">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/voxaris-logo-white.png"
            alt="Voxaris"
            className="h-6 w-auto opacity-50 group-hover:opacity-70 transition-opacity"
          />
        </Link>
        {state === 'live' && (
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Live</span>
          </motion.div>
        )}
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10">
        <AnimatePresence mode="wait">
          {/* ── Idle: Landing hero ── */}
          {state === 'idle' && (
            <motion.div
              key="idle"
              className="text-center max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              {/* Gold accent line */}
              <div className="w-12 h-0.5 bg-[#d4a843] mx-auto mb-8" />

              <p className="text-[#d4a843] text-sm font-semibold uppercase tracking-[0.25em] mb-4">
                {config.name}'s Card
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                Meet our <span className="text-[#d4a843]">AI agent</span>.
              </h1>

              <p className="text-zinc-400 text-lg mb-3 leading-relaxed">
                {config.tagline}
              </p>
              <p className="text-zinc-600 text-sm mb-10">
                She can see you, hear you, and have a real conversation.
              </p>

              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}

              <button
                onClick={startSession}
                className="group relative inline-flex items-center gap-3 bg-[#d4a843] hover:bg-[#c49a3a] text-black font-semibold text-lg py-4 px-10 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_40px_rgba(212,168,67,0.25)] hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5" />
                {config.ctaLabel}
              </button>

              <p className="mt-6 text-zinc-700 text-xs">
                Powered by{' '}
                <Link to="/" className="text-zinc-500 hover:text-zinc-400 transition-colors">
                  Voxaris AI
                </Link>
              </p>
            </motion.div>
          )}

          {/* ── Loading: Creating session ── */}
          {state === 'loading' && (
            <motion.div
              key="loading"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-10 h-10 text-[#d4a843] animate-spin mx-auto mb-4" />
              <p className="text-zinc-400 text-sm">Starting your AI conversation...</p>
            </motion.div>
          )}

          {/* ── Live: Video agent ── */}
          {state === 'live' && conversationUrl && (
            <motion.div
              key="live"
              className="w-full max-w-4xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Context bar */}
              <div className="flex items-center justify-between px-5 py-3 mb-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4a843]" />
                  <span className="text-zinc-400 text-sm">
                    You're chatting with <span className="text-white font-medium">Maria</span> from Voxaris
                  </span>
                </div>
                <span className="text-zinc-600 text-xs">via {config.name}</span>
              </div>

              {/* Video container */}
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/60 shadow-2xl shadow-black/40">
                <CVIProvider>
                  <Conversation
                    conversationUrl={conversationUrl}
                    onLeave={handleLeave}
                    className="w-full h-full rounded-2xl"
                  />
                </CVIProvider>
              </div>

              <p className="mt-4 text-zinc-600 text-xs text-center">
                Speak naturally — the agent hears you and responds in real time.
              </p>
            </motion.div>
          )}

          {/* ── Ended: CTAs ── */}
          {state === 'ended' && (
            <motion.div
              key="ended"
              className="text-center max-w-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/20 flex items-center justify-center">
                <CalendarCheck className="w-7 h-7 text-[#d4a843]" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight mb-3">
                That was a live AI agent.
              </h2>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Imagine that on your website, 24/7 — greeting every visitor, qualifying leads, and booking appointments automatically.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/book-demo"
                  className="bg-[#d4a843] hover:bg-[#c49a3a] text-black font-semibold py-4 px-8 rounded-2xl inline-flex items-center gap-2 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(212,168,67,0.25)] hover:-translate-y-0.5"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book a Strategy Call
                </Link>
                <button
                  onClick={() => {
                    setConversationUrl(null);
                    setState('idle');
                  }}
                  className="text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 font-medium py-4 px-6 rounded-2xl transition-all duration-300 inline-flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Try Again
                </button>
              </div>

              <p className="mt-8 text-zinc-700 text-xs">
                Want this for your business?{' '}
                <Link to="/" className="text-zinc-500 hover:text-zinc-400 transition-colors underline">
                  Learn more at voxaris.io
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-zinc-800/40 text-center">
        <p className="text-zinc-700 text-xs">
          Powered by <span className="text-zinc-500">Voxaris AI</span> &bull;{' '}
          <Link to="/" className="text-zinc-500 hover:text-zinc-400 transition-colors">
            voxaris.io
          </Link>
        </p>
      </footer>
    </div>
  );
}
