"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

export async function markContactAsRead(id: string) {
  try {
    await prisma.contact.update({
      where: { id },
      data: { read: true },
    })
    revalidatePath("/admin/dashboard/messages")
    revalidatePath("/admin/dashboard")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to mark contact as read:", error)
    return { success: false, error: "Failed to update contact" }
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    })
    revalidatePath("/admin/dashboard/messages")
    revalidatePath("/admin/dashboard")
    return { success: true, error: null }
  } catch (error) {
    console.error("Failed to delete contact:", error)
    return { success: false, error: "Failed to delete contact" }
  }
}
