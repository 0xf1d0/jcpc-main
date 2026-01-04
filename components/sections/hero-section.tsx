"use client"

import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { FadeInView } from "@/components/animations/fade-in-view"
import { SITE_CONFIG } from "@/lib/constants"

export function HeroSection() {
  return (
    <section
      className="relative min-h-svh lg:min-h-screen flex items-start justify-center overflow-hidden pt-12 sm:pt-16 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-linear-to-b from-sky-400/10 via-sky-300/5 to-background pointer-events-none z-10" />
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-400/5 to-transparent pointer-events-none z-10" />

      <Container className="relative z-20 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeInView delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 lg:mb-8">
              <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-primary">Junior-Entreprise de Cybersécurité</span>
            </div>
          </FadeInView>

          <FadeInView delay={0.2}>
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 lg:mb-8 text-balance"
            >
              Sécurisez votre entreprise avec <span className="gradient-text">{SITE_CONFIG.name}</span>
            </h1>
          </FadeInView>

          <FadeInView delay={0.3}>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed text-pretty">
              Expertise en cybersécurité accessible aux TPE/PME. Audits, tests d&apos;intrusion et formations par des
              étudiants passionnés de l&apos;Université Paris Cité.
            </p>
          </FadeInView>

          <FadeInView delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto group text-base px-8 py-6">
                <Link href="#contact">
                  Demander un devis
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent text-base px-8 py-6 text-foreground border-foreground/20 hover:bg-accent hover:text-accent-foreground hover:border-accent"
              >
                <Link href="#services">Découvrir nos services</Link>
              </Button>
            </div>
          </FadeInView>
        </div>
      </Container>
    </section>
  )
}
