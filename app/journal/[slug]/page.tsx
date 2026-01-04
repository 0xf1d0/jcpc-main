import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Target,
  FileText,
  Shield,
  BookOpen,
  MapPin,
  ExternalLink,
  Tag,
} from "lucide-react"
import type { Metadata } from "next"

const categoryConfig: Record<string, { label: string; icon: typeof Target; color: string }> = {
  ctf: { label: "CTF", icon: Target, color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  writeup: { label: "Writeup", icon: FileText, color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  hardening: { label: "Hardening", icon: Shield, color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  tutorial: { label: "Tutoriel", icon: BookOpen, color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  event: { label: "Événement", icon: Calendar, color: "bg-pink-500/20 text-pink-400 border-pink-500/30" },
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: "Facile", color: "bg-emerald-500/20 text-emerald-400" },
  medium: { label: "Moyen", color: "bg-amber-500/20 text-amber-400" },
  hard: { label: "Difficile", color: "bg-red-500/20 text-red-400" },
}

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findFirst({
      where: { slug, published: true },
    })
    return post
  } catch (error) {
    console.error("Failed to fetch post:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: "Article non trouvé | JCPC" }
  }

  return {
    title: `${post.title} | JCPC`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.authorName],
      tags: post.tags,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const config = categoryConfig[post.category]
  const Icon = config?.icon || FileText

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <Container className="max-w-4xl">
          <Link href="/journal">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au journal
            </Button>
          </Link>

          <article>
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="outline" className={config?.color}>
                  <Icon className="w-3 h-3 mr-1" />
                  {config?.label}
                </Badge>
                {post.difficulty && (
                  <Badge variant="outline" className={difficultyConfig[post.difficulty]?.color}>
                    {difficultyConfig[post.difficulty]?.label}
                  </Badge>
                )}
                {post.ranking && <Badge className="bg-accent/20 text-accent border-accent/30">{post.ranking}</Badge>}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">{post.title}</h1>

              <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.authorName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min de lecture
                </span>
              </div>

              {post.category === "ctf" && post.ctfName && (
                <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                  <h3 className="font-semibold mb-2">{post.ctfName}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {post.ctfDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.ctfDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {post.ranking && <span>Classement: {post.ranking}</span>}
                  </div>
                </div>
              )}

              {post.category === "event" && (
                <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                  <div className="flex flex-wrap gap-4 text-sm">
                    {post.eventDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.eventDate).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {post.eventLocation && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {post.eventLocation}
                      </span>
                    )}
                    {post.eventUrl && (
                      <a
                        href={post.eventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Site officiel
                      </a>
                    )}
                  </div>
                </div>
              )}
            </header>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {post.tags.length > 0 && (
              <footer className="mt-12 pt-6 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
