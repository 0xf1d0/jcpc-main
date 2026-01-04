"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, Moon, Sun, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutButton } from "./logout-button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  admin: {
    name: string
    email: string
    role: string
  }
}

const pageTitles: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": { title: "Dashboard", description: "Vue d'ensemble de l'administration" },
  "/admin/dashboard/services": { title: "Services", description: "Gérez les services affichés sur le site" },
  "/admin/dashboard/team": { title: "Équipe", description: "Gérez les membres de l'équipe" },
  "/admin/dashboard/tags": { title: "Tags", description: "Gérez les hashtags des articles" },
  "/admin/dashboard/categories": { title: "Catégories", description: "Gérez les catégories d'articles" },
  "/admin/dashboard/stats": { title: "Statistiques", description: "Modifiez les statistiques du site" },
  "/admin/dashboard/messages": { title: "Messages", description: "Consultez les messages reçus" },
  "/admin/dashboard/new": { title: "Nouvel article", description: "Créez un nouvel article" },
}

export function AdminHeader({ admin }: AdminHeaderProps) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const pageInfo = pageTitles[pathname] || { 
    title: "Administration", 
    description: "Panneau d'administration JCPC" 
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Page title */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg font-semibold truncate">{pageInfo.title}</h1>
          <p className="text-xs text-muted-foreground truncate hidden sm:block">
            {pageInfo.description}
          </p>
        </div>

        {/* Center: Search (hidden on mobile) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 bg-muted/50 border-transparent focus:border-border"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* View site */}
          <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">Voir le site</span>
            </Link>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucune nouvelle notification
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium">{admin.name}</span>
                  <span className="text-[10px] text-muted-foreground">{admin.role}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{admin.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{admin.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/dashboard/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" target="_blank">
                  Voir le site
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutButton className="w-full justify-start cursor-pointer" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
