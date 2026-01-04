"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "next-themes"

interface Star {
  x: number
  y: number
  z: number
  size: number
  brightness: number
  twinkleSpeed: number
  twinklePhase: number
  color: string
}

interface Nebula {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  phase: number
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  active: boolean
}

interface CosmicBackgroundProps {
  fullPage?: boolean
}

export function CosmicBackground({ fullPage = false }: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const nebulaeRef = useRef<Nebula[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const animationFrameRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const { resolvedTheme } = useTheme()

  const initStars = useCallback(
    (width: number, height: number) => {
      // Significantly reduced star count calculation since we only cover viewport now
      // Was: (width * height) / 4000
      // Now: (width * height) / 2500 for better density on smaller area, but capped at 250
      const starCount = Math.min(250, Math.floor((width * height) / 2500))
      const colors =
        resolvedTheme === "dark"
          ? ["#22d3ee", "#67e8f9", "#a5f3fc", "#60a5fa", "#93c5fd", "#ffffff"]
          : ["#0891b2", "#06b6d4", "#22d3ee", "#3b82f6", "#60a5fa", "#9ca3af"]

      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 3 + 1,
        size: Math.random() * 1 + 0.5,
        brightness: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))

      // Reduced nebula count for viewport only
      const nebulaCount = 3
      nebulaeRef.current = Array.from({ length: nebulaCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 200 + 100,
        color: resolvedTheme === "dark" ? "#22d3ee" : "#0891b2",
        opacity: Math.random() * 0.04 + 0.02,
        phase: Math.random() * Math.PI * 2,
      }))

      shootingStarsRef.current = Array.from({ length: 3 }, () => ({
        x: 0,
        y: 0,
        length: 0,
        speed: 0,
        angle: 0,
        opacity: 0,
        active: false,
      }))
    },
    [resolvedTheme],
  )

  const spawnShootingStar = useCallback((width: number, height: number) => {
    const inactive = shootingStarsRef.current.find((s) => !s.active)
    if (inactive && Math.random() < 0.002) {
      inactive.x = Math.random() * width
      inactive.y = Math.random() * (height * 0.4)
      inactive.length = Math.random() * 80 + 40
      inactive.speed = Math.random() * 8 + 4
      inactive.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3
      inactive.opacity = 1
      inactive.active = true
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false }) // Optimization: hint we don't need alpha for the backdrop
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      // Always use innerWidth/innerHeight for viewport coverage
      const width = window.innerWidth
      const height = window.innerHeight

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        initStars(width, height)
      }
    }

    // Debounce resize
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }

    resizeCanvas()
    window.addEventListener("resize", handleResize)

    const animate = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      timeRef.current += 0.016

      // Fully clear the canvas
      ctx.fillStyle = resolvedTheme === "dark" ? "rgb(8, 8, 20)" : "rgb(250, 250, 255)"
      ctx.fillRect(0, 0, width, height)

      // Draw nebulae
      nebulaeRef.current.forEach((nebula) => {
        const pulseFactor = Math.sin(timeRef.current * 0.3 + nebula.phase) * 0.2 + 1
        const gradient = ctx.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.radius * pulseFactor,
        )
        const alphaHex = Math.floor(nebula.opacity * 255)
          .toString(16)
          .padStart(2, "0")
        const alphaHex2 = Math.floor(nebula.opacity * 0.3 * 255)
          .toString(16)
          .padStart(2, "0")
        gradient.addColorStop(0, `${nebula.color}${alphaHex}`)
        gradient.addColorStop(0.5, `${nebula.color}${alphaHex2}`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(nebula.x, nebula.y, nebula.radius * pulseFactor, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Draw stars with standardized sizes
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed * 60 + star.twinklePhase)
        const brightness = star.brightness * (0.7 + twinkle * 0.3)

        const parallaxX = Math.sin(timeRef.current * 0.06) * star.z * 0.3
        const parallaxY = Math.cos(timeRef.current * 0.04) * star.z * 0.2

        ctx.beginPath()
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = brightness
        ctx.fill()
        ctx.globalAlpha = 1
      })

      spawnShootingStar(width, height)

      // Draw shooting stars with cyan color
      shootingStarsRef.current.forEach((star) => {
        if (!star.active) return

        const tailX = star.x - Math.cos(star.angle) * star.length
        const tailY = star.y - Math.sin(star.angle) * star.length

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y)
        gradient.addColorStop(0, "transparent")
        gradient.addColorStop(0.7, resolvedTheme === "dark" ? "#22d3ee60" : "#06b6d460")
        gradient.addColorStop(1, resolvedTheme === "dark" ? "#22d3ee" : "#06b6d4")

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(star.x, star.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.globalAlpha = star.opacity
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.fill()

        ctx.globalAlpha = 1

        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed
        star.opacity -= 0.006

        if (star.opacity <= 0 || star.x > width || star.y > height) {
          star.active = false
        }
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [resolvedTheme, initStars, spawnShootingStar])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
