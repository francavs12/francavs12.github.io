"use client"

import { useEffect, useState } from "react"

interface DataColumn {
  id: number
  x: number
  delay: number
  duration: number
  chars: string[]
}

const WIRED_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

function generateChar() {
  return WIRED_CHARS[Math.floor(Math.random() * WIRED_CHARS.length)]
}

function generateColumn(id: number): DataColumn {
  const charCount = Math.floor(Math.random() * 15) + 8
  return {
    id,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    chars: Array.from({ length: charCount }, generateChar),
  }
}

interface DataStreamProps {
  isActive?: boolean
}

export function DataStream({ isActive = true }: DataStreamProps) {
  const [columns, setColumns] = useState<DataColumn[]>([])

  useEffect(() => {
    const initialColumns = Array.from({ length: 20 }, (_, i) => generateColumn(i))
    setColumns(initialColumns)

    const interval = setInterval(() => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          chars: col.chars.map(() => (Math.random() > 0.7 ? generateChar() : col.chars[0])),
        }))
      )
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-700"
      style={{ opacity: isActive ? 0.07 : 0 }}
    >
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 flex flex-col text-xs text-primary"
          style={{
            left: `${col.x}%`,
            animation: `data-stream ${col.duration}s linear ${col.delay}s infinite`,
          }}
        >
          {col.chars.map((char, i) => (
            <span
              key={i}
              className="font-mono"
              style={{
                opacity: 1 - i * 0.06,
                textShadow: i === 0 ? "0 0 10px currentColor" : "none",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
