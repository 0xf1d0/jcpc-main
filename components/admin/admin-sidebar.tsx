"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Hash,
  FolderOpen,
  BarChart3,
  FileText,
  Mail,
  Settings,
  ChevronLeft,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Articles", href: "/admin/dashboard", icon: FileText, badge: "Journal" },
  { name: "Services", href: "/admin/dashboard/services", icon: Briefcase },
  { name: "Équipe", href: "/admin/dashboard/team", icon: Users },
  { name: "Tags", href: "/admin/dashboard/tags", icon: Hash },
  { name: "Catégories", href: "/admin/dashboard/categories", icon: FolderOpen },
  { name: "Statistiques", href: "/admin/dashboard/stats", icon: BarChart3 },
  { name: "Messages", href: "/admin/dashboard/messages", icon: Mail },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300",
          "bg-card/95 backdrop-blur-xl border-r border-border/50",
          "flex flex-col",
          collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64",
          "lg:sticky lg:top-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <svg viewBox="0 0 100 100" className="w-6 h-6" fill="white">
                  <path d="M50 5L95 85H75L50 40L25 85H5L50 5Z" opacity="0.9" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  JCPC
                </span>
                <span className="text-[10px] text-muted-foreground -mt-1">Administration</span>
              </div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                      "group relative overflow-hidden",
                      isActive
                        ? "bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-primary border border-cyan-500/30"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setCollapsed(true)}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 to-transparent" />
                    )}
                    <Icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-cyan-400" : "group-hover:text-primary"
                    )} />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.name}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50">
          <Link
            href="/admin/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
              "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span className="font-medium text-sm">Paramètres</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
