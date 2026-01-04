"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const tagSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  color: z.string().optional(),
})

export type TagFormData = z.infer<typeof tagSchema>

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// Get all tags
export async function getTags() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    })
    return { tags, error: null }
  } catch (error) {
    console.error("Failed to fetch tags:", error)
    return { tags: [], error: "Failed to fetch tags" }
  }
}

// Get tag by ID
export async function getTagById(id: string) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id },
    })
    return { tag, error: null }
  } catch (error) {
    console.error("Failed to fetch tag:", error)
    return { tag: null, error: "Failed to fetch tag" }
  }
}

// Create tag
export async function createTag(data: TagFormData) {
  try {
    const validated = tagSchema.parse(data)
    const slug = validated.slug || generateSlug(validated.name)
    
    const tag = await prisma.tag.create({
      data: {
        name: validated.name,
        slug,
        color: validated.color,
      },
    })
    
    revalidatePath("/admin/dashboard/tags")
    return { tag, error: null }
  } catch (error) {
    console.error("Failed to create tag:", error)
    if (error instanceof z.ZodError) {
      return { tag: null, error: error.errors[0].message }
    }
    return { tag: null, error: "Failed to create tag" }
  }
}

// Update tag
export async function updateTag(id: string, data: Partial<TagFormData>) {
  try {
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...data,
        slug: data.name ? generateSlug(data.name) : undefined,
      },
    })
    
    revalidatePath("/admin/dashboard/tags")
    return { tag, error: null }
  } catch (error) {
    console.error("Failed to update tag:", error)
    return { tag: null, error: "Failed to update tag" }
  }
}

// Delete tag
export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({
      where: { id },
    })
    
    revalidatePath("/admin/dashboard/tags")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to delete tag:", error)
    return { success: false, error: "Failed to delete tag" }
  }
}

// Batch create tags
export async function createTags(names: string[]) {
  try {
    const tagsData = names.map((name) => ({
      name,
      slug: generateSlug(name),
    }))
    
    const result = await prisma.tag.createMany({
      data: tagsData,
      skipDuplicates: true,
    })
    
    revalidatePath("/admin/dashboard/tags")
    return { count: result.count, error: null }
  } catch (error) {
    console.error("Failed to create tags:", error)
    return { count: 0, error: "Failed to create tags" }
  }
}
