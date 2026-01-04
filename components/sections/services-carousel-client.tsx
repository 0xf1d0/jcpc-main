"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Shield, Bug, Users, FileCheck, Lock, Eye, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeInView } from "@/components/animations/fade-in-view"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Bug,
  Users,
  FileCheck,
  Lock,
  Eye,
}

interface Service {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  features: string[]
  order: number
  active: boolean
}

interface ServicesCarouselClientProps {
  services: Service[]
}

export function ServicesCarouselClient({ services }: ServicesCarouselClientProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionWidth, setSectionWidth] = useState(0)

  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const dragThreshold = 5

  const getCardWidth = useCallback(() => {
    if (typeof window === "undefined") return 700
    const vw = window.innerWidth
    if (vw < 640) return Math.min(vw - 80, 340)
    if (vw < 1024) return Math.min(vw - 160, 550)
    return 700
  }, [])

  const [cardWidth, setCardWidth] = useState(700)
  const cardGap = 24

  useEffect(() => {
    const updateDimensions = () => {
      setCardWidth(getCardWidth())
      if (sectionRef.current) {
        setSectionWidth(sectionRef.current.offsetWidth)
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [getCardWidth])

  const totalItems = services.length

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalItems)
  }, [totalItems])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }, [totalItems])

  // Navigate to specific service by slug
  const goToService = useCallback((serviceSlug: string) => {
    const index = services.findIndex(s => s.slug === serviceSlug)
    if (index !== -1) {
      setActiveIndex(index)
      setIsAutoPlaying(false)
      // Scroll to section
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [services])

  // Listen for navigation events from navbar dropdown
  useEffect(() => {
    const handleServiceNavigation = (e: CustomEvent<{ serviceId: string }>) => {
      goToService(e.detail.serviceId)
    }

    // Check URL hash on mount
    const hash = window.location.hash
    if (hash.startsWith("#service-")) {
      const serviceSlug = hash.replace("#service-", "")
      setTimeout(() => goToService(serviceSlug), 100)
    }

    window.addEventListener("service-navigation", handleServiceNavigation as EventListener)
    return () => window.removeEventListener("service-navigation", handleServiceNavigation as EventListener)
  }, [goToService])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(goToNext, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsAutoPlaying(false)
    setIsDragging(true)
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const offset = clientX - dragStartX
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (Math.abs(dragOffset) > cardWidth * 0.15) {
      if (dragOffset > 0) {
        goToPrev()
      } else {
        goToNext()
      }
    }
    setDragOffset(0)
  }

  const getTranslateX = () => {
    const centerOffset = (sectionWidth - cardWidth) / 2
    const baseTranslate = centerOffset - activeIndex * (cardWidth + cardGap)
    return baseTranslate + dragOffset
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-5 lg:py-10 overflow-hidden scroll-mt-20"
      aria-labelledby="services-heading"
    >
      <Container>
        <FadeInView className="text-center mb-16">
          <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Nos <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Des solutions de cybersécurité complètes adaptées aux besoins des entreprises et organisations.
          </p>
        </FadeInView>
      </Container>

      <div className="relative">
        {/* Carousel */}
        <div
          className="flex cursor-grab active:cursor-grabbing select-none"
          style={{
            transform: `translateX(${getTranslateX()}px)`,
            transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            gap: `${cardGap}px`,
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Shield
            const isActive = index === activeIndex

            return (
              <Card
                key={service.id}
                className={cn(
                  "shrink-0 glass-card transition-all duration-500 relative overflow-hidden",
                  isActive ? "scale-100 opacity-100 border-primary/30" : "scale-95 opacity-50"
                )}
                style={{ width: `${cardWidth}px` }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-primary" />
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Navigation */}
        <Container className="mt-8">
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" onClick={goToPrev} aria-label="Service précédent">
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index)
                    setIsAutoPlaying(false)
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === activeIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                  )}
                  aria-label={`Aller au service ${index + 1}`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={goToNext} aria-label="Service suivant">
              <ChevronRight className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              aria-label={isAutoPlaying ? "Pause" : "Play"}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          </div>
        </Container>
      </div>
    </section>
  )
}
