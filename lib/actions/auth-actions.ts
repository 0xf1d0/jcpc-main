"use server"

import { redirect } from "next/navigation"
import { validateAdmin, createSession, deleteSession, getSession } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export type LoginState = {
  error?: string
  success?: boolean
}

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const result = loginSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  const admin = await validateAdmin(result.data.email, result.data.password)

  if (!admin) {
    return { error: "Email ou mot de passe incorrect" }
  }

  await createSession(admin.id)
  redirect("/admin/dashboard")
}

export async function logoutAction() {
  await deleteSession()
  redirect("/admin")
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/admin")
  }

  return session
}
