"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Target, FileText, Shield, BookOpen, Calendar, LayoutGrid } from "lucide-react"

const categories = [
  { value: "all", label: "Tous", icon: LayoutGrid },
  { value: "ctf", label: "CTF", icon: Target },
  { value: "writeup", label: "Writeups", icon: FileText },
  { value: "hardening", label: "Hardening", icon: Shield },
  { value: "tutorial", label: "Tutoriels", icon: BookOpen },
  { value: "event", label: "Événements", icon: Calendar },
]

interface JournalFiltersProps {
  currentCategory?: string
}

export function JournalFilters({ currentCategory }: JournalFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/journal?${params.toString()}`)
  }

  const activeCategory = currentCategory || "all"

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const Icon = cat.icon
        const isActive = activeCategory === cat.value

        return (
          <Button
            key={cat.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat.value)}
            className={!isActive ? "bg-transparent" : ""}
          >
            <Icon className="w-4 h-4 mr-2" />
            {cat.label}
          </Button>
        )
      })}
    </div>
  )
}
