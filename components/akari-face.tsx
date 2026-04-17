"use client"

import { useEffect, useState } from "react"

interface AkariFaceProps {
  isActive?: boolean
}

export function AkariFace({ isActive = false }: AkariFaceProps) {
  const [opacity, setOpacity] = useState(0.03)

  useEffect(() => {
    if (isActive) {
      setOpacity(0.15)
      const timeout = setTimeout(() => setOpacity(0.03), 1500)
      return () => clearTimeout(timeout)
    }
  }, [isActive])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center transition-opacity duration-1000"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 500 300"
        className="h-[60vh] w-auto"
        style={{
          filter: "blur(4px)",
          stroke: "currentColor",
          strokeWidth: 2,
          fill: "none",
        }}
      >
        {/* Eyes - simple horizontal lines like Akari's closed/squinting eyes */}
        <line x1="140" y1="110" x2="200" y2="110" className="text-primary/40" />
        <line x1="300" y1="110" x2="360" y2="110" className="text-primary/40" />
        
        {/* Mouth - simple square/rectangle like Aria's distinctive expression */}
        <rect x="225" y="160" width="50" height="40" rx="2" className="text-primary/30" />
        
        {/* Blush marks */}
        <circle cx="160" cy="140" r="15" className="text-accent/20" style={{ fill: "currentColor" }} />
        <circle cx="340" cy="140" r="15" className="text-accent/20" style={{ fill: "currentColor" }} />
      </svg>
    </div>
  )
}
