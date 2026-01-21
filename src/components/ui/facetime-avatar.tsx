
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
          <div className="absolute inset-0 rounded-full border-[3px] border-purple-500/60 animate-[ping_3s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border-[3px] border-purple-500/40 animate-[ping_3s_linear_infinite_1s]" />
        </>
      )}

      {/* Video Container */}
      <div className="relative h-32 w-32 overflow-hidden rounded-full bg-black ring-4 ring-purple-500/30 shadow-2xl z-10">
        <video 
          src={videoUrl} 
          className="h-full w-full scale-125 object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      {/* Online Dot */}
      <div className="absolute bottom-1 right-2 z-20 h-6 w-6 animate-pulse rounded-full border-2 border-background bg-green-500 shadow-lg" />
    </div>
  )
}
