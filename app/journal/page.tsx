import { Suspense } from "react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Target,
  FileText,
  Shield,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Filter,
  Star,
  ExternalLink,
} from "lucide-react"
import { JournalFilters } from "@/components/journal/journal-filters"
import type { Metadata } from "next"
import type { Post, Category, Difficulty } from "@/generated/prisma/client"

export const metadata: Metadata = {
  title: "Journal | JCPC",
  description: "Découvrez nos writeups CTF, tutoriels, guides de hardening et actualités cybersécurité.",
}

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

async function getPosts(category?: string): Promise<Post[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        ...(category && category !== "all" ? { category: category as Category } : {}),
      },
      orderBy: [
        { featured: "desc" },
        { publishedAt: "desc" },
      ],
    })
    return posts
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

function PostCard({ post }: { post: Post }) {
  const config = categoryConfig[post.category]
  const Icon = config?.icon || FileText

  return (
    <Link href={`/journal/${post.slug}`}>
      <Card className="h-full group hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={config?.color}>
                <Icon className="w-3 h-3 mr-1" />
                {config?.label}
              </Badge>
              {post.featured && (
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              {post.difficulty && (
                <Badge variant="outline" className={difficultyConfig[post.difficulty]?.color}>
                  {difficultyConfig[post.difficulty]?.label}
                </Badge>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

          {post.category === "ctf" && post.ctfName && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="font-medium text-foreground">{post.ctfName}</span>
              {post.ranking && <Badge variant="outline">{post.ranking}</Badge>}
            </div>
          )}

          {post.category === "event" && post.eventDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.eventDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {post.eventLocation && <span>- {post.eventLocation}</span>}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} min
              </span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function PostsList({ category }: { category?: string }) {
  const posts = await getPosts(category)

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
        <p className="text-muted-foreground">
          {category
            ? `Aucun article dans la catégorie "${categoryConfig[category]?.label || category}"`
            : "Aucun article publié pour le moment"}
        </p>
      </div>
    )
  }

  const featuredPosts = posts.filter((p) => p.featured)
  const regularPosts = posts.filter((p) => !p.featured)

  return (
    <div className="space-y-12">
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent" />
            Articles mis en avant
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {regularPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Tous les articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const category = params.category

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Journal</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Writeups CTF, tutoriels, guides de hardening et actualités cybersécurité par l'équipe JCPC.
            </p>
          </div>

          <div className="mb-8">
            <JournalFilters currentCategory={category} />
          </div>

          <Suspense fallback={<PostsSkeleton />}>
            <PostsList category={category} />
          </Suspense>

          {/* CTF Platform CTA */}
          <div className="mt-16 p-8 rounded-2xl border bg-linear-to-br from-primary/5 via-accent/5 to-primary/5">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Envie de vous entraîner ?</h3>
                <p className="text-muted-foreground">
                  Accédez à notre plateforme CTF avec des challenges variés pour monter en compétences en cybersécurité.
                </p>
              </div>
              <a href="https://ctf.jcpc.fr" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  Accéder à la plateforme CTF
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
