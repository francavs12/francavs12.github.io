"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { BootScreen } from "@/components/boot-screen"
import { WiredTerminal } from "@/components/wired-terminal"
import { InfoPanel } from "@/components/info-panel"
import { DataStream } from "@/components/data-stream"
import { AkariFace } from "@/components/akari-face"
import { SiestaOverlay } from "@/components/siesta-overlay"
import { useTheme } from "@/hooks/use-theme"
import { AriaBackground } from "@/components/aria-background"
import { WaterEffect } from "@/components/water-effect"

export default function WiredPage() {
  const [isBooted, setIsBooted] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const [akariActive, setAkariActive] = useState(false)
  const [siestaActive, setSiestaActive] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { theme, setTheme, toggleTheme, isLain } = useTheme()

  // Random glitch effect - only in Lain theme
  useEffect(() => {
    if (!isBooted || !isLain) return

    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.12) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150)
      }
    }, 4000)

    return () => clearInterval(glitchInterval)
  }, [isBooted, isLain])

  const triggerAwakari = useCallback(() => {
    setAkariActive(true)
    setTimeout(() => setAkariActive(false), 100)

    // Play awawawa sound
    if (!audioRef.current) {
      audioRef.current = new Audio("https://files.catbox.moe/o501zw.mp3")
      audioRef.current.volume = 0.7
    }
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [])

  const triggerSiesta = useCallback(() => {
    setSiestaActive(true)
    setTimeout(() => setSiestaActive(false), 5000)
  }, [])

  if (!isBooted) {
    return <BootScreen onComplete={() => setIsBooted(true)} />
  }

  return (
    <div
      className={`relative min-h-screen bg-background transition-colors duration-500 ${
        isLain ? "crt-scanlines crt-flicker" : ""
      } ${isGlitching && isLain ? "glitch" : ""}`}
    >
      {/* Background effects */}
      <AriaBackground isActive={!isLain} />
      <WaterEffect isActive={!isLain} />
      <DataStream isActive={isLain} />
      <AkariFace isActive={akariActive} />
      <SiestaOverlay isActive={siestaActive} />

      {/* Vignette effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-700"
        style={{
          background: isLain 
            ? "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)"
            : "radial-gradient(ellipse at center, transparent 0%, rgba(20,10,25,0.5) 100%)"
        }}
      />

      {/* Main content */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl flex-col p-4">
        {/* Header */}
        <header className="mb-4 border-b border-primary/30 pb-4 text-center">
          <h1
            className={`text-glow text-3xl tracking-[0.4em] text-primary md:text-4xl ${
              isGlitching ? "glitch-chromatic" : ""
            }`}
          >
            FRANCAVS
          </h1>
          <p className="mt-2 text-xs tracking-[0.2em] text-muted-foreground">
            {isLain ? "conectado a the wired" : "navegando por neo venezia"}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              {isLain ? "CONNECTED" : "NAVEGANDO"}
            </span>
            <span>•</span>
            <span>{isLain ? "LAYER 07" : "AQUA"}</span>
            <span>•</span>
            <span>{isLain ? "PROTOCOL 7" : "NEO VENEZIA"}</span>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid flex-1 gap-4 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_380px]">
          {/* Terminal */}
          <div className="min-h-[400px] md:min-h-0">
            <WiredTerminal 
              triggerAwakari={triggerAwakari} 
              triggerSiesta={triggerSiesta}
              currentTheme={theme}
              onThemeChange={setTheme}
              onThemeToggle={toggleTheme}
            />
          </div>

          {/* Side Panel */}
          <div className="h-[500px] md:h-auto">
            <InfoPanel />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 border-t border-primary/20 pt-3 text-center text-[10px] text-muted-foreground">
          <p>{isLain 
            ? "no matter where you go, everyone is connected." 
            : "disfrutemos de este momento maravilloso juntos."
          }</p>
          <p className="mt-1 opacity-60">
            {isLain ? "present day, present time" : "aqua time"}
          </p>
        </footer>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none fixed left-2 top-2 z-30 size-8 border-l border-t border-primary/20 md:size-12" />
      <div className="pointer-events-none fixed right-2 top-2 z-30 size-8 border-r border-t border-primary/20 md:size-12" />
      <div className="pointer-events-none fixed bottom-2 left-2 z-30 size-8 border-b border-l border-primary/20 md:size-12" />
      <div className="pointer-events-none fixed bottom-2 right-2 z-30 size-8 border-b border-r border-primary/20 md:size-12" />
    </div>
  )
}
