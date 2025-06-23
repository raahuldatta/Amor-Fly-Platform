import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ParallaxContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  speed?: number
}

export function ParallaxContainer({
  children,
  className,
  speed = 0.5,
  ...props
}: ParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const scrolled = window.scrollY
      const translateY = scrolled * speed

      containerRef.current.style.transform = `translateY(${translateY}px)`
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={containerRef}
      className={cn("transition-transform duration-100", className)}
      {...props}
    >
      {children}
    </div>
  )
} 