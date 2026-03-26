import { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Phone, PhoneOff } from 'lucide-react';
import { CVIProvider, Conversation } from '@/components/cvi';

type PageState = 'idle' | 'loading' | 'live' | 'ended';

const DEMO_DEFAULTS = {
  firstName: 'John',
  lastName: 'Mitchell',
  vehicle: '2021 Toyota Camry',
  campaignType: 'buyback',
  recordId: 'DEMO-001',
};

const DEALERSHIP = {
  name: 'Orlando Motors',
  agentName: 'Maria',
  phone: '(407) 555-0193',
};

export function BuybackPostcardDemo() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<PageState>('idle');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  const firstName = searchParams.get('fn') || DEMO_DEFAULTS.firstName;
  const lastName = searchParams.get('ln') || DEMO_DEFAULTS.lastName;
  const vehicle = searchParams.get('v') || DEMO_DEFAULTS.vehicle;
  const campaignType = searchParams.get('ct') || DEMO_DEFAULTS.campaignType;
  const recordId = searchParams.get('rid') || DEMO_DEFAULTS.recordId;
  const phone = searchParams.get('ph') || '';
  const email = searchParams.get('em') || '';

  // Auto-hide controls overlay after 4s on idle screen
  useEffect(() => {
    if (state !== 'idle') return;
    setShowControls(true);
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [state]);

  const startConversation = useCallback(async () => {
    setState('loading');
    try {
      const res = await fetch('/api/voxaris/tavus/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'buyback', firstName, lastName, vehicle, campaignType, recordId, phone, email }),
      });
      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();
      if (data.success && data.conversation_url) {
        setConversationUrl(data.conversation_url);
        setConversationId(data.conversation_id || null);
        setState('live');
      } else {
        throw new Error(data.error || 'Could not start conversation');
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setState('idle');
    }
  }, [firstName, lastName, vehicle, campaignType, recordId, phone, email]);

  const handleEnd = useCallback(() => {
    setConversationUrl(null);
    setState('ended');
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black text-white overflow-hidden select-none"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <Helmet>
        <title>Talking Postcard — {DEALERSHIP.name} | Voxaris AI</title>
        <meta name="description" content="Your personalized AI video message from Orlando Motors." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </Helmet>

      <AnimatePresence mode="wait">

        {/* ── IDLE: Full-screen video preview with FaceTime overlay ── */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowControls(true)}
          >
            {/* Full-screen still photo — like FaceTime incoming call */}
            <img
              src="/julia-avatar-still.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Subtle gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            {/* Top bar — FaceTime style */}
            <div
              className="absolute top-0 left-0 right-0 z-10"
              style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
            >
              <div className="flex items-center justify-between px-5 py-3">
                <img
                  src="/voxaris-logo-white.png"
                  alt="Voxaris AI"
                  className="h-4 opacity-50"
                />
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#34C759] rounded-full" />
                  <span className="text-[10px] text-white/70 font-medium">Video Message</span>
                </div>
              </div>
            </div>

            {/* Bottom overlay — caller info + answer button */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 right-0 z-10"
                  style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 24px)' }}
                >
                  <div className="px-6 pb-4">
                    {/* Caller info */}
                    <div className="text-center mb-6">
                      <p className="text-xs text-white/50 uppercase tracking-[0.2em] mb-1">
                        {DEALERSHIP.name}
                      </p>
                      <h1 className="text-xl font-semibold mb-1">
                        {DEALERSHIP.agentName}
                      </h1>
                      <p className="text-sm text-white/60">
                        has a message about your {vehicle}
                      </p>
                    </div>

                    {/* Answer / Decline buttons — FaceTime layout */}
                    <div className="flex items-center justify-center gap-16">
                      {/* Decline */}
                      <div className="flex flex-col items-center gap-2">
                        <a
                          href={`tel:${DEALERSHIP.phone}`}
                          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-95 transition-transform"
                        >
                          <PhoneOff className="w-7 h-7 text-white/70" />
                        </a>
                        <span className="text-[11px] text-white/40">Call Instead</span>
                      </div>

                      {/* Answer */}
                      <div className="flex flex-col items-center gap-2">
                        <button
                          onClick={startConversation}
                          className="w-16 h-16 rounded-full bg-[#34C759] flex items-center justify-center active:scale-95 transition-transform shadow-lg shadow-[#34C759]/30 animate-pulse"
                        >
                          <Phone className="w-7 h-7 text-white" />
                        </button>
                        <span className="text-[11px] text-white/40">Accept</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tap to show controls hint (when hidden) */}
            {!showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-8 left-0 right-0 text-center z-10"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
              >
                <p className="text-xs text-white/30">Tap to answer</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Still image as background while connecting */}
            <img
              src="/julia-avatar-still.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mb-6" />
              <p className="text-white/60 text-base">Connecting...</p>
            </div>
          </motion.div>
        )}

        {/* ── LIVE: Full-screen video call ── */}
        {state === 'live' && conversationUrl && (
          <motion.div
            key="live"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CVIProvider>
              <Conversation
                conversationUrl={conversationUrl}
                conversationId={conversationId || undefined}
                webhookType="buyback"
                onLeave={handleEnd}
                className="w-full h-full"
              />
            </CVIProvider>
          </motion.div>
        )}

        {/* ── ENDED ── */}
        {state === 'ended' && (
          <motion.div
            key="ended"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-sm w-full text-center">
              <img
                src="/voxaris-logo-white.png"
                alt="Voxaris AI"
                className="h-5 opacity-30"
              />

              <div className="space-y-3">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Call ended
                </h2>
                <p className="text-sm text-white/50 leading-relaxed">
                  Ready to learn what your {vehicle} is worth?
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full mt-2">
                <a
                  href={`tel:${DEALERSHIP.phone}`}
                  className="w-full py-3.5 bg-[#34C759] text-white font-semibold rounded-2xl text-center active:scale-[0.98] transition-all"
                >
                  Call {DEALERSHIP.name}
                </a>
                <button
                  onClick={() => setState('idle')}
                  className="w-full py-3.5 bg-white/10 text-white/70 font-medium rounded-2xl active:scale-[0.98] transition-all"
                >
                  Watch again
                </button>
              </div>

              <p className="text-[10px] text-white/20 mt-4">
                Powered by Voxaris AI
              </p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
