"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schemas
const serviceSchema = z.object({
  slug: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  icon: z.string().min(1),
  features: z.array(z.string()),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>

// Get all services
export async function getServices(includeInactive = false) {
  try {
    const services = await prisma.service.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: { order: "asc" },
    })
    return { services, error: null }
  } catch (error) {
    console.error("Failed to fetch services:", error)
    return { services: [], error: "Failed to fetch services" }
  }
}

// Get service by ID
export async function getServiceById(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    })
    return { service, error: null }
  } catch (error) {
    console.error("Failed to fetch service:", error)
    return { service: null, error: "Failed to fetch service" }
  }
}

// Create service
export async function createService(data: ServiceFormData) {
  try {
    const validated = serviceSchema.parse(data)
    
    // Get max order
    const maxOrder = await prisma.service.aggregate({
      _max: { order: true },
    })
    
    const service = await prisma.service.create({
      data: {
        ...validated,
        order: validated.order ?? (maxOrder._max.order ?? 0) + 1,
      },
    })
    
    revalidatePath("/admin/dashboard/services")
    revalidatePath("/")
    return { service, error: null }
  } catch (error) {
    console.error("Failed to create service:", error)
    if (error instanceof z.ZodError) {
      return { service: null, error: error.errors[0].message }
    }
    return { service: null, error: "Failed to create service" }
  }
}

// Update service
export async function updateService(id: string, data: Partial<ServiceFormData>) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data,
    })
    
    revalidatePath("/admin/dashboard/services")
    revalidatePath("/")
    return { service, error: null }
  } catch (error) {
    console.error("Failed to update service:", error)
    return { service: null, error: "Failed to update service" }
  }
}

// Delete service
export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    })
    
    revalidatePath("/admin/dashboard/services")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to delete service:", error)
    return { success: false, error: "Failed to delete service" }
  }
}

// Reorder services
export async function reorderServices(orderedIds: string[]) {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.service.update({
          where: { id },
          data: { order: index },
        })
      )
    )
    
    revalidatePath("/admin/dashboard/services")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to reorder services:", error)
    return { success: false, error: "Failed to reorder services" }
  }
}

// Toggle service active status
export async function toggleServiceActive(id: string) {
  try {
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) throw new Error("Service not found")
    
    const updated = await prisma.service.update({
      where: { id },
      data: { active: !service.active },
    })
    
    revalidatePath("/admin/dashboard/services")
    revalidatePath("/")
    return { service: updated, error: null }
  } catch (error) {
    console.error("Failed to toggle service:", error)
    return { service: null, error: "Failed to toggle service" }
  }
}
