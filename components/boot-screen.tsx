"use client"

import { useEffect, useState } from "react"

interface BootScreenProps {
  onComplete: () => void
}

const BOOT_LINES = [
  "INITIALIZING SYSTEM...",
  "████████████████████████████████████",
  "",
  "> booting ARIA-OS v2.0",
  "> loading neural interface...",
  "> establishing connection to the wired...",
  "",
  "PROTOCOL: LAYER 07",
  "NODE DETECTED: FranCavs",
  "LOCATION: NEO VENEZIA / THE WIRED",
  "",
  "> synchronizing with aqua server...",
  "> loading iyashikei modules...",
  "",
  "CONNECTION ESTABLISHED",
  "████████████████████████████████████",
  "",
  "welcome to the wired.",
  "everyone is connected.",
]

export function BootScreen({ onComplete }: BootScreenProps) {
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentLine >= BOOT_LINES.length) {
      setTimeout(() => {
        setIsComplete(true)
        setTimeout(onComplete, 500)
      }, 800)
      return
    }

    const timeout = setTimeout(() => {
      setLines((prev) => [...prev, BOOT_LINES[currentLine]])
      setCurrentLine((prev) => prev + 1)
    }, Math.random() * 100 + 50)

    return () => clearTimeout(timeout)
  }, [currentLine, onComplete])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${
        isComplete ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Scanline effect */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0)_0px,rgba(0,0,0,0)_1px,rgba(0,255,150,0.03)_2px)] opacity-50" />

      {/* Boot content */}
      <div className="relative max-h-[80vh] w-full max-w-xl overflow-hidden px-8">
        <div className="mb-8 text-center">
          <h1 className="text-glow text-4xl tracking-[0.5em] text-primary">FRANCAVS</h1>
          <p className="mt-2 text-xs tracking-[0.3em] text-muted-foreground">
            THE WIRED × NEO VENEZIA
          </p>
        </div>

        <div className="space-y-1 font-mono text-xs">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${
                line.includes("████")
                  ? "text-primary/60"
                  : line.startsWith(">")
                    ? "text-accent"
                    : line === "" 
                      ? ""
                      : "text-foreground"
              }`}
              style={{
                animation: "fadeIn 0.1s ease-out",
              }}
            >
              {line || "\u00A0"}
            </div>
          ))}
          {currentLine < BOOT_LINES.length && (
            <span className="cursor-blink inline-block text-primary">█</span>
          )}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute left-4 top-4 size-16 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute right-4 top-4 size-16 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-4 left-4 size-16 border-b-2 border-l-2 border-primary/30" />
      <div className="absolute bottom-4 right-4 size-16 border-b-2 border-r-2 border-primary/30" />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
