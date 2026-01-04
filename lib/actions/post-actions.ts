"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { z } from "zod"
import type { Category, Difficulty } from "@/generated/prisma/client"

const postSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z
    .string()
    .min(1, "Le slug est requis")
    .regex(/^[a-z0-9-]+$/, "Slug invalide"),
  excerpt: z.string().min(1, "L'extrait est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  category: z.enum(["ctf", "writeup", "hardening", "tutorial", "event"]),
  tags: z.string(),
  readingTime: z.coerce.number().min(1),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  ctfName: z.string().optional(),
  ctfDate: z.string().optional(),
  ranking: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().nullable(),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  eventUrl: z.string().optional(),
})

export type PostState = {
  error?: string
  success?: boolean
  postId?: string
}

export async function createPostAction(prevState: PostState, formData: FormData): Promise<PostState> {
  const session = await getSession()
  if (!session) {
    return { error: "Non autorisé" }
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    readingTime: formData.get("readingTime"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    ctfName: formData.get("ctfName") || undefined,
    ctfDate: formData.get("ctfDate") || undefined,
    ranking: formData.get("ranking") || undefined,
    difficulty: formData.get("difficulty") || null,
    eventDate: formData.get("eventDate") || undefined,
    eventLocation: formData.get("eventLocation") || undefined,
    eventUrl: formData.get("eventUrl") || undefined,
  }

  const result = postSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const existingPost = await prisma.post.findUnique({ where: { slug: result.data.slug } })
  if (existingPost) {
    return { error: "Un article avec ce slug existe déjà" }
  }

  const post = await prisma.post.create({
    data: {
      title: result.data.title,
      slug: result.data.slug,
      excerpt: result.data.excerpt,
      content: result.data.content,
      category: result.data.category as Category,
      tags: result.data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      readingTime: result.data.readingTime,
      featured: result.data.featured ?? false,
      published: result.data.published ?? false,
      authorId: session.admin.id,
      authorName: session.admin.name,
      ctfName: result.data.ctfName,
      ctfDate: result.data.ctfDate ? new Date(result.data.ctfDate) : null,
      ranking: result.data.ranking,
      difficulty: result.data.difficulty as Difficulty | null,
      eventDate: result.data.eventDate ? new Date(result.data.eventDate) : null,
      eventLocation: result.data.eventLocation,
      eventUrl: result.data.eventUrl,
    },
  })

  revalidatePath("/journal")
  revalidatePath("/admin/dashboard")

  return { success: true, postId: post.id }
}

export async function updatePostAction(postId: string, prevState: PostState, formData: FormData): Promise<PostState> {
  const session = await getSession()
  if (!session) {
    return { error: "Non autorisé" }
  }

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    tags: formData.get("tags"),
    readingTime: formData.get("readingTime"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    ctfName: formData.get("ctfName") || undefined,
    ctfDate: formData.get("ctfDate") || undefined,
    ranking: formData.get("ranking") || undefined,
    difficulty: formData.get("difficulty") || null,
    eventDate: formData.get("eventDate") || undefined,
    eventLocation: formData.get("eventLocation") || undefined,
    eventUrl: formData.get("eventUrl") || undefined,
  }

  const result = postSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const existingPost = await prisma.post.findFirst({
    where: { slug: result.data.slug, NOT: { id: postId } },
  })
  if (existingPost) {
    return { error: "Un autre article avec ce slug existe déjà" }
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: result.data.title,
      slug: result.data.slug,
      excerpt: result.data.excerpt,
      content: result.data.content,
      category: result.data.category as Category,
      tags: result.data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      readingTime: result.data.readingTime,
      featured: result.data.featured ?? false,
      published: result.data.published ?? false,
      ctfName: result.data.ctfName,
      ctfDate: result.data.ctfDate ? new Date(result.data.ctfDate) : null,
      ranking: result.data.ranking,
      difficulty: result.data.difficulty as Difficulty | null,
      eventDate: result.data.eventDate ? new Date(result.data.eventDate) : null,
      eventLocation: result.data.eventLocation,
      eventUrl: result.data.eventUrl,
    },
  })

  revalidatePath("/journal")
  revalidatePath("/admin/dashboard")

  return { success: true, postId }
}

export async function deletePostAction(postId: string): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession()
  if (!session) {
    return { error: "Non autorisé" }
  }

  await prisma.post.delete({ where: { id: postId } })

  revalidatePath("/journal")
  revalidatePath("/admin/dashboard")

  return { success: true }
}

export async function togglePublishAction(
  postId: string,
  published: boolean,
): Promise<{ error?: string; success?: boolean }> {
  const session = await getSession()
  if (!session) {
    return { error: "Non autorisé" }
  }

  await prisma.post.update({
    where: { id: postId },
    data: { published },
  })

  revalidatePath("/journal")
  revalidatePath("/admin/dashboard")

  return { success: true }
}
