import { cn } from "@/lib/utils"

interface FaceTimeAvatarProps {
  videoUrl?: string
  isActive?: boolean
  className?: string
}

export function FaceTimeAvatar({ 
  videoUrl = "https://cdn.replica.tavus.io/20283/9de1f64e.mp4", 
  isActive = true,
  className 
}: FaceTimeAvatarProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>

      {/* Pulsing Rings - Only active when "Live" */}
      {isActive && (
        <>
          <div 
            className="absolute w-40 h-40 rounded-full border-2 border-primary/50 animate-ping" 
            style={{ animationDuration: '2s' }}
          />
          <div 
            className="absolute w-48 h-48 rounded-full border border-primary/30 animate-ping" 
            style={{ animationDuration: '3s', animationDelay: '0.5s' }}
          />
        </>
      )}

      {/* Video Container */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/40 shadow-2xl z-10 bg-ink">
        <video 
          src={videoUrl} 
          className="w-full h-full object-cover scale-125"
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      {/* Online Dot */}
      <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-ink rounded-full z-20 animate-pulse" />

    </div>
  )
}

export default FaceTimeAvatar;
