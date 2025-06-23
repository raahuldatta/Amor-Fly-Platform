import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  intensity?: "light" | "medium" | "strong"
}

export function GlassCard({
  children,
  className,
  intensity = "medium",
  ...props
}: GlassCardProps) {
  const intensityClasses = {
    light: "backdrop-blur-sm bg-white/10",
    medium: "backdrop-blur-md bg-white/20",
    strong: "backdrop-blur-lg bg-white/30",
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-white/20 shadow-2xl transition-all duration-300 hover:shadow-white/10",
        intensityClasses[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 