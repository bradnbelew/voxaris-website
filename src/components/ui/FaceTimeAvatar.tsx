const FaceTimeAvatar = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Pulsing Purple rings for "Active Intelligence" feel */}
      <div className="absolute w-36 h-36 rounded-full border-[3px] border-purple-500/60 ios-pulse-ring" />
      <div className="absolute w-36 h-36 rounded-full border-[3px] border-purple-500/40 ios-pulse-ring-delay" />
      <div className="absolute w-36 h-36 rounded-full border-[3px] border-purple-500/20 ios-pulse-ring-delay-2" />

      {/* Premium Avatar Container with Real Olivia Video */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-500/30 bg-black flex items-center justify-center shadow-2xl z-10">
        <video 
          src="https://cdn.replica.tavus.io/20283/9de1f64e.mp4" 
          className="w-full h-full object-cover scale-125"
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      {/* Online Status Indicator */}
      <div className="absolute bottom-1 right-2 w-6 h-6 bg-green-500 border-2 border-black rounded-full shadow-lg animate-pulse z-20" />
    </div>
  );
};

export default FaceTimeAvatar;