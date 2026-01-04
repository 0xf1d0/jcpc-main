"use client"

import { useActionState, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createPostAction, updatePostAction, type PostState } from "@/lib/actions/post-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Save, Eye } from "lucide-react"
import type { Post } from "@/generated/prisma/client"

interface PostEditorProps {
  post?: Post
  defaultCategory?: string
}

const categories = [
  { value: "ctf", label: "CTF" },
  { value: "writeup", label: "Writeup" },
  { value: "hardening", label: "Hardening" },
  { value: "tutorial", label: "Tutoriel" },
  { value: "event", label: "Événement" },
]

const difficulties = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
]

export function PostEditor({ post, defaultCategory = "ctf" }: PostEditorProps) {
  const router = useRouter()
  const isEditing = !!post

  const [category, setCategory] = useState(post?.category || defaultCategory)
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")

  const boundAction = isEditing ? updatePostAction.bind(null, post.id) : createPostAction

  const [state, formAction, isPending] = useActionState<PostState, FormData>(boundAction, {})

  useEffect(() => {
    if (state.success && !isEditing) {
      router.push("/admin/dashboard")
    }
  }, [state.success, isEditing, router])

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setSlug(generatedSlug)
    }
  }, [title, isEditing])

  const showCTFFields = category === "ctf"
  const showWriteupFields = category === "writeup" || category === "hardening" || category === "tutorial"
  const showEventFields = category === "event"

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">{isEditing ? "Modifier l'article" : "Nouvel article"}</h1>
          </div>
          <div className="flex items-center gap-2">
            {post?.published && (
              <Link href={`/journal/${post.slug}`} target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Prévisualiser
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form action={formAction} className="space-y-8">
          {state.error && (
            <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {state.success && isEditing && (
            <div className="flex items-center gap-2 p-4 text-sm text-emerald-500 bg-emerald-500/10 rounded-lg">
              Article mis à jour avec succès
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select name="category" value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readingTime">Temps de lecture (min)</Label>
                  <Input
                    id="readingTime"
                    name="readingTime"
                    type="number"
                    min={1}
                    defaultValue={post?.readingTime || 5}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mon super article..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="mon-super-article"
                  required
                />
                <p className="text-xs text-muted-foreground">URL: /journal/{slug || "..."}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={post?.excerpt || ""}
                  placeholder="Courte description de l'article..."
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags.join(", ") || ""}
                  placeholder="Web, SQL Injection, CTF"
                />
              </div>
            </CardContent>
          </Card>

          {showCTFFields && (
            <Card>
              <CardHeader>
                <CardTitle>Informations CTF</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctfName">Nom du CTF</Label>
                    <Input id="ctfName" name="ctfName" defaultValue={post?.ctfName || ""} placeholder="Hack The Box" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctfDate">Date du CTF</Label>
                    <Input
                      id="ctfDate"
                      name="ctfDate"
                      type="date"
                      defaultValue={post?.ctfDate?.toISOString().split("T")[0] || ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ranking">Classement</Label>
                  <Input id="ranking" name="ranking" defaultValue={post?.ranking || ""} placeholder="Top 5%" />
                </div>
              </CardContent>
            </Card>
          )}

          {showWriteupFields && (
            <Card>
              <CardHeader>
                <CardTitle>Difficulté</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Niveau</Label>
                  <Select name="difficulty" defaultValue={post?.difficulty || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((diff) => (
                        <SelectItem key={diff.value} value={diff.value}>
                          {diff.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {showEventFields && (
            <Card>
              <CardHeader>
                <CardTitle>Informations Événement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Date de l'événement</Label>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      defaultValue={post?.eventDate?.toISOString().split("T")[0] || ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventLocation">Lieu</Label>
                    <Input
                      id="eventLocation"
                      name="eventLocation"
                      defaultValue={post?.eventLocation || ""}
                      placeholder="Paris, France"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventUrl">Lien de l'événement</Label>
                  <Input
                    id="eventUrl"
                    name="eventUrl"
                    type="url"
                    defaultValue={post?.eventUrl || ""}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">Contenu (Markdown)</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={post?.content || ""}
                  placeholder="Rédigez votre article en Markdown..."
                  rows={20}
                  className="font-mono text-sm"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Article mis en avant</Label>
                  <p className="text-sm text-muted-foreground">Afficher cet article en premier</p>
                </div>
                <Switch id="featured" name="featured" defaultChecked={post?.featured || false} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Publier l'article</Label>
                  <p className="text-sm text-muted-foreground">Rendre visible sur le site</p>
                </div>
                <Switch id="published" name="published" defaultChecked={post?.published || false} />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" type="button">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer l'article"}
            </Button>
          </div>
        </form>
      </main>
    </>
  )
}
