"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const categorySchema = z.object({
  slug: z.string().min(1).max(100),
  label: z.string().min(1).max(200),
  description: z.string().optional(),
  color: z.string().min(1),
  icon: z.string().optional(),
  order: z.number().int().optional(),
})

export type CategoryFormData = z.infer<typeof categorySchema>

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.articleCategory.findMany({
      orderBy: { order: "asc" },
    })
    return { categories, error: null }
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return { categories: [], error: "Failed to fetch categories" }
  }
}

// Get category by ID
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.articleCategory.findUnique({
      where: { id },
    })
    return { category, error: null }
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return { category: null, error: "Failed to fetch category" }
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.articleCategory.findUnique({
      where: { slug },
    })
    return { category, error: null }
  } catch (error) {
    console.error("Failed to fetch category:", error)
    return { category: null, error: "Failed to fetch category" }
  }
}

// Create category
export async function createCategory(data: CategoryFormData) {
  try {
    const validated = categorySchema.parse(data)
    
    // Get max order
    const maxOrder = await prisma.articleCategory.aggregate({
      _max: { order: true },
    })
    
    const category = await prisma.articleCategory.create({
      data: {
        ...validated,
        order: validated.order ?? (maxOrder._max.order ?? 0) + 1,
      },
    })
    
    revalidatePath("/admin/dashboard/categories")
    return { category, error: null }
  } catch (error) {
    console.error("Failed to create category:", error)
    if (error instanceof z.ZodError) {
      return { category: null, error: error.errors[0].message }
    }
    return { category: null, error: "Failed to create category" }
  }
}

// Update category
export async function updateCategory(id: string, data: Partial<CategoryFormData>) {
  try {
    const category = await prisma.articleCategory.update({
      where: { id },
      data,
    })
    
    revalidatePath("/admin/dashboard/categories")
    return { category, error: null }
  } catch (error) {
    console.error("Failed to update category:", error)
    return { category: null, error: "Failed to update category" }
  }
}

// Delete category
export async function deleteCategory(id: string) {
  try {
    await prisma.articleCategory.delete({
      where: { id },
    })
    
    revalidatePath("/admin/dashboard/categories")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to delete category:", error)
    return { success: false, error: "Failed to delete category" }
  }
}

// Reorder categories
export async function reorderCategories(orderedIds: string[]) {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.articleCategory.update({
          where: { id },
          data: { order: index },
        })
      )
    )
    
    revalidatePath("/admin/dashboard/categories")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to reorder categories:", error)
    return { success: false, error: "Failed to reorder categories" }
  }
}

// Seed default categories
export async function seedDefaultCategories() {
  const defaultCategories = [
    { slug: "ctf", label: "CTF", color: "bg-cyan-500/20 text-cyan-400", icon: "Target" },
    { slug: "writeup", label: "Writeup", color: "bg-purple-500/20 text-purple-400", icon: "FileText" },
    { slug: "hardening", label: "Hardening", color: "bg-emerald-500/20 text-emerald-400", icon: "Shield" },
    { slug: "tutorial", label: "Tutoriel", color: "bg-amber-500/20 text-amber-400", icon: "BookOpen" },
    { slug: "event", label: "Événement", color: "bg-pink-500/20 text-pink-400", icon: "Calendar" },
  ]

  try {
    for (let i = 0; i < defaultCategories.length; i++) {
      const cat = defaultCategories[i]
      await prisma.articleCategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: { ...cat, order: i },
      })
    }
    
    revalidatePath("/admin/dashboard/categories")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to seed categories:", error)
    return { success: false, error: "Failed to seed categories" }
  }
}
