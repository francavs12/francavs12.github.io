"use client"

import { useEffect, useRef } from "react"

interface WaterEffectProps {
  isActive?: boolean
}

export function WaterEffect({ isActive = true }: WaterEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = 150
    }
    resize()
    window.addEventListener("resize", resize)

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient for water - warm sunset tones
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(180, 120, 100, 0)")
      gradient.addColorStop(0.3, "rgba(160, 100, 90, 0.15)")
      gradient.addColorStop(1, "rgba(140, 80, 70, 0.35)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ripple lines - golden sunset reflections
      ctx.strokeStyle = "rgba(255, 200, 150, 0.2)"
      ctx.lineWidth = 1

      for (let i = 0; i < 8; i++) {
        ctx.beginPath()
        const y = 20 + i * 18
        const amplitude = 3 + Math.sin(time + i) * 2
        const frequency = 0.008 + i * 0.001

        for (let x = 0; x < canvas.width; x += 3) {
          const wave1 = Math.sin(x * frequency + time + i) * amplitude
          const wave2 = Math.sin(x * frequency * 1.5 + time * 1.3) * (amplitude * 0.5)
          const yPos = y + wave1 + wave2

          if (x === 0) {
            ctx.moveTo(x, yPos)
          } else {
            ctx.lineTo(x, yPos)
          }
        }
        ctx.stroke()
      }

      // Add subtle sparkles (golden light reflections)
      for (let i = 0; i < 15; i++) {
        const sparkleX = (Math.sin(time * 0.5 + i * 1.7) * 0.5 + 0.5) * canvas.width
        const sparkleY = 30 + (Math.cos(time * 0.3 + i * 2.1) * 0.5 + 0.5) * 80
        const sparkleAlpha = (Math.sin(time * 2 + i * 3) * 0.5 + 0.5) * 0.5

        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 220, 180, ${sparkleAlpha})`
        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed bottom-0 left-0 right-0 transition-opacity duration-700"
      style={{ 
        opacity: isActive ? 1 : 0,
        height: "150px"
      }}
    />
  )
}
