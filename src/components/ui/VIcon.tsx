import { cn } from "@/lib/utils";

interface VIconProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "solid" | "outline" | "gradient";
}

export default function VIcon({ size = "md", className, variant = "solid" }: VIconProps) {
  const sizeClasses = {
    sm: "w-5 h-5 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-2xl",
  };

  const variantClasses = {
    solid: "bg-ink text-white",
    outline: "bg-transparent border-2 border-ink text-ink",
    gradient: "bg-gradient-to-br from-ink to-charcoal text-white",
  };

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center font-display font-bold",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      V
    </div>
  );
}
