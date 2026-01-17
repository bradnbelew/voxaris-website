import { useEffect, useRef, useCallback, useState } from 'react';
import DailyIframe, { DailyCall, DailyEventObjectTrack } from '@daily-co/daily-js';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Loader2 } from 'lucide-react';
import type { ConversationProps } from './types';

export function Conversation({ conversationUrl, onLeave, className }: ConversationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const callRef = useRef<DailyCall | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeave = useCallback(async () => {
    if (callRef.current) {
      await callRef.current.leave();
      callRef.current.destroy();
      callRef.current = null;
      setIsJoined(false);
      onLeave?.();
    }
  }, [onLeave]);

  const toggleMute = useCallback(() => {
    if (callRef.current) {
      callRef.current.setLocalAudio(isMuted); // Toggle: if muted, unmute
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    if (!conversationUrl) return;

    const initCall = async () => {
      try {
        setIsJoining(true);
        setError(null);

        const call = DailyIframe.createCallObject({
          audioSource: true,
          videoSource: false, // We don't send video, only receive
        });

        callRef.current = call;

        call.on('joined-meeting', () => {
          setIsJoining(false);
          setIsJoined(true);
        });

        call.on('left-meeting', () => {
          setIsJoined(false);
          setIsJoining(false);
        });

        call.on('error', (event) => {
          console.error('Daily error:', event);
          setError('Connection error occurred');
          setIsJoining(false);
        });

        call.on('track-started', (event: DailyEventObjectTrack) => {
          if (event.participant?.local) return;
          
          const track = event.track;
          if (track?.kind === 'video' && videoRef.current) {
            const stream = new MediaStream([track]);
            videoRef.current.srcObject = stream;
          }
        });

        await call.join({ url: conversationUrl });

        // Enable noise cancellation
        await call.updateInputSettings({
          audio: {
            processor: {
              type: 'noise-cancellation',
            },
          },
        });

      } catch (err) {
        console.error('Failed to join call:', err);
        setError('Failed to connect to conversation');
        setIsJoining(false);
      }
    };

    initCall();

    return () => {
      if (callRef.current) {
        callRef.current.leave();
        callRef.current.destroy();
        callRef.current = null;
      }
    };
  }, [conversationUrl]);

  return (
    <div className={cn('relative w-full h-full bg-ink rounded-2xl overflow-hidden', className)}>
      {/* Video Container */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Loading State */}
      <AnimatePresence>
        {isJoining && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-ink"
          >
            <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
            <p className="text-white/70 text-sm">Connecting to Maria...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={handleLeave}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      {isJoined && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4"
        >
          <button
            onClick={toggleMute}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
            )}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>
          
          <button
            onClick={handleLeave}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      )}

      {/* Live Indicator */}
      {isJoined && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-full">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-medium uppercase tracking-wide">Live</span>
        </div>
      )}
    </div>
  );
}
