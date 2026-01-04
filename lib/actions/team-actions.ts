"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Validation schema
const teamMemberSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  description: z.string().min(1),
  linkedin: z.string().url().optional().or(z.literal("")),
  photo: z.string().optional(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
})

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>

// Get all team members
export async function getTeamMembers(includeInactive = false) {
  try {
    const members = await prisma.teamMember.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: { order: "asc" },
    })
    return { members, error: null }
  } catch (error) {
    console.error("Failed to fetch team members:", error)
    return { members: [], error: "Failed to fetch team members" }
  }
}

// Get team member by ID
export async function getTeamMemberById(id: string) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
    })
    return { member, error: null }
  } catch (error) {
    console.error("Failed to fetch team member:", error)
    return { member: null, error: "Failed to fetch team member" }
  }
}

// Create team member
export async function createTeamMember(data: TeamMemberFormData) {
  try {
    const validated = teamMemberSchema.parse(data)
    
    // Get max order
    const maxOrder = await prisma.teamMember.aggregate({
      _max: { order: true },
    })
    
    const member = await prisma.teamMember.create({
      data: {
        ...validated,
        linkedin: validated.linkedin || null,
        order: validated.order ?? (maxOrder._max.order ?? 0) + 1,
      },
    })
    
    revalidatePath("/admin/dashboard/team")
    revalidatePath("/")
    return { member, error: null }
  } catch (error) {
    console.error("Failed to create team member:", error)
    if (error instanceof z.ZodError) {
      return { member: null, error: error.errors[0].message }
    }
    return { member: null, error: "Failed to create team member" }
  }
}

// Update team member
export async function updateTeamMember(id: string, data: Partial<TeamMemberFormData>) {
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        ...data,
        linkedin: data.linkedin || null,
      },
    })
    
    revalidatePath("/admin/dashboard/team")
    revalidatePath("/")
    return { member, error: null }
  } catch (error) {
    console.error("Failed to update team member:", error)
    return { member: null, error: "Failed to update team member" }
  }
}

// Delete team member
export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id },
    })
    
    revalidatePath("/admin/dashboard/team")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to delete team member:", error)
    return { success: false, error: "Failed to delete team member" }
  }
}

// Reorder team members
export async function reorderTeamMembers(orderedIds: string[]) {
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.teamMember.update({
          where: { id },
          data: { order: index },
        })
      )
    )
    
    revalidatePath("/admin/dashboard/team")
    revalidatePath("/")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to reorder team members:", error)
    return { success: false, error: "Failed to reorder team members" }
  }
}

// Toggle team member active status
export async function toggleTeamMemberActive(id: string) {
  try {
    const member = await prisma.teamMember.findUnique({ where: { id } })
    if (!member) throw new Error("Team member not found")
    
    const updated = await prisma.teamMember.update({
      where: { id },
      data: { active: !member.active },
    })
    
    revalidatePath("/admin/dashboard/team")
    revalidatePath("/")
    return { member: updated, error: null }
  } catch (error) {
    console.error("Failed to toggle team member:", error)
    return { member: null, error: "Failed to toggle team member" }
  }
}
