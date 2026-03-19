import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  MapPin,
  Clock,
  Shield,
  Star,
  Sparkles,
  CheckCircle,
  CalendarCheck,
  RotateCcw,
  Car,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { CVIProvider, Conversation } from '@/components/cvi';

type PageState = 'idle' | 'loading' | 'live' | 'ended';

// Demo PURL defaults — simulates "John" scanning his buyback postcard
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
  agentRole: 'VIP Acquisition Specialist',
  address: '7820 International Drive, Orlando, FL 32819',
  phone: '(407) 555-0193',
  hours: {
    weekday: 'Mon-Sat 9AM-8PM',
    saturday: 'Sat 9AM-8PM',
    sunday: 'Sun 11AM-6PM',
  },
};

const VALUE_PROPS = [
  {
    title: 'Above-Market Value',
    description: 'Your vehicle is in high demand. We offer $2,000-$4,000 above standard book value.',
    icon: DollarSign,
  },
  {
    title: '15-Minute Appraisal',
    description: 'Quick, no-obligation VIP appraisal. Know what your vehicle is worth.',
    icon: Clock,
  },
  {
    title: 'Trade Up or Cash Out',
    description: 'Upgrade to a newer model or cash out your equity. Your choice.',
    icon: TrendingUp,
  },
];

export function BuybackPostcardDemo() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<PageState>('idle');
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);

  // Parse PURL params or use demo defaults
  const firstName = searchParams.get('fn') || DEMO_DEFAULTS.firstName;
  const lastName = searchParams.get('ln') || DEMO_DEFAULTS.lastName;
  const vehicle = searchParams.get('v') || DEMO_DEFAULTS.vehicle;
  const campaignType = searchParams.get('ct') || DEMO_DEFAULTS.campaignType;
  const recordId = searchParams.get('rid') || DEMO_DEFAULTS.recordId;
  const phone = searchParams.get('ph') || '';
  const email = searchParams.get('em') || '';

  const startConversation = useCallback(async () => {
    setState('loading');

    try {
      const res = await fetch('/api/voxaris/tavus/buyback-postcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          vehicle,
          campaignType,
          recordId,
          phone,
          email,
        }),
      });

      if (!res.ok) throw new Error('Failed to create session');

      const data = await res.json();
      if (data.success && data.conversation_url) {
        setConversationUrl(data.conversation_url);
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
      className="min-h-screen min-h-[100dvh] bg-[#07080a] text-white"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <Helmet>
        <title>Buyback Campaign Demo — Talking Postcards | Voxaris</title>
        <meta name="description" content="See how a Talking Postcard buyback campaign works. AI video agent greets customers by name, discusses their vehicle's trade-in value, and books VIP appraisals." />
        <link rel="canonical" href="https://voxaris.io/talking-postcard/buyback" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:title" content="Buyback Campaign Demo — Talking Postcards | Voxaris" />
        <meta property="og:description" content="AI video agent for vehicle buyback campaigns. Watch the demo." />
        <meta property="og:url" content="https://voxaris.io/talking-postcard/buyback" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://voxaris.io/og-image.png" />
      </Helmet>

      {/* ── Nav — compact on mobile, safe-area aware ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07080a]/90 backdrop-blur-md border-b border-white/5"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/voxaris-logo-white.png"
                alt="Voxaris"
                className="h-4 sm:h-5 w-auto opacity-40"
              />
            </Link>
            <div className="w-px h-4 bg-white/10 shrink-0" />
            <div className="flex items-center gap-1.5 min-w-0">
              <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-white/40 text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">
                Buyback Demo
              </span>
            </div>
          </div>
          <a
            href={`tel:${DEALERSHIP.phone}`}
            className="flex items-center gap-1.5 text-sm text-amber-400/80 hover:text-amber-400 transition-colors shrink-0 active:scale-95 touch-manipulation"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">{DEALERSHIP.phone}</span>
          </a>
        </div>
      </nav>

      {/* ── Main — mobile-first padding ── */}
      <main
        className="pt-[calc(3.5rem+env(safe-area-inset-top,0px))] pb-6 sm:pb-16"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <AnimatePresence mode="wait">

            {/* ═══════════════════════════════════════
                IDLE STATE — Pre-conversation landing
               ═══════════════════════════════════════ */}
            {state === 'idle' && (
              <motion.div
                key="idle"
                className="text-center space-y-6 sm:space-y-8 pt-4 sm:pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Dealership badge */}
                <div>
                  <span className="inline-flex items-center gap-2 sm:gap-3 bg-white/[0.03] border border-white/[0.06] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400/60 opacity-60" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                    </span>
                    <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-[11px] font-semibold text-white/40">
                      {DEALERSHIP.name} &bull; VIP Offer
                    </span>
                  </span>
                </div>

                {/* Personalized headline — smaller on mobile */}
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                    {firstName},<br />
                    <span className="text-amber-400">your {vehicle}</span><br />
                    <span className="text-white/40">is worth more than you think.</span>
                  </h1>
                  <p className="text-base sm:text-lg text-white/50 max-w-md mx-auto leading-relaxed px-2">
                    {DEALERSHIP.agentName} has a personalized update about your vehicle's trade-in value. Tap below to hear it.
                  </p>
                </div>

                {/* Agent preview — compact on mobile */}
                <div className="relative max-w-[280px] sm:max-w-sm mx-auto">
                  <div className="aspect-[4/3] sm:aspect-video rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                    <div className="text-center space-y-2.5">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{DEALERSHIP.agentName}</p>
                        <p className="text-[11px] sm:text-xs text-white/40">{DEALERSHIP.agentRole}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full font-medium whitespace-nowrap">
                    Online now
                  </div>
                </div>

                {/* CTA — full width on mobile for easy thumb tap */}
                <div className="px-2 sm:px-0">
                  <button
                    onClick={startConversation}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 sm:py-4 bg-amber-400 text-black font-semibold rounded-2xl sm:rounded-full hover:bg-amber-300 active:scale-[0.98] transition-all text-base sm:text-lg shadow-lg shadow-amber-400/20 touch-manipulation"
                  >
                    Start Conversation
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Trust signals — stacked tighter on mobile */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/30">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Private & secure
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 2-3 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> No obligation
                  </span>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════
                LOADING STATE
               ═══════════════════════════ */}
            {state === 'loading' && (
              <motion.div
                key="loading"
                className="text-center space-y-6 py-16 sm:py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <div>
                  <p className="text-base sm:text-lg font-medium">
                    Connecting you with {DEALERSHIP.agentName}...
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    This will just take a moment
                  </p>
                </div>
              </motion.div>
            )}

            {/* ═══════════════════════════════════
                LIVE STATE — Video conversation
                Mobile: taller aspect ratio, fills screen
               ═══════════════════════════════════ */}
            {state === 'live' && conversationUrl && (
              <motion.div
                key="live"
                className="space-y-3 sm:space-y-4 -mx-4 sm:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Live indicator + end button */}
                <div className="flex items-center justify-between px-4 sm:px-0">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] sm:text-xs text-red-400 uppercase tracking-wider font-semibold">
                      Live
                    </span>
                  </div>
                  <button
                    onClick={handleEnd}
                    className="text-xs text-white/30 hover:text-white/60 active:text-white/80 transition-colors py-2 px-3 -mr-3 touch-manipulation"
                  >
                    End conversation
                  </button>
                </div>

                {/* Video embed — 4:3 on mobile (taller), 16:9 on desktop */}
                <div
                  className="w-full rounded-none sm:rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/60 sm:border sm:border-white/5"
                  style={{ aspectRatio: 'auto' }}
                >
                  <div className="aspect-[3/4] sm:aspect-video w-full">
                    <CVIProvider>
                      <Conversation
                        conversationUrl={conversationUrl}
                        onLeave={handleEnd}
                        className="w-full h-full"
                      />
                    </CVIProvider>
                  </div>
                </div>

                <p className="text-white/30 text-[10px] sm:text-xs text-center px-4 sm:px-0">
                  Speak naturally — {DEALERSHIP.agentName} hears you and responds in real time.
                </p>
              </motion.div>
            )}

            {/* ═══════════════════════════
                ENDED STATE
               ═══════════════════════════ */}
            {state === 'ended' && (
              <motion.div
                key="ended"
                className="text-center space-y-6 sm:space-y-8 py-8 sm:py-12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                </div>
                <div className="space-y-3 px-2">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    That was your AI buyback agent.
                  </h2>
                  <p className="text-sm sm:text-base text-white/50 max-w-md mx-auto leading-relaxed">
                    Imagine that running 24/7 for every customer who scans their postcard.
                    No missed leads. Booked appraisals — automatically.
                  </p>
                </div>

                {/* CTAs — full width stacked on mobile */}
                <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-center gap-3 px-2 sm:px-0">
                  <Link
                    to="/book-demo"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-black font-semibold rounded-2xl sm:rounded-full hover:bg-amber-300 active:scale-[0.98] transition-all touch-manipulation"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Get This for Your Dealership
                  </Link>
                  <button
                    onClick={() => setState('idle')}
                    className="inline-flex items-center justify-center gap-2 text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 font-medium py-4 px-6 rounded-2xl sm:rounded-full transition-all touch-manipulation active:scale-[0.98]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>

                <p className="text-white/20 text-[10px] sm:text-xs">
                  Powered by <Link to="/" className="text-white/30 hover:text-white/50 transition-colors">Voxaris AI</Link> &bull; Talking Postcards
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Value Props (idle/ended only) ── */}
        {(state === 'idle' || state === 'ended') && (
          <motion.section
            className="max-w-4xl mx-auto px-4 sm:px-6 mt-12 sm:mt-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {VALUE_PROPS.map((vp) => (
                <div
                  key={vp.title}
                  className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <vp.icon className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 mb-2.5 sm:mb-3" />
                  <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{vp.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{vp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Dealership Info (idle/ended only) ── */}
        {(state === 'idle' || state === 'ended') && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 sm:mt-16">
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-base sm:text-lg font-semibold mb-2">{DEALERSHIP.name}</h3>
              <div className="space-y-1.5 text-sm text-white/40">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(DEALERSHIP.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white/60 active:text-white/70 transition-colors touch-manipulation"
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="underline underline-offset-2 decoration-white/10">{DEALERSHIP.address}</span>
                </a>
                <a
                  href={`tel:${DEALERSHIP.phone}`}
                  className="flex items-center gap-2 hover:text-white/60 active:text-white/70 transition-colors touch-manipulation"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="underline underline-offset-2 decoration-white/10">{DEALERSHIP.phone}</span>
                </a>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  {DEALERSHIP.hours.weekday} | {DEALERSHIP.hours.sunday}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Demo context banner (idle only) ── */}
        {state === 'idle' && (
          <motion.section
            className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-400/5 border border-amber-400/10 text-center">
              <p className="text-[10px] sm:text-xs text-amber-400/60 uppercase tracking-wider font-semibold mb-1.5 sm:mb-2">
                You are viewing a demo
              </p>
              <p className="text-xs sm:text-sm text-white/40 leading-relaxed max-w-lg mx-auto">
                This is what a customer sees after scanning the QR code on their buyback postcard.
                The AI agent knows their name, vehicle, and why they are receiving the offer.
              </p>
              <Link
                to="/talking-postcard"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-400 mt-2.5 sm:mt-3 transition-colors touch-manipulation py-1"
              >
                Learn more about Talking Postcards
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.section>
        )}
      </main>

      {/* ── Footer — safe area padding ── */}
      <footer
        className="border-t border-white/5 py-4 sm:py-6"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <span className="text-white/20 text-[10px] sm:text-xs">Powered by Voxaris AI</span>
          <div className="flex items-center gap-5 sm:gap-6">
            <Link to="/" className="text-white/20 hover:text-white/40 text-[10px] sm:text-xs transition-colors touch-manipulation py-1">Home</Link>
            <Link to="/talking-postcard" className="text-white/20 hover:text-white/40 text-[10px] sm:text-xs transition-colors touch-manipulation py-1">Talking Postcards</Link>
            <Link to="/book-demo" className="text-white/20 hover:text-white/40 text-[10px] sm:text-xs transition-colors touch-manipulation py-1">Book Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
