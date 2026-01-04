"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  ChevronDown,
  Flag,
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  FileCheck,
  Bug,
  Lock,
  Eye,
  Shield,
  Newspaper,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SITE_CONFIG } from "@/lib/constants"
import { cn } from "@/lib/utils"

// Service data from Prisma
export interface ServiceNavItem {
  id: string
  slug: string
  title: string
  description: string
  icon: string
}

// Category data from Prisma
export interface CategoryNavItem {
  slug: string
  label: string
  description?: string | null
  icon?: string | null
}

interface DropdownItem {
  href: string
  label: string
  description?: string
  icon?: React.ElementType
}

interface NavItem {
  href: string
  label: string
  dropdown?: DropdownItem[]
}

// Icon maps for dynamic icon resolution
const serviceIconMap: Record<string, React.ElementType> = {
  Shield,
  Bug,
  Users,
  FileCheck,
  Lock,
  Eye,
}

const categoryIconMap: Record<string, React.ElementType> = {
  Target,
  Flag,
  BookOpen,
  GraduationCap,
  Calendar,
  Shield,
  Newspaper,
}

export interface HeaderClientProps {
  services: ServiceNavItem[]
  categories: CategoryNavItem[]
}

function JCPCLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#38bdf8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1d4ed8", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M50 5L95 85H75L50 40L25 85H5L50 5Z" fill="url(#grad1)" opacity="0.9" />
      <path d="M50 40L75 85H35L50 55L65 85H15L50 5L25 50L50 40Z" fill="#0ea5e9" opacity="0.6" />
      <path d="M50 5L95 85H55L50 75L75 75L50 30L35 60L25 50L50 5Z" fill="#1e3a8a" />
    </svg>
  )
}

function DropdownMenu({ items, isOpen, onClose }: { items: DropdownItem[]; isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-200 ease-out",
        isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2",
      )}
    >
      <div className="bg-background/95 backdrop-blur-2xl backdrop-saturate-150 border border-border/20 rounded-2xl shadow-xl shadow-black/5 p-2 min-w-[320px] max-h-[400px] overflow-y-auto ring-1 ring-black/5 dark:ring-white/10">
        {items.map((item) => {
          const Icon = item.icon
          const isServiceLink = item.href.startsWith("/#service-")

          const handleClick = (e: React.MouseEvent) => {
            onClose()
            if (isServiceLink) {
              e.preventDefault()
              const serviceId = item.href.replace("/#service-", "")
              window.history.pushState(null, "", `#service-${serviceId}`)
              window.dispatchEvent(
                new CustomEvent("service-navigation", {
                  detail: { serviceId },
                }),
              )
            }
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-start gap-4 px-4 py-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-accent/10 transition-colors group"
              onClick={handleClick}
            >
              {Icon && (
                <div className="mt-1 p-2 rounded-lg bg-background border border-border/40 shadow-sm group-hover:border-primary/30 group-hover:scale-105 transition-all duration-300">
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              )}
              <div className="flex-1 min-w-0 flex items-center">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.label}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function HeaderClient({ services, categories }: HeaderClientProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Build nav items dynamically from props
  const NAV_ITEMS: NavItem[] = [
    {
      href: "/#services",
      label: "Services",
      dropdown: services.map((service) => ({
        href: `/#service-${service.slug}`,
        label: service.title,
        description: service.description,
        icon: serviceIconMap[service.icon] || Shield,
      })),
    },
    { href: "/#methode", label: "Méthode" },
    {
      href: "/journal",
      label: "Journal",
      dropdown: [
        { href: "/journal", label: "Tous les articles", description: "Voir tout le journal", icon: Newspaper },
        ...categories.map((cat) => ({
          href: `/journal?category=${cat.slug}`,
          label: cat.label,
          description: cat.description || undefined,
          icon: categoryIconMap[cat.icon || "BookOpen"] || BookOpen,
        })),
      ],
    },
    { href: "/#ctf-platform", label: "S'entraîner" },
    { href: "/#equipe", label: "Équipe" },
    { href: "/#contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  const isHomePage = pathname === "/"

  const getHref = (href: string) => {
    if (isHomePage && href.startsWith("/#")) {
      return href.replace("/", "")
    }
    return href
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/60 backdrop-blur-xl backdrop-saturate-150 border-b border-border/10 py-3 shadow-sm"
          : "bg-transparent py-5",
      )}
    >
      <Container>
        <nav className="flex items-center justify-between" aria-label="Navigation principale">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xl font-bold focus-ring rounded-md group"
            aria-label={`${SITE_CONFIG.name} - Accueil`}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <JCPCLogo className="h-9 w-9 relative z-10" aria-hidden="true" />
            </div>
            <span className="gradient-text font-heading tracking-tight">{SITE_CONFIG.name}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={getHref(item.href)}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-all focus-ring rounded-full px-4 py-2",
                      "text-foreground/70 hover:text-foreground hover:bg-accent/5",
                      openDropdown === item.label && "text-foreground bg-accent/5",
                      pathname === item.href.replace("/#", "/") && "text-foreground bg-accent/5 font-semibold",
                    )}
                  >
                    {item.label}
                    {item.dropdown && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 opacity-50",
                          openDropdown === item.label && "rotate-180 opacity-100",
                        )}
                      />
                    )}
                  </Link>
                  {item.dropdown && (
                    <DropdownMenu
                      items={item.dropdown}
                      isOpen={openDropdown === item.label}
                      onClose={() => setOpenDropdown(null)}
                    />
                  )}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 pl-4 border-l border-border/10">
              <ThemeToggle />
              <Button asChild className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                <Link href={isHomePage ? "#contact" : "/#contact"}>Nous contacter</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="bg-background/80 backdrop-blur-2xl backdrop-saturate-150 border border-border/50 rounded-2xl p-4 shadow-xl">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={getHref(item.href)}
                    className="block py-3 px-4 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-xl transition-colors focus-ring"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <ul className="ml-4 mt-1 space-y-1 pl-3 border-l border-border/30">
                      {item.dropdown.map((subItem) => (
                        <li key={subItem.label}>
                          <Link
                            href={subItem.href}
                            className="block py-2.5 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/5 rounded-lg transition-colors"
                            onClick={closeMenu}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="pt-4 mt-2 border-t border-border/10">
                <Button asChild className="w-full rounded-xl">
                  <Link href={isHomePage ? "#contact" : "/#contact"} onClick={closeMenu}>
                    Nous contacter
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </header>
  )
}
