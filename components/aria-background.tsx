"use client"

import Image from "next/image"

interface AriaBackgroundProps {
  isActive?: boolean
}

export function AriaBackground({ isActive = true }: AriaBackgroundProps) {
  return (
    <div 
      className="pointer-events-none fixed inset-0 transition-opacity duration-1000"
      style={{ opacity: isActive ? 1 : 0 }}
    >
      {/* Background image */}
      <Image
        src="/images/neo-venezia-sunset.jpg"
        alt=""
        fill
        className="object-cover"
        style={{ opacity: 0.5 }}
        priority
      />
      
      {/* Dark sunset overlay gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(25, 20, 35, 0.6) 0%,
            rgba(40, 25, 45, 0.4) 30%,
            rgba(60, 35, 50, 0.3) 60%,
            rgba(30, 20, 40, 0.7) 100%
          )`
        }}
      />

      {/* Aria Company logo watermark */}
      <div className="absolute bottom-24 right-6 opacity-30">
        <svg 
          width="80" 
          height="80" 
          viewBox="0 0 100 100" 
          fill="currentColor"
          className="text-[#e8b4a0]"
        >
          {/* Simplified Aria Company oar/logo shape */}
          <ellipse cx="50" cy="50" rx="45" ry="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <path 
            d="M50 15 L50 85 M30 50 Q50 35 70 50 Q50 65 30 50" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none"
          />
          <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
