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

// Gradient avatar placeholder — used when /buyback-agent-avatar.png is missing
function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className="absolute inset-0 flex items-end justify-center"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #1a2a3a 0%, #0a0f14 100%)' }}
    >
      {/* Subtle ambient glow behind avatar */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #4A9EFF 0%, transparent 70%)' }}
      />
      {/* Avatar circle */}
      <div
        className="relative mb-32 flex flex-col items-center gap-4"
      >
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-semibold text-white/90"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)',
            boxShadow: '0 0 0 3px rgba(74,158,255,0.25), 0 0 0 6px rgba(74,158,255,0.10)',
          }}
        >
          {initials}
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs text-white/50"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}
        >
          AI Agent
        </div>
      </div>
    </div>
  );
}

export function BuybackPostcardDemo() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<PageState>('idle');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  const firstName = searchParams.get('fn') || DEMO_DEFAULTS.firstName;
  const lastName = searchParams.get('ln') || DEMO_DEFAULTS.lastName;
  const vehicle = searchParams.get('v') || DEMO_DEFAULTS.vehicle;
  const campaignType = searchParams.get('ct') || DEMO_DEFAULTS.campaignType;
  const recordId = searchParams.get('rid') || DEMO_DEFAULTS.recordId;
  const phone = searchParams.get('ph') || '';
  const email = searchParams.get('em') || '';

  // Preload avatar image so we know whether to show it or the placeholder
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAvatarLoaded(true);
    img.onerror = () => setAvatarLoaded(false);
    img.src = '/buyback-agent-avatar.png';
  }, []);

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
      className="fixed inset-0 overflow-hidden select-none"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#000' }}
    >
      <Helmet>
        <title>Talking Postcard — {DEALERSHIP.name} | Voxaris AI</title>
        <meta name="description" content={`Your personalized AI video message from ${DEALERSHIP.name}.`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
      </Helmet>

      <AnimatePresence mode="wait">

        {/* ────────────────────────────────────────────────────
            IDLE — FaceTime incoming call style
        ──────────────────────────────────────────────────── */}
        {state === 'idle' && (
          <motion.div
            key="idle"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35 }}
          >
            {/* Background — photo or gradient placeholder */}
            {avatarLoaded ? (
              <img
                src="/buyback-agent-avatar.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <AvatarPlaceholder name={DEALERSHIP.agentName} />
            )}

            {/* Gradient scrim — heavier at top and bottom for readability */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.70) 100%)'
            }} />

            {/* ── Top bar ── */}
            <div
              className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3"
              style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
            >
              {/* Voxaris wordmark — faint, not the hero */}
              <img
                src="/voxaris-logo-white.png"
                alt="Voxaris"
                className="h-4"
                style={{ opacity: 0.4 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              {/* Video message badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] text-white/70 font-medium"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)' }}
              >
                <span className="w-1.5 h-1.5 bg-[#34C759] rounded-full" />
                Video Message
              </div>
            </div>

            {/* ── Bottom overlay — caller info + buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 left-0 right-0 z-10"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 36px)' }}
            >
              <div className="px-8 pb-2">

                {/* Caller info */}
                <div className="text-center mb-8">
                  <p className="text-xs text-white/45 uppercase tracking-[0.18em] mb-2">
                    {DEALERSHIP.name}
                  </p>
                  <h1 className="text-[28px] font-semibold tracking-tight text-white mb-2">
                    {DEALERSHIP.agentName}
                  </h1>
                  <p className="text-sm text-white/55 leading-relaxed">
                    Calling about your
                    <span className="text-white/80 font-medium"> {vehicle}</span>
                  </p>
                </div>

                {/* Buttons — FaceTime layout */}
                <div className="flex items-end justify-center gap-20">

                  {/* Decline / Call Instead */}
                  <div className="flex flex-col items-center gap-2.5">
                    <a
                      href={`tel:${DEALERSHIP.phone}`}
                      className="w-[72px] h-[72px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
                      style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)' }}
                    >
                      <PhoneOff className="w-7 h-7 text-white/80" />
                    </a>
                    <span className="text-[12px] text-white/40 font-medium">Call Instead</span>
                  </div>

                  {/* Accept */}
                  <div className="flex flex-col items-center gap-2.5">
                    <button
                      onClick={startConversation}
                      className="w-[72px] h-[72px] rounded-full flex items-center justify-center active:scale-95 transition-transform relative"
                      style={{
                        background: '#34C759',
                        boxShadow: '0 0 0 0 rgba(52,199,89,0.5)',
                        animation: 'pulse-ring 2s ease-out infinite',
                      }}
                    >
                      <Phone className="w-7 h-7 text-white" />
                    </button>
                    <span className="text-[12px] text-white/40 font-medium">Accept</span>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Pulse ring keyframe */}
            <style>{`
              @keyframes pulse-ring {
                0%   { box-shadow: 0 0 0 0px rgba(52,199,89,0.45); }
                70%  { box-shadow: 0 0 0 18px rgba(52,199,89,0); }
                100% { box-shadow: 0 0 0 0px rgba(52,199,89,0); }
              }
            `}</style>
          </motion.div>
        )}

        {/* ────────────────────────────────────────────────────
            LOADING — frosted glass connecting screen
        ──────────────────────────────────────────────────── */}
        {state === 'loading' && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: '#000' }}
          >
            {/* Dim avatar in background */}
            {avatarLoaded && (
              <img
                src="/buyback-agent-avatar.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.15, filter: 'blur(8px)' }}
              />
            )}

            <div className="relative z-10 flex flex-col items-center gap-5">
              {/* Animated connecting indicator */}
              <div className="relative w-20 h-20">
                <div
                  className="absolute inset-0 rounded-full border-2 border-white/10"
                  style={{ animation: 'spin 1.4s linear infinite',
                    borderTopColor: 'rgba(255,255,255,0.7)',
                    borderRadius: '50%' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <Phone className="w-5 h-5 text-white/60" />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white text-base font-medium mb-1">Connecting to {DEALERSHIP.agentName}</p>
                <p className="text-white/40 text-sm">{DEALERSHIP.name}</p>
              </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        )}

        {/* ────────────────────────────────────────────────────
            LIVE — full-screen video call
        ──────────────────────────────────────────────────── */}
        {state === 'live' && conversationUrl && (
          <motion.div
            key="live"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            <CVIProvider>
              <Conversation
                conversationUrl={conversationUrl}
                conversationId={conversationId || undefined}
                webhookType="buyback"
                dealershipName={DEALERSHIP.name}
                agentName={DEALERSHIP.agentName}
                onLeave={handleEnd}
                className="w-full h-full"
              />
            </CVIProvider>
          </motion.div>
        )}

        {/* ────────────────────────────────────────────────────
            ENDED — appointment confirmation screen
        ──────────────────────────────────────────────────── */}
        {state === 'ended' && (
          <motion.div
            key="ended"
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'linear-gradient(160deg, #0d1117 0%, #111820 100%)' }}
          >
            {/* Subtle green ambient glow — appointment booked energy */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, #34C759 0%, transparent 70%)' }}
            />

            <div
              className="relative z-10 flex flex-col items-center gap-5 px-8 max-w-sm w-full text-center"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 32px)' }}
            >
              {/* Check circle */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(52,199,89,0.12)', border: '1.5px solid rgba(52,199,89,0.3)' }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M9 18.5L15 24.5L27 12" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {firstName}, you're all set.
                </h2>
                <p className="text-sm text-white/45 leading-relaxed">
                  {DEALERSHIP.name} will be in touch to confirm your VIP appraisal appointment.
                </p>
              </motion.div>

              {/* Vehicle chip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="px-4 py-2 rounded-full text-sm text-white/60"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {vehicle}
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col gap-3 w-full mt-2"
              >
                <a
                  href={`tel:${DEALERSHIP.phone}`}
                  className="w-full py-4 rounded-2xl text-center text-white text-sm font-semibold active:scale-[0.98] transition-all"
                  style={{ background: '#34C759' }}
                >
                  Call {DEALERSHIP.name}
                </a>
                <button
                  onClick={() => setState('idle')}
                  className="w-full py-4 rounded-2xl text-white/55 text-sm font-medium active:scale-[0.98] transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Watch again
                </button>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-[11px] mt-2"
                style={{ color: 'rgba(255,255,255,0.18)' }}
              >
                Powered by Voxaris AI
              </motion.p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
