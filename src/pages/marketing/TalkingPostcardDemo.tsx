import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Loader2 } from 'lucide-react';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';

/**
 * /talking-postcard/demo
 *
 * Static embed page for the Tavus CVI video agent.
 * Expects query params:
 *   ?url=<conversation_url>&dealership=<name>&name=<gm_name>
 *
 * The conversation_url is a Daily.co room URL returned by the Tavus API.
 */
export function TalkingPostcardDemo() {
  const [searchParams] = useSearchParams();
  const conversationUrl = searchParams.get('url');
  const dealership = searchParams.get('dealership') || 'your dealership';
  const gmName = searchParams.get('name') || '';

  const [state, setState] = useState<'connecting' | 'active' | 'ended' | 'error'>('connecting');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(true);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callObjectRef = useRef<DailyCall | null>(null);

  // Join the Daily.co call
  useEffect(() => {
    if (!conversationUrl || !videoContainerRef.current) return;

    const joinCall = async () => {
      try {
        const callFrame = DailyIframe.createFrame(videoContainerRef.current!, {
          showLeaveButton: false,
          showFullscreenButton: false,
          showUserNameChangeUI: false,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
            borderRadius: '16px',
          },
        });

        callObjectRef.current = callFrame;

        // Listen for participant events
        callFrame.on('joined-meeting', () => {
          setState('active');
        });

        callFrame.on('left-meeting', () => {
          setState('ended');
        });

        callFrame.on('error', () => {
          setState('error');
        });

        await callFrame.join({ url: conversationUrl });
      } catch (err) {
        console.error('Failed to join video call:', err);
        setState('error');
      }
    };

    joinCall();

    return () => {
      if (callObjectRef.current) {
        callObjectRef.current.leave().catch(console.error);
        callObjectRef.current.destroy();
        callObjectRef.current = null;
      }
    };
  }, [conversationUrl]);

  const handleLeave = useCallback(async () => {
    if (callObjectRef.current) {
      await callObjectRef.current.leave();
      callObjectRef.current.destroy();
      callObjectRef.current = null;
    }
    setState('ended');
  }, []);

  const toggleMic = useCallback(() => {
    if (callObjectRef.current) {
      callObjectRef.current.setLocalAudio(isMicMuted);
      setIsMicMuted(!isMicMuted);
    }
  }, [isMicMuted]);

  const toggleCam = useCallback(() => {
    if (callObjectRef.current) {
      callObjectRef.current.setLocalVideo(isCamOff);
      setIsCamOff(!isCamOff);
    }
  }, [isCamOff]);

  // No conversation URL — show error
  if (!conversationUrl) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-white mb-4">Session Not Found</h1>
          <p className="text-zinc-500 mb-8">
            This demo session has expired or the link is invalid.
            Generate a new demo to talk to your AI agent.
          </p>
          <Link
            to="/talking-postcard"
            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-semibold text-lg py-4 px-8 rounded-2xl transition-all duration-300"
          >
            Generate New Demo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/voxaris-logo-white.png" alt="Voxaris" className="h-6 w-auto opacity-60" />
          </Link>
          <div className="w-px h-5 bg-zinc-800" />
          <span className="text-zinc-500 text-sm">Talking Postcard Demo</span>
        </div>
        <div className="flex items-center gap-3">
          {state === 'active' && (
            <span className="flex items-center gap-2 text-emerald-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
          {/* Context bar */}
          <motion.div
            className="w-full max-w-3xl mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div>
                <span className="text-zinc-500 text-xs uppercase tracking-wider">Demo for</span>
                <p className="text-white font-semibold text-sm">{dealership}</p>
              </div>
              {gmName && (
                <div className="text-right">
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">Requested by</span>
                  <p className="text-white font-semibold text-sm">{gmName}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Video container */}
          <div className="w-full max-w-3xl aspect-video relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            {state === 'connecting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-900">
                <Loader2 className="w-12 h-12 text-zinc-500 animate-spin mb-4" />
                <p className="text-zinc-400 text-lg font-medium">Connecting to your AI agent...</p>
                <p className="text-zinc-600 text-sm mt-1">This usually takes a few seconds</p>
              </div>
            )}

            {state === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-900">
                <p className="text-zinc-400 text-lg font-medium mb-4">Connection failed</p>
                <Link
                  to="/talking-postcard"
                  className="bg-white hover:bg-zinc-100 text-black font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Try Again
                </Link>
              </div>
            )}

            {state === 'ended' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-900">
                <p className="text-white text-2xl font-bold mb-2">Thanks for watching.</p>
                <p className="text-zinc-500 mb-6 max-w-md text-center">
                  That was your personalized AI agent for {dealership}.
                  Ready to deploy it for real?
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    to="/book-demo"
                    className="bg-white hover:bg-zinc-100 text-black font-semibold py-3 px-8 rounded-xl transition-colors"
                  >
                    Book a Strategy Call
                  </Link>
                  <Link
                    to="/talking-postcard"
                    className="text-zinc-500 hover:text-white border border-zinc-700 hover:border-zinc-500 py-3 px-6 rounded-xl transition-colors"
                  >
                    Generate Another
                  </Link>
                </div>
              </div>
            )}

            {/* Daily.co iframe mounts here */}
            <div ref={videoContainerRef} className="w-full h-full" />
          </div>

          {/* Controls */}
          {state === 'active' && (
            <motion.div
              className="flex items-center gap-3 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <button
                onClick={toggleMic}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isMicMuted
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
                title={isMicMuted ? 'Unmute' : 'Mute'}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={toggleCam}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isCamOff
                    ? 'bg-zinc-800 border border-zinc-700 text-zinc-500'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
                title={isCamOff ? 'Turn camera on' : 'Turn camera off'}
              >
                {isCamOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={handleLeave}
                className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 flex items-center justify-center transition-colors"
                title="End call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-zinc-800 text-center">
        <p className="text-zinc-600 text-xs">
          Powered by <span className="text-zinc-500">Voxaris AI</span> &bull;{' '}
          <Link to="/talking-postcard" className="text-zinc-500 hover:text-zinc-400 transition-colors">
            Generate another demo
          </Link>
        </p>
      </footer>
    </div>
  );
}
