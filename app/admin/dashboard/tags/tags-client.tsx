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
import { Plus, Pencil, Trash2, Hash, Loader2 } from "lucide-react"
import type { Tag } from "@/generated/prisma/client"
import { createTag, updateTag, deleteTag, type TagFormData } from "@/lib/actions/tag-actions"

const colorOptions = [
  { value: "#06b6d4", label: "Cyan" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ec4899", label: "Pink" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
]

interface TagFormProps {
  tag?: Tag | null
  onSuccess: () => void
}

function TagForm({ tag, onSuccess }: TagFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [selectedColor, setSelectedColor] = useState(tag?.color || "#06b6d4")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const name = formData.get("name") as string
    const data: TagFormData = {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      color: selectedColor,
    }

    startTransition(async () => {
      const result = tag 
        ? await updateTag(tag.id, data)
        : await createTag(data)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(tag ? "Tag mis à jour" : "Tag créé")
        router.refresh()
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du tag</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={tag?.name} 
          placeholder="SQL Injection, Web, etc."
          required 
        />
      </div>

      <div className="space-y-2">
        <Label>Couleur</Label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setSelectedColor(color.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color.value 
                  ? "border-foreground scale-110" 
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Label className="text-muted-foreground">Prévisualisation</Label>
        <div className="mt-2">
          <Badge 
            style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}
            className="text-sm"
          >
            <Hash className="w-3 h-3 mr-1" />
            {tag?.name || "Nouveau tag"}
          </Badge>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {tag ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  )
}

interface TagsClientProps {
  initialTags: Tag[]
}

export function TagsClient({ initialTags }: TagsClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTag(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Tag supprimé")
        router.refresh()
      }
    })
  }

  const closeDialog = () => {
    setEditingTag(null)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Gérez les tags (hashtags) utilisables dans les articles.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTag(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? "Modifier le tag" : "Créer un tag"}</DialogTitle>
              <DialogDescription>
                Les tags permettent de catégoriser les articles.
              </DialogDescription>
            </DialogHeader>
            <TagForm tag={editingTag} onSuccess={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tags Grid */}
      {initialTags.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Hash className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Aucun tag configuré</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre premier tag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {initialTags.map((tag) => (
                <div 
                  key={tag.id}
                  className="group relative flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <Badge 
                    style={{ 
                      backgroundColor: tag.color ? `${tag.color}20` : undefined, 
                      color: tag.color || undefined 
                    }}
                    className="text-sm"
                  >
                    <Hash className="w-3 h-3 mr-1" />
                    {tag.name}
                  </Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingTag(tag)
                        setDialogOpen(true)
                      }}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer ce tag ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(tag.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
