"use client"

interface SiestaOverlayProps {
  isActive: boolean
}

export function SiestaOverlay({ isActive }: SiestaOverlayProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9998] bg-black transition-opacity duration-[2000ms] ${
        isActive ? "opacity-90" : "opacity-0"
      }`}
    >
      {isActive && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="animate-pulse text-2xl text-primary/60">zzz...</p>
            <p className="mt-4 text-xs text-muted-foreground">tomando una siesta tranquila...</p>
          </div>
        </div>
      )}
    </div>
  )
}
