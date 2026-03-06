import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

const MARIA_VIDEO = "https://cdn.replica.tavus.io/40242/2fe8396c.mp4";
// Poll our own API for tool call actions (no separate orchestrator needed)
const EXECUTE_API = "/api/voxaris/tavus/execute";

type SessionState = 'idle' | 'loading' | 'active' | 'error';

// ── Vox DOM Engine: executes actions queued by Tavus tool calls ──
function executeVoxAction(action: { action: string; selector?: string; section?: string; feature?: string; route?: string; value?: string }) {
  console.log('[Vox]', action.action, action);

  switch (action.action) {
    case 'scroll_to_section': {
      const selectors = (action.selector || '').split(',');
      for (const sel of selectors) {
        const el = document.querySelector(sel.trim());
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('vox-highlight');
          setTimeout(() => el.classList.remove('vox-highlight'), 2500);
          break;
        }
      }
      break;
    }
    case 'highlight_feature': {
      let target: Element | null = document.querySelector(`[data-feature="${action.feature}"]`);
      if (!target) {
        const featureLower = (action.feature || '').toLowerCase();
        const cards = document.querySelectorAll('[data-feature], [class*="card"]');
        for (const card of cards) {
          if (card.textContent?.toLowerCase().includes(featureLower)) {
            target = card;
            break;
          }
        }
      }
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (target as HTMLElement).style.transition = 'all .4s ease-out';
        (target as HTMLElement).style.boxShadow = '0 0 40px rgba(148,163,184,.15), 0 0 0 2px rgba(148,163,184,.2)';
        (target as HTMLElement).style.transform = 'scale(1.02)';
        setTimeout(() => {
          (target as HTMLElement).style.boxShadow = '';
          (target as HTMLElement).style.transform = '';
        }, 3000);
      }
      break;
    }
    case 'click_element': {
      const el = document.querySelector(action.selector || '');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => (el as HTMLElement).click(), 500);
      }
      break;
    }
    case 'fill_field': {
      const input = document.querySelector(action.selector || '') as HTMLInputElement | null;
      if (input) {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          input.focus();
          input.value = action.value || '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }, 500);
      }
      break;
    }
    case 'select_option': {
      const select = document.querySelector(action.selector || '') as HTMLSelectElement | null;
      if (select) {
        select.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          select.value = action.value || '';
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }, 500);
      }
      break;
    }
    case 'navigate_to_page': {
      if (action.route) window.location.href = action.route;
      break;
    }
  }
}

export function FloatingMaria() {
  const [open, setOpen] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Poll orchestrator for DOM actions when session is active ──
  useEffect(() => {
    if (sessionState !== 'active' || !conversationIdRef.current) {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
      return;
    }

    const cid = conversationIdRef.current;
    const pollUrl = `${EXECUTE_API}?cid=${encodeURIComponent(cid)}`;

    pollTimerRef.current = setInterval(() => {
      fetch(pollUrl)
        .then(r => r.json())
        .then(data => {
          if (data.actions?.length) {
            for (const action of data.actions) {
              executeVoxAction(action);
            }
          }
        })
        .catch(() => {});
    }, 400);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [sessionState]);

  const startSession = useCallback(async () => {
    setOpen(true);
    setSessionState('loading');
    try {
      const res = await fetch('/api/voxaris/tavus/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      conversationIdRef.current = data.conversation_id;
      setConversationUrl(data.conversation_url);
      setSessionState('active');
    } catch {
      setSessionState('error');
    }
  }, []);

  const closeSession = useCallback(() => {
    setOpen(false);
    setSessionState('idle');
    setConversationUrl(null);
    conversationIdRef.current = null;
  }, []);

  return (
    <>
      {/* Vox highlight animation */}
      <style>{`
        .vox-highlight {
          animation: vox-glow 2s ease-out forwards;
        }
        @keyframes vox-glow {
          0% { box-shadow: 0 0 0 3px rgba(148,163,184,0.4); }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
      `}</style>

      {/* Floating bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            onClick={startSession}
            className="fixed bottom-6 right-6 z-50 group"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 2 }}
          >
            <span className="absolute inset-0 rounded-full animate-ping bg-slate-400/20" style={{ animationDuration: '3s' }} />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-slate-200/40 to-transparent group-hover:from-slate-200/60 transition-all duration-500" />

            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-[3px] ring-white group-hover:ring-slate-100 transition-all duration-300 group-hover:scale-105">
              <video src={MARIA_VIDEO} className="w-full h-full object-cover" autoPlay loop muted playsInline />
            </div>

            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
            </span>

            <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-slate-900 text-white text-[11px] font-medium px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
                Talk to Maria
                <div className="absolute top-full right-6 w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-[340px] sm:w-[380px]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200/80 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-100">
                    <video src={MARIA_VIDEO} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-slate-900">Maria</div>
                    <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {sessionState === 'active' ? 'Connected' : sessionState === 'loading' ? 'Connecting...' : 'Online now'}
                    </div>
                  </div>
                </div>
                <button onClick={closeSession} className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-colors">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Video / iframe area */}
              <div className="aspect-[4/3] bg-slate-900 relative">
                {sessionState === 'active' && conversationUrl ? (
                  <iframe src={conversationUrl} className="w-full h-full border-0" allow="camera;microphone;autoplay;display-capture" />
                ) : (
                  <>
                    <video src={MARIA_VIDEO} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent" />

                    {sessionState === 'loading' && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                        <span className="text-white text-[12px] font-medium">Starting conversation...</span>
                      </div>
                    )}

                    {sessionState === 'error' && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 px-6">
                        <span className="text-white text-[13px] font-medium text-center">Couldn't connect right now.</span>
                        <button onClick={startSession} className="bg-white text-slate-900 text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                          Try Again
                        </button>
                      </div>
                    )}
                  </>
                )}

                {sessionState === 'idle' && (
                  <div className="absolute bottom-3 left-3 text-white text-[10px] font-medium flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    V·TEAMS Preview
                  </div>
                )}
              </div>

              {/* Message area — only show when not in active session */}
              {sessionState !== 'active' && (
                <div className="p-5">
                  <p className="text-[13px] text-slate-600 leading-relaxed mb-4">
                    Hi! I'm Maria, part of your V·TEAMS squad. I handle the first conversation, qualify your lead, and warm-transfer to a specialist when needed.
                  </p>
                  <a href="/book-demo" className="block w-full text-center bg-slate-900 hover:bg-black text-white text-[13px] font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg">
                    Book a Personalized Demo
                  </a>
                  <a href="tel:+14077594100" className="block w-full text-center text-slate-500 hover:text-slate-700 text-[12px] font-medium py-2.5 mt-2 transition-colors">
                    Or call (407) 759-4100
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
