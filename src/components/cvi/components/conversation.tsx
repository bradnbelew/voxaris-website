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
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, Monitor } from 'lucide-react';

interface ConversationProps {
  conversationUrl: string;
  onLeave?: () => void;
  className?: string;
}

export function Conversation({ conversationUrl, onLeave, className }: ConversationProps) {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });
  
  const [isJoining, setIsJoining] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Get remote participant's video/audio
  const remoteId = remoteParticipantIds[0];
  const remoteVideoTrack = useVideoTrack(remoteId);
  const remoteAudioTrack = useAudioTrack(remoteId);
  
  // Get local video track
  const localVideoTrack = useVideoTrack(localSessionId);

  // Handle remote video stream
  useEffect(() => {
    if (remoteVideoTrack?.track && remoteVideoRef.current) {
      const stream = new MediaStream([remoteVideoTrack.track]);
      remoteVideoRef.current.srcObject = stream;
    }
  }, [remoteVideoTrack?.track]);

  // Handle remote audio stream
  useEffect(() => {
    if (remoteAudioTrack?.track) {
      const audio = new Audio();
      audio.srcObject = new MediaStream([remoteAudioTrack.track]);
      audio.play().catch(console.error);
    }
  }, [remoteAudioTrack?.track]);

  // Handle local video stream (self-view)
  useEffect(() => {
    if (localVideoTrack?.track && localVideoRef.current) {
      const stream = new MediaStream([localVideoTrack.track]);
      localVideoRef.current.srcObject = stream;
    }
  }, [localVideoTrack?.track]);

  // Join the call
  useEffect(() => {
    if (!daily || !conversationUrl) return;

    const joinCall = async () => {
      try {
        setIsJoining(true);
        setError(null);
        
        await daily.join({ url: conversationUrl });
        
        // Enable noise cancellation
        await daily.updateInputSettings({
          audio: {
            processor: {
              type: 'noise-cancellation',
            },
          },
        });
        
      } catch (err) {
        console.error('Failed to join call:', err);
        setError('Failed to connect. Please try again.');
        setIsJoining(false);
      }
    };

    joinCall();

    return () => {
      daily.leave().catch(console.error);
    };
  }, [daily, conversationUrl]);

  // Listen for joined-meeting event
  useDailyEvent('joined-meeting', () => {
    setIsJoining(false);
    setIsJoined(true);
  });

  // Listen for left-meeting event
  useDailyEvent('left-meeting', () => {
    setIsJoined(false);
    setIsJoining(false);
    onLeave?.();
  });

  // Listen for errors
  useDailyEvent('error', (event) => {
    console.error('Daily error:', event);
    setError('Connection error occurred');
    setIsJoining(false);
  });

  const handleLeave = useCallback(async () => {
    if (daily) {
      await daily.leave();
      onLeave?.();
    }
  }, [daily, onLeave]);

  const toggleMic = useCallback(() => {
    if (daily) {
      daily.setLocalAudio(isMicMuted);
      setIsMicMuted(!isMicMuted);
    }
  }, [daily, isMicMuted]);

  const toggleCamera = useCallback(() => {
    if (daily) {
      daily.setLocalVideo(isCamOff);
      setIsCamOff(!isCamOff);
    }
  }, [daily, isCamOff]);

  return (
    <div className={cn('relative w-full h-full bg-ink rounded-2xl overflow-hidden', className)}>
      {/* Remote Video (Main View) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Self-View Preview */}
      {isJoined && !isCamOff && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 right-4 w-32 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg"
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
            style={{ transform: 'scaleX(-1)' }}
          />
        </motion.div>
      )}

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
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3"
        >
          {/* Mic Toggle */}
          <button
            onClick={toggleMic}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              isMicMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
            )}
            title={isMicMuted ? 'Unmute' : 'Mute'}
          >
            {isMicMuted ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Camera Toggle */}
          <button
            onClick={toggleCamera}
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              isCamOff ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
            )}
            title={isCamOff ? 'Turn on camera' : 'Turn off camera'}
          >
            {isCamOff ? (
              <VideoOff className="w-5 h-5 text-white" />
            ) : (
              <Video className="w-5 h-5 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleLeave}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
            title="End call"
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
