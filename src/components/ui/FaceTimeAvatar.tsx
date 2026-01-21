import { cn } from "@/lib/utils";

interface FaceTimeAvatarProps {
  videoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "w-20 h-20",
    rings: "w-24 h-24",
    status: "w-4 h-4 bottom-0 right-1",
  },
  md: {
    container: "w-32 h-32",
    rings: "w-36 h-36",
    status: "w-6 h-6 bottom-1 right-2",
  },
  lg: {
    container: "w-48 h-48",
    rings: "w-56 h-56",
    status: "w-7 h-7 bottom-2 right-3",
  },
};

export function FaceTimeAvatar({ 
  videoUrl = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4",
  size = "md",
  className 
}: FaceTimeAvatarProps) {
  const sizes = sizeClasses[size];
  
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Pulsing rings for "Active Intelligence" feel */}
      <div className={cn("absolute rounded-full border-[3px] border-primary/60 ios-pulse-ring", sizes.rings)} />
      <div className={cn("absolute rounded-full border-[3px] border-primary/40 ios-pulse-ring-delay", sizes.rings)} />
      <div className={cn("absolute rounded-full border-[3px] border-primary/20 ios-pulse-ring-delay-2", sizes.rings)} />

      {/* Premium Avatar Container with Video */}
      <div className={cn(
        "relative rounded-full overflow-hidden ring-4 ring-primary/30 bg-ink flex items-center justify-center shadow-2xl z-10",
        sizes.container
      )}>
        <video 
          src={videoUrl} 
          className="w-full h-full object-cover scale-125"
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      {/* Online Status Indicator */}
      <div className={cn(
        "absolute bg-emerald-500 border-2 border-ink rounded-full shadow-lg animate-pulse z-20",
        sizes.status
      )} />
    </div>
  );
}

export default FaceTimeAvatar;
