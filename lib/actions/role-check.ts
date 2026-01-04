"use server"

import { getSession } from "@/lib/auth"
import { AdminRole } from "@/generated/prisma/client"

type AllowedRoles = AdminRole | AdminRole[]

/**
 * Check if the current user has the required role
 * @param allowedRoles - Single role or array of roles that are allowed
 * @returns { authorized: boolean, role: AdminRole | null, error: string | null }
 */
export async function checkRole(allowedRoles: AllowedRoles) {
  const session = await getSession()
  
  if (!session) {
    return { authorized: false, role: null, error: "Non authentifié" }
  }
  
  const userRole = session.admin.role as AdminRole
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  
  // SUPER_ADMIN has access to everything
  if (userRole === AdminRole.SUPER_ADMIN) {
    return { authorized: true, role: userRole, error: null }
  }
  
  // Check if user's role is in the allowed roles
  if (roles.includes(userRole)) {
    return { authorized: true, role: userRole, error: null }
  }
  
  return { authorized: false, role: userRole, error: "Accès non autorisé" }
}

/**
 * Check if current user is SUPER_ADMIN
 */
export async function requireSuperAdmin() {
  return checkRole(AdminRole.SUPER_ADMIN)
}

/**
 * Check if current user can manage blog content (EDITOR or SUPER_ADMIN)
 */
export async function requireEditor() {
  return checkRole([AdminRole.EDITOR, AdminRole.SUPER_ADMIN])
}
