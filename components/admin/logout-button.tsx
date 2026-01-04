"use client"

import { logoutAction } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <Button variant="ghost" size="sm" className={cn(className)}>
        <LogOut className="w-4 h-4 mr-2" />
        Déconnexion
      </Button>
    </form>
  )
}
