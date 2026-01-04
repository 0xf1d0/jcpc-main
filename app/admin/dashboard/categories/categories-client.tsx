"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  FolderOpen, 
  Loader2, 
  Target,
  FileText,
  Shield,
  BookOpen,
  Calendar 
} from "lucide-react"
import type { ArticleCategory } from "@/generated/prisma/client"
import { createCategory, updateCategory, deleteCategory, type CategoryFormData } from "@/lib/actions/category-actions"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  FileText,
  Shield,
  BookOpen,
  Calendar,
}

const availableIcons = ["Target", "FileText", "Shield", "BookOpen", "Calendar"]

const colorOptions = [
  { value: "bg-cyan-500/20 text-cyan-400", label: "Cyan" },
  { value: "bg-purple-500/20 text-purple-400", label: "Purple" },
  { value: "bg-emerald-500/20 text-emerald-400", label: "Emerald" },
  { value: "bg-amber-500/20 text-amber-400", label: "Amber" },
  { value: "bg-pink-500/20 text-pink-400", label: "Pink" },
]

interface CategoryFormProps {
  category?: ArticleCategory | null
  onSuccess: () => void
}

function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedColor, setSelectedColor] = useState(category?.color || colorOptions[0].value)
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || "Target")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data: CategoryFormData = {
      slug: formData.get("slug") as string,
      label: formData.get("label") as string,
      description: formData.get("description") as string || undefined,
      color: selectedColor,
      icon: selectedIcon,
    }

    startTransition(async () => {
      const result = category 
        ? await updateCategory(category.id, data)
        : await createCategory(data)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(category ? "Catégorie mise à jour" : "Catégorie créée")
        router.refresh()
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="label">Nom</Label>
          <Input 
            id="label" 
            name="label" 
            defaultValue={category?.label} 
            placeholder="CTF, Writeup, etc."
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            name="slug" 
            defaultValue={category?.slug} 
            placeholder="ctf"
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optionnel)</Label>
        <Input 
          id="description" 
          name="description" 
          defaultValue={category?.description || ""} 
          placeholder="Description de la catégorie..."
        />
      </div>

      <div className="space-y-2">
        <Label>Icône</Label>
        <div className="flex gap-2">
          {availableIcons.map((iconName) => {
            const Icon = iconMap[iconName]
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setSelectedIcon(iconName)}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                  selectedIcon === iconName
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Couleur</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className={`px-3 py-1 rounded-lg border transition-all ${color.value} ${
                selectedColor === color.value ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              {color.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Label className="text-muted-foreground">Prévisualisation</Label>
        <div className="mt-2">
          <Badge className={selectedColor}>
            {category?.label || "Nouvelle catégorie"}
          </Badge>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {category ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  )
}

interface CategoriesClientProps {
  initialCategories: ArticleCategory[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ArticleCategory | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Catégorie supprimée")
        router.refresh()
      }
    })
  }

  const closeDialog = () => {
    setEditingCategory(null)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Gérez les catégories d&apos;articles du journal.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Créer une catégorie"}</DialogTitle>
              <DialogDescription>
                Les catégories organisent les articles du journal.
              </DialogDescription>
            </DialogHeader>
            <CategoryForm category={editingCategory} onSuccess={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {initialCategories.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Aucune catégorie configurée</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre première catégorie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {initialCategories.map((category) => {
            const Icon = iconMap[category.icon || "FolderOpen"] || FolderOpen
            return (
              <Card 
                key={category.id}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color.split(" ")[0]}`}>
                        <Icon className={`w-5 h-5 ${category.color.split(" ")[1]}`} />
                      </div>
                      <div>
                        <Badge className={category.color}>
                          {category.label}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">/{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingCategory(category)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
