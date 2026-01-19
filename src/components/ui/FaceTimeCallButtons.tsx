import { Phone } from "lucide-react";

interface FaceTimeCallButtonsProps {
  onAccept: () => void;
  onDecline: () => void;
  isConnecting?: boolean;
}

const FaceTimeCallButtons = ({ onAccept, isConnecting }: FaceTimeCallButtonsProps) => {
  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={onAccept}
        disabled={isConnecting}
        className="group relative flex items-stretch shadow-2xl hover:scale-105 transition-transform duration-200"
      >
        {/* Left: Green Text Block */}
        <div className="bg-[#66ff66] text-black px-6 py-4 flex items-center gap-3 border-2 border-black">
          {/* Blinking Square Cursor */}
          <div className="w-4 h-4 bg-black animate-[pulse_1s_ease-in-out_infinite]" />
          <span className="font-mono text-lg tracking-wider font-bold uppercase">
            {isConnecting ? "CONNECTING..." : "ANSWER THE CALL"}
          </span>
        </div>

        {/* Right: White Icon Block */}
        <div className="bg-white px-6 py-4 border-2 border-l-0 border-black flex items-center justify-center">
          <Phone className="w-6 h-6 text-black fill-current" />
        </div>
      </button>
    </div>
  );
};

export default FaceTimeCallButtons;
