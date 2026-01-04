"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const statSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.number().int(),
  suffix: z.string().max(10).optional(),
  label: z.string().min(1).max(200),
  order: z.number().int().optional(),
})

export type StatFormData = z.infer<typeof statSchema>

// Get all stats
export async function getStats() {
  try {
    const stats = await prisma.siteStat.findMany({
      orderBy: { order: "asc" },
    })
    return { stats, error: null }
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return { stats: [], error: "Failed to fetch stats" }
  }
}

// Get stat by ID
export async function getStatById(id: string) {
  try {
    const stat = await prisma.siteStat.findUnique({
      where: { id },
    })
    return { stat, error: null }
  } catch (error) {
    console.error("Failed to fetch stat:", error)
    return { stat: null, error: "Failed to fetch stat" }
  }
}

// Create stat
export async function createStat(data: StatFormData) {
  try {
    const validated = statSchema.parse(data)
    
    // Get max order
    const maxOrder = await prisma.siteStat.aggregate({
      _max: { order: true },
    })
    
    const stat = await prisma.siteStat.create({
      data: {
        ...validated,
        order: validated.order ?? (maxOrder._max.order ?? 0) + 1,
      },
    })
    
    revalidatePath("/admin/dashboard/stats")
    revalidatePath("/")
    return { stat, error: null }
  } catch (error) {
    console.error("Failed to create stat:", error)
    if (error instanceof z.ZodError) {
      return { stat: null, error: error.errors[0].message }
    }
    return { stat: null, error: "Failed to create stat" }
  }
}

// Update stat
export async function updateStat(id: string, data: Partial<StatFormData>) {
  try {
    const stat = await prisma.siteStat.update({
      where: { id },
      data,
    })
    
    revalidatePath("/admin/dashboard/stats")
    revalidatePath("/")
    return { stat, error: null }
  } catch (error) {
    console.error("Failed to update stat:", error)
    return { stat: null, error: "Failed to update stat" }
  }
}

// Update stat value only (for quick updates)
export async function updateStatValue(key: string, value: number) {
  try {
    const stat = await prisma.siteStat.update({
      where: { key },
      data: { value },
    })
    
    revalidatePath("/admin/dashboard/stats")
    revalidatePath("/")
    return { stat, error: null }
  } catch (error) {
    console.error("Failed to update stat value:", error)
    return { stat: null, error: "Failed to update stat value" }
  }
}

// Delete stat
export async function deleteStat(id: string) {
  try {
    await prisma.siteStat.delete({
      where: { id },
    })
    
    revalidatePath("/admin/dashboard/stats")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to delete stat:", error)
    return { success: false, error: "Failed to delete stat" }
  }
}

// Reorder stats
export async function reorderStats(orderedIds: string[]) {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.siteStat.update({
          where: { id },
          data: { order: index },
        })
      )
    )
    
    revalidatePath("/admin/dashboard/stats")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to reorder stats:", error)
    return { success: false, error: "Failed to reorder stats" }
  }
}

// Seed default stats
export async function seedDefaultStats() {
  const defaultStats = [
    { key: "missions", value: 15, suffix: "+", label: "Missions réalisées" },
    { key: "satisfaction", value: 98, suffix: "%", label: "Clients satisfaits" },
    { key: "members", value: 25, suffix: "+", label: "Membres actifs" },
    { key: "partners", value: 5, suffix: "+", label: "Partenaires" },
  ]

  try {
    for (let i = 0; i < defaultStats.length; i++) {
      const stat = defaultStats[i]
      await prisma.siteStat.upsert({
        where: { key: stat.key },
        update: { value: stat.value },
        create: { ...stat, order: i },
      })
    }
    
    revalidatePath("/admin/dashboard/stats")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to seed stats:", error)
    return { success: false, error: "Failed to seed stats" }
  }
}
