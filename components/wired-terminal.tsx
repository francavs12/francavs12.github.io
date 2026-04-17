"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface TerminalLine {
  type: "input" | "output" | "system"
  content: string
}

import type { Theme } from "@/hooks/use-theme"

interface WiredTerminalProps {
  onCommand?: (command: string) => void
  triggerAwakari?: () => void
  triggerSiesta?: () => void
  currentTheme?: Theme
  onThemeChange?: (theme: Theme) => void
  onThemeToggle?: () => void
}

const INITIAL_LINES: TerminalLine[] = [
  { type: "system", content: "estableciendo conexión..." },
  { type: "system", content: "nodo: FranCavs" },
  { type: "system", content: "estado: tranquilo" },
  { type: "output", content: "" },
  { type: "output", content: 'escribí "ayuda" para ver comandos' },
]

const COMMANDS: Record<string, string[]> = {
  ayuda: [
    "╔══════════════════════════════════════╗",
    "║          comandos disponibles        ║",
    "╠══════════════════════════════════════╣",
    "║  sobre    - información personal     ║",
    "║  mate     - cebar un mate            ║",
    "║  awawawa  - activar modo akari       ║",
    "║  siesta   - tomar una siesta         ║",
    "║  lain     - present day, present time║",
    "║  gato     - invocar un gato          ║",
    "║  gondola  - navegar por neo venezia  ║",
    "║  wired    - conectar más profundo    ║",
    "║  theme    - cambiar tema visual      ║",
    "║  limpiar  - limpiar terminal         ║",
    "╚══════════════════════════════════════╝",
  ],
  sobre: [
    "┌─────────────────────────────────────┐",
    "│  FranCavs                           │",
    "│  ─────────────────────────────────  │",
    "│  fan del slice of life              │",
    "│  iyashikei enjoyer                  │",
    "│  connected to the wired             │",
    "│  navegando por neo venezia          │",
    "└─────────────────────────────────────┘",
  ],
  mate: [
    "cebando mate...",
    "█░░░░░░░░░",
    "███░░░░░░░",
    "█████░░░░░",
    "███████░░░",
    "██████████",
    "mate listo ☕",
  ],
  lain: [
    "",
    "▓▓▓ present day ▓▓▓",
    "▓▓▓ present time ▓▓▓",
    "",
    "and you don't seem to understand...",
    "",
  ],
  gato: [
    "",
    "  /\\_/\\  ",
    " ( o.o ) ",
    "  > ^ <  ",
    " /|   |\\",
    "(_|   |_)",
    "",
    "presidente aria dice: puinyu~",
  ],
  gondola: [
    "",
    "        ~~~~~~~~~~~~~~~~~~~~",
    "   ⛵    ~  neo venezia  ~",
    "        ~~~~~~~~~~~~~~~~~~~~",
    "",
    "navegando por los canales...",
    "el agua refleja el cielo de aqua...",
    "se escucha una canción de barcarole...",
  ],
  wired: [
    "",
    "████████████████████████████████████",
    "█ ACCESSING LAYER 07...            █",
    "█ PROTOCOL: SERIAL EXPERIMENTS     █",
    "█ STATUS: CONNECTED                █",
    "█ NODE: FranCavs                   █",
    "█ LOCATION: NEO VENEZIA / WIRED    █",
    "████████████████████████████████████",
    "",
    "no matter where you go...",
    "everyone is connected.",
  ],
  awawawa: ["activando modo akari...", "", "akari: awawawa~", "", "¡las ñoñerías están prohibidas!"],
  siesta: ["", "tomando una siesta...", "zzz...", ""],
}

export function WiredTerminal({ 
  triggerAwakari, 
  triggerSiesta, 
  currentTheme,
  onThemeChange,
  onThemeToggle 
}: WiredTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(INITIAL_LINES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const typeOutput = useCallback(async (outputLines: string[]) => {
    setIsTyping(true)
    for (const line of outputLines) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setLines((prev) => [...prev, { type: "output", content: line }])
    }
    setIsTyping(false)
  }, [])

  const handleCommand = useCallback(async (command: string) => {
    const cmd = command.toLowerCase().trim()

    setLines((prev) => [...prev, { type: "input", content: `> ${command}` }])

    if (cmd === "limpiar") {
      setLines(INITIAL_LINES)
      return
    }

    if (cmd === "awawawa" && triggerAwakari) {
      triggerAwakari()
    }

    if (cmd === "siesta" && triggerSiesta) {
      triggerSiesta()
    }

    // Handle theme command
    if (cmd === "theme" && onThemeToggle) {
      const newTheme = currentTheme === "lain" ? "aria" : "lain"
      await typeOutput([
        "",
        `desconectando de ${currentTheme === "lain" ? "the wired" : "neo venezia"}...`,
        `reconectando a ${newTheme === "lain" ? "the wired" : "neo venezia"}...`,
        "",
        `tema cambiado a: ${newTheme}`,
      ])
      onThemeToggle()
      return
    }

    if (cmd.startsWith("theme ") && onThemeChange) {
      const targetTheme = cmd.split(" ")[1]
      if (targetTheme === "lain" || targetTheme === "aria") {
        if (targetTheme === currentTheme) {
          await typeOutput([`ya estás en el tema ${targetTheme}`])
          return
        }
        await typeOutput([
          "",
          `desconectando de ${currentTheme === "lain" ? "the wired" : "neo venezia"}...`,
          `reconectando a ${targetTheme === "lain" ? "the wired" : "neo venezia"}...`,
          "",
          `tema cambiado a: ${targetTheme}`,
        ])
        onThemeChange(targetTheme)
        return
      } else {
        await typeOutput([
          `tema desconocido: ${targetTheme}`,
          "temas disponibles: lain, aria",
        ])
        return
      }
    }

    const response = COMMANDS[cmd]
    if (response) {
      await typeOutput(response)
    } else {
      setLines((prev) => [...prev, { type: "output", content: `comando no reconocido: ${cmd}` }])
    }
  }, [triggerAwakari, triggerSiesta, typeOutput, currentTheme, onThemeToggle, onThemeChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim() && !isTyping) {
      handleCommand(input)
      setInput("")
    }
  }

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [lines])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div
      className="flex h-full flex-col border border-primary/50 bg-card/80 backdrop-blur-sm"
      onClick={focusInput}
    >
      <div className="flex items-center gap-2 border-b border-primary/30 bg-primary/10 px-3 py-2">
        <div className="size-2 rounded-full bg-red-500/70" />
        <div className="size-2 rounded-full bg-yellow-500/70" />
        <div className="size-2 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-muted-foreground">
          {currentTheme === "aria" ? "undine@aqua:~" : "navi@wired:~"}
        </span>
      </div>

      <div ref={outputRef} className="flex-1 overflow-auto p-4 text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap font-mono ${
              line.type === "system"
                ? "text-accent"
                : line.type === "input"
                  ? "text-primary"
                  : "text-foreground"
            }`}
          >
            {line.content || "\u00A0"}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-primary/30 bg-primary/5 px-4 py-3">
        <span className="text-primary">{currentTheme === "aria" ? "aqua>" : "navi>"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          placeholder={isTyping ? "..." : "escribe un comando..."}
          autoFocus
        />
        <span className="cursor-blink text-primary">█</span>
      </div>
    </div>
  )
}
