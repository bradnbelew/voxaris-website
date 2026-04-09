import { useEffect, useCallback, useState, useRef } from 'react';
import {
  useDaily,
  useLocalSessionId,
  useParticipantIds,
  useVideoTrack,
  useAudioTrack,
  useDailyEvent,
} from '@daily-co/daily-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff } from 'lucide-react';

interface ConversationProps {
  conversationUrl: string;
  conversationId?: string;
  webhookType?: 'buyback' | 'business-card' | string;
  dealershipName?: string;
  agentName?: string;
  onLeave?: () => void;
  className?: string;
}

export function Conversation({
  conversationUrl,
  conversationId,
  webhookType,
  dealershipName,
  agentName,
  onLeave,
  className,
}: ConversationProps) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });

  const [isJoining, setIsJoining] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const remoteId = remoteParticipantIds[0];
  const remoteVideoTrack = useVideoTrack(remoteId);
  const remoteAudioTrack = useAudioTrack(remoteId);
  const localVideoTrack = useVideoTrack(localSessionId);

  // Auto-hide controls after 4s of no interaction
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  useEffect(() => {
    if (isJoined) resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isJoined, resetControlsTimer]);

  // Remote video stream
  useEffect(() => {
    if (remoteVideoTrack?.track && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = new MediaStream([remoteVideoTrack.track]);
    }
  }, [remoteVideoTrack?.track]);

  // Remote audio stream
  useEffect(() => {
    if (remoteAudioTrack?.track) {
      const audio = new Audio();
      audio.srcObject = new MediaStream([remoteAudioTrack.track]);
      audio.play().catch(console.error);
      audioRef.current = audio;
      return () => {
        audio.pause();
        audio.srcObject = null;
        audioRef.current = null;
      };
    }
  }, [remoteAudioTrack?.track]);

  // Self-view stream
  useEffect(() => {
    if (localVideoTrack?.track && localVideoRef.current) {
      localVideoRef.current.srcObject = new MediaStream([localVideoTrack.track]);
    }
  }, [localVideoTrack?.track]);

  // Join the call
  useEffect(() => {
    if (!daily || !conversationUrl) return;
    const joinCall = async () => {
      try {
        setIsJoining(true);
        setError(null);
        await daily.join({ url: conversationUrl, startVideoOff: false, startAudioOff: false });
        await daily.updateInputSettings({
          audio: { processor: { type: 'noise-cancellation' } },
        });
      } catch (err) {
        console.error('Failed to join call:', err);
        setError('Failed to connect. Please try again.');
        setIsJoining(false);
      }
    };
    joinCall();
    return () => { daily.leave().catch(console.error); };
  }, [daily, conversationUrl]);

  useDailyEvent('joined-meeting', () => { setIsJoining(false); setIsJoined(true); });
  useDailyEvent('left-meeting', () => { setIsJoined(false); setIsJoining(false); onLeave?.(); });
  useDailyEvent('participant-left', (event) => {
    if (event?.participant && !event.participant.local) onLeave?.();
  });
  useDailyEvent('error', (event) => {
    console.error('Daily error:', event);
    setError('Connection error. Please try again.');
    setIsJoining(false);
  });

  // ── Tool Call Handler (Tavus Interactions Protocol) ──
  // Tavus dispatches tool calls via Daily.js data channel as 'conversation.tool_call' events.
  // We catch them here, route to our webhook, and send results back via 'conversation.tool_call_result'.
  useDailyEvent('app-message', useCallback((event: any) => {
    if (!daily || !event?.data) return;
    const msg = event.data;
    const eventType = msg.event_type || msg.type || '';
    if (eventType !== 'conversation.tool_call') return;

    const props = msg.properties || {};
    const toolName = props.name || '';
    const toolArgsRaw = props.arguments || '{}';
    const toolCallId = props.tool_call_id || msg.tool_call_id || '';
    const convId = msg.conversation_id || conversationId || '';

    console.log(`[CVI] Tool call: ${toolName}`, toolArgsRaw);

    let toolArgs: Record<string, unknown> = {};
    try { toolArgs = typeof toolArgsRaw === 'string' ? JSON.parse(toolArgsRaw) : toolArgsRaw; }
    catch { toolArgs = {}; }

    const type = webhookType || 'business-card';
    fetch(`/api/voxaris/tavus/webhook?type=${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: convId,
        tool_name: toolName,
        tool_args: toolArgs,
        tool_call_id: toolCallId,
        event_type: 'conversation.tool_call',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Extract the result — webhook returns { ok: true, result: JSON.stringify({...}) }
        let resultObj: Record<string, unknown> = {};
        try {
          resultObj = typeof data.result === 'string' ? JSON.parse(data.result) : (data.result || data);
        } catch { resultObj = data; }

        console.log(`[CVI] Tool result for ${toolName}:`, resultObj);

        // Send result back to Tavus via the Interactions Protocol
        daily.sendAppMessage({
          message_type: 'conversation',
          event_type: 'conversation.tool_call_result',
          conversation_id: convId,
          properties: {
            tool_call_id: toolCallId,
            name: toolName,
            result: JSON.stringify(resultObj),
          },
        }, '*');
      })
      .catch((err) => {
        console.error(`[CVI] Tool call failed: ${toolName}`, err);
        daily.sendAppMessage({
          message_type: 'conversation',
          event_type: 'conversation.tool_call_result',
          conversation_id: convId,
          properties: {
            tool_call_id: toolCallId,
            name: toolName,
            result: JSON.stringify({ success: false, error: 'Tool execution failed' }),
          },
        }, '*');
      });
  }, [daily, conversationId, webhookType]));

  const handleLeave = useCallback(async () => {
    if (daily) { await daily.leave(); onLeave?.(); }
  }, [daily, onLeave]);

  const toggleMic = useCallback(() => {
    if (daily) { daily.setLocalAudio(isMicMuted); setIsMicMuted(!isMicMuted); }
  }, [daily, isMicMuted]);

  return (
    <div
      className={cn('relative w-full h-full overflow-hidden', className)}
      style={{ background: '#000' }}
      onClick={isJoined ? resetControlsTimer : undefined}
    >
      {/* ── Remote video (AI agent — zoomed out slightly to show more of the frame) ── */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
        style={{ background: '#000' }}
      />

      {/* ── Self-view — bottom-right, above controls, mirrored ── */}
      {isJoined && localVideoTrack?.track && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.35 }}
          className="absolute bottom-28 right-4 w-[100px] h-[140px] rounded-2xl overflow-hidden z-20"
          style={{
            boxShadow: '0 2px 16px rgba(0,0,0,0.6)',
            border: '1.5px solid rgba(255,255,255,0.15)',
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        </motion.div>
      )}

      {/* ── Connecting overlay ── */}
      <AnimatePresence>
        {isJoining && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            style={{ background: '#000' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-12 h-12 rounded-full"
                style={{
                  border: '2px solid rgba(255,255,255,0.12)',
                  borderTopColor: 'rgba(255,255,255,0.8)',
                  animation: 'cvi-spin 1s linear infinite',
                }}
              />
              <div className="text-center">
                <p className="text-white/80 text-sm font-medium">Connecting...</p>
                {agentName && <p className="text-white/35 text-xs mt-0.5">{agentName} · {dealershipName}</p>}
              </div>
            </div>
            <style>{`@keyframes cvi-spin { to { transform: rotate(360deg); } }`}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error overlay ── */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30" style={{ background: 'rgba(0,0,0,0.85)' }}>
          <p className="text-white/60 text-sm mb-5 text-center px-8">{error}</p>
          <button
            onClick={handleLeave}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium active:scale-95 transition-all"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            Go back
          </button>
        </div>
      )}

      {/* ── Top bar — dealership name + connection indicator ── */}
      {isJoined && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              key="topbar"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3"
              style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 14px)' }}
            >
              <div className="text-left">
                {agentName && <p className="text-white text-sm font-semibold leading-tight">{agentName}</p>}
                {dealershipName && <p className="text-white/40 text-[11px]">{dealershipName}</p>}
              </div>
              {/* Connection quality dot */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-white/50"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                Live
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Bottom controls — mic + end call only ── */}
      {isJoined && !error && (
        <AnimatePresence>
          {showControls && (
            <motion.div
              key="controls"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.22 }}
              className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-5 pb-6"
              style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 28px)' }}
            >
              {/* Mic toggle */}
              <button
                onClick={() => { toggleMic(); resetControlsTimer(); }}
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-all',
                  isMicMuted
                    ? 'bg-white/90'
                    : 'bg-white/15'
                )}
                style={{ backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)' }}
                aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMicMuted
                  ? <MicOff className="w-5 h-5 text-black" />
                  : <Mic className="w-5 h-5 text-white" />}
              </button>

              {/* End call — larger, centered, red */}
              <button
                onClick={handleLeave}
                className="w-[68px] h-[68px] rounded-full flex items-center justify-center active:scale-95 transition-all"
                style={{ background: '#FF3B30', boxShadow: '0 4px 20px rgba(255,59,48,0.35)' }}
                aria-label="End call"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
