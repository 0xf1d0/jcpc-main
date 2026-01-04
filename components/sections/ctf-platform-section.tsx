"use client"

import { ExternalLink, Trophy, Target, Users, Zap, ChevronRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FadeInView } from "@/components/animations/fade-in-view"

const platformFeatures = [
  {
    icon: Target,
    title: "Challenges variés",
    description: "Web, Crypto, Forensics, Reverse, Pwn, OSINT et plus encore",
  },
  {
    icon: Trophy,
    title: "Classement",
    description: "Progressez et comparez-vous aux autres étudiants",
  },
  {
    icon: Users,
    title: "Communauté",
    description: "Échangez avec d'autres passionnés de cybersécurité",
  },
  {
    icon: Zap,
    title: "Apprentissage",
    description: "Montez en compétences à votre rythme",
  },
]

export function CTFPlatformSection() {
  return (
    <section
      id="ctf-platform"
      className="py-10 lg:py-20 scroll-mt-20 relative overflow-hidden"
      aria-labelledby="ctf-platform-heading"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <FadeInView direction="left">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Target className="h-4 w-4 text-primary" />
                Plateforme d'entraînement
              </div>

              <h2 id="ctf-platform-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                Une plateforme CTF <span className="gradient-text">dédiée aux étudiants</span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Développez vos compétences en cybersécurité grâce à notre plateforme de Capture The Flag, accessible
                exclusivement aux étudiants et étudiantes de l'Université Paris Cité.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-linear-to-r hover:opacity-90 transition-opacity text-primary-foreground"
                >
                  <a
                    href="https://ctf.jcpc.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Accéder à la plateforme
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="#journal" className="inline-flex items-center gap-2">
                    Voir nos writeups
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </FadeInView>

          {/* Right side - Features grid */}
          <FadeInView direction="right" delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {platformFeatures.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="glass-card hover:border-primary/30 transition-all duration-300 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeInView>
        </div>
      </Container>
    </section>
  )
}
