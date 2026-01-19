import { useState, useRef } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { Phone, PhoneOff } from "lucide-react";

const API_BASE_URL = "https://hill-nissan-backend.onrender.com";
const PHONE_NUMBER = "4078195809";

const VoxarisLivingInterface = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const callObjectRef = useRef<DailyCall | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tavus/create-conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: PHONE_NUMBER })
      });
      const data = await response.json();

      if (!data.url) throw new Error("Failed to get Room URL");

      setIsActive(true);

      if (videoContainerRef.current && !callObjectRef.current) {
        const callFrame = DailyIframe.createFrame(videoContainerRef.current, {
          showLeaveButton: false,
          showFullscreenButton: false,
          showUserNameChangeUI: false,
          iframeStyle: { width: "100%", height: "100%", border: "0", borderRadius: "12px" }
        });

        callObjectRef.current = callFrame;
        await callFrame.join({ url: data.url });
        setIsConnecting(false);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to Neural Engine. Please try again.");
      setIsConnecting(false);
      setIsActive(false);
    }
  };

  const endSession = () => {
    if (callObjectRef.current) {
      callObjectRef.current.leave();
      callObjectRef.current.destroy();
      callObjectRef.current = null;
    }
    setIsActive(false);
  };

  if (isActive) {
    return (
      <div className="relative w-full aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden bg-black">
        {/* The Video Stream */}
        <div ref={videoContainerRef} className="w-full h-full" />

        {/* End Button */}
        <button
          onClick={endSession}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-2xl transition-all z-20"
        >
          <PhoneOff className="w-7 h-7 text-white" />
        </button>

        {/* Loading Overlay */}
        {isConnecting && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-white/80 font-mono text-sm">Initializing Phoenix-4 Core...</p>
          </div>
        )}
      </div>
    );
  }

  // IDLE STATE (Living Photo)
  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="relative flex flex-col items-center">
        {/* Pulse Rings */}
        <div className="absolute w-36 h-36 rounded-full border-[3px] border-purple-500/60 ios-pulse-ring" />
        <div className="absolute w-36 h-36 rounded-full border-[3px] border-purple-500/40 ios-pulse-ring-delay" />
        <div className="absolute w-36 h-36 rounded-full border-[3px] border-purple-500/20 ios-pulse-ring-delay-2" />

        {/* Avatar Container */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500/30 bg-black flex items-center justify-center shadow-2xl z-10 mb-6">
          <video
            src="https://cdn.replica.tavus.io/20283/9de1f64e.mp4"
            className="w-full h-full object-cover scale-125"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>

        {/* "TALK TO MARIA" BUTTON */}
        <button
          onClick={startSession}
          disabled={isConnecting}
          className="group flex items-center overflow-hidden rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
        >
          {/* Text Block */}
          <div className="flex items-center gap-3 bg-zinc-900 px-6 py-4 group-hover:bg-zinc-800 transition-colors">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-white font-bold tracking-wider text-sm">
              {isConnecting ? "Connecting..." : "TALK TO MARIA"}
            </span>
          </div>

          {/* Icon Block */}
          <div className="bg-zinc-800 px-5 py-4 group-hover:bg-zinc-700 transition-colors">
            <Phone className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default VoxarisLivingInterface;
