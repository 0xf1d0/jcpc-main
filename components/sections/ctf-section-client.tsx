"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Flag,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  Terminal,
  Shield,
  MapPin,
  ExternalLink,
} from "lucide-react"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeInView } from "@/components/animations/fade-in-view"
import { cn } from "@/lib/utils"

type PostCategory = "ctf" | "writeup" | "tutorial" | "hardening" | "event" | "news"

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: PostCategory
  tags: string[]
  authorName: string
  publishedAt: Date
  readingTime: number
  featured?: boolean
  difficulty?: "easy" | "medium" | "hard" | null
  ctfName?: string | null
  ctfDate?: Date | null
  ranking?: string | null
  eventDate?: Date | null
  eventLocation?: string | null
  eventUrl?: string | null
}

interface CTFSectionClientProps {
  posts: BlogPost[]
}

const categoryIcons: Record<PostCategory, typeof Flag> = {
  ctf: Flag,
  writeup: BookOpen,
  tutorial: GraduationCap,
  hardening: Shield,
  event: Calendar,
  news: BookOpen,
}

const categoryLabels: Record<PostCategory, string> = {
  ctf: "CTF",
  writeup: "Writeup",
  tutorial: "Tutoriel",
  hardening: "Hardening",
  event: "Événement",
  news: "Actualité",
}

const categoryColors: Record<PostCategory, string> = {
  ctf: "bg-accent/20 text-accent border-accent/30",
  writeup: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  tutorial: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  hardening: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  event: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  news: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
}

const difficultyColors = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  insane: "bg-red-500/20 text-red-400 border-red-500/30",
}

type FilterCategory = "all" | PostCategory

export function CTFSectionClient({ posts }: CTFSectionClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all")

  useEffect(() => {
    const handleFilterEvent = (e: CustomEvent<{ filter: string }>) => {
      const filter = e.detail.filter as FilterCategory
      if (["ctf", "writeup", "tutorial", "hardening", "event"].includes(filter)) {
        setActiveFilter(filter)
      }
    }

    window.addEventListener("journal-filter", handleFilterEvent as EventListener)
    return () => {
      window.removeEventListener("journal-filter", handleFilterEvent as EventListener)
    }
  }, [])

  const filteredPosts =
    activeFilter === "all" ? posts : posts.filter((post) => post.category === activeFilter)

  const upcomingEvents = posts.filter(
    (post) => post.category === "event" && post.eventDate && new Date(post.eventDate) > new Date(),
  ).sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime())

  // Non-event posts for main blog grid
  const blogPosts = filteredPosts.filter((post) => post.category !== "event" || activeFilter === "event")

  return (
    <section id="journal" className="py-10 lg:py-20 scroll-mt-20 relative" aria-labelledby="journal-heading">
      <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/30 to-background pointer-events-none" />

      <Container className="relative z-10">
        <FadeInView className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-primary font-mono">Actualités</span>
          </div>
          <h2 id="journal-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Notre <span className="gradient-text">Journal</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            CTF, writeups, tutoriels de sécurisation et événements cybersécurité.
          </p>
        </FadeInView>

        {/* Filter Tabs */}
        <FadeInView delay={0.2} className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(["all", "ctf", "writeup", "tutorial", "hardening", "event"] as FilterCategory[]).map((filter) => {
              const Icon = filter !== "all" ? categoryIcons[filter] : null
              return (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "transition-all gap-1.5",
                    activeFilter === filter && "bg-accent hover:bg-accent/90 text-accent-foreground",
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {filter === "all" ? "Tout" : categoryLabels[filter]}
                </Button>
              )
            })}
          </div>
        </FadeInView>

        {upcomingEvents.length > 0 && activeFilter !== "event" && (
          <FadeInView delay={0.1} className="mb-12">
            <div className="glass-card rounded-2xl p-6 lg:p-8 border-teal-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="h-6 w-6 text-teal-400" />
                <h3 className="text-xl font-semibold">Agenda</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl bg-background/50 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5"
                  >
                    <p className="font-semibold text-sm mb-2">{event.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.eventDate!).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {event.eventLocation && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        {event.eventLocation}
                      </div>
                    )}
                    {event.eventUrl && (
                      <a
                        href={event.eventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        En savoir plus <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeInView>
        )}

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => {
            const CategoryIcon = categoryIcons[post.category]

            return (
              <FadeInView key={post.id} delay={index * 0.05}>
                <Card
                  className={cn(
                    "h-full glass-card hover:border-accent/30 transition-all duration-300 group",
                    post.featured && "ring-1 ring-accent/20",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                      <Badge variant="outline" className={cn("gap-1", categoryColors[post.category])}>
                        <CategoryIcon className="h-3 w-3" />
                        {categoryLabels[post.category]}
                      </Badge>
                      {post.difficulty && (
                        <Badge variant="outline" className={cn("text-xs", difficultyColors[post.difficulty])}>
                          {post.difficulty}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {post.category === "event" && post.eventDate && (
                      <div className="mb-4 p-3 rounded-lg bg-teal-500/5 border border-teal-500/10">
                        <div className="flex items-center gap-2 text-xs text-teal-400 mb-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.eventDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        {post.eventLocation && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {post.eventLocation}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.publishedAt).toLocaleDateString("fr-FR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime} min
                        </span>
                      </div>
                      {post.ranking && (
                        <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                          {post.ranking}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </FadeInView>
            )
          })}
        </div>

        {/* CTA */}
        <FadeInView delay={0.3} className="mt-12 text-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group border-accent/30 hover:border-accent hover:bg-accent/10 bg-transparent"
          >
            <Link href="/journal">
              Voir tous les articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </FadeInView>
      </Container>
    </section>
  )
}
