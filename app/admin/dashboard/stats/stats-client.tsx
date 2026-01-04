"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, BarChart3, Loader2, TrendingUp } from "lucide-react"
import type { SiteStat } from "@/generated/prisma/client"
import { createStat, updateStat, deleteStat, type StatFormData } from "@/lib/actions/stat-actions"

interface StatFormProps {
  stat?: SiteStat | null
  onSuccess: () => void
}

function StatForm({ stat, onSuccess }: StatFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data: StatFormData = {
      key: formData.get("key") as string,
      value: parseInt(formData.get("value") as string, 10),
      suffix: formData.get("suffix") as string || undefined,
      label: formData.get("label") as string,
    }

    startTransition(async () => {
      const result = stat 
        ? await updateStat(stat.id, data)
        : await createStat(data)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(stat ? "Statistique mise à jour" : "Statistique créée")
        router.refresh()
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Clé unique</Label>
          <Input 
            id="key" 
            name="key" 
            defaultValue={stat?.key} 
            placeholder="missions, members, etc."
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Valeur</Label>
          <Input 
            id="value" 
            name="value" 
            type="number"
            defaultValue={stat?.value} 
            placeholder="15"
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="suffix">Suffixe (optionnel)</Label>
          <Input 
            id="suffix" 
            name="suffix" 
            defaultValue={stat?.suffix || ""} 
            placeholder="+, %, etc."
            maxLength={10}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Label affiché</Label>
          <Input 
            id="label" 
            name="label" 
            defaultValue={stat?.label} 
            placeholder="Missions réalisées"
            required 
          />
        </div>
      </div>

      <div className="pt-2">
        <Label className="text-muted-foreground">Prévisualisation</Label>
        <div className="mt-2 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-3xl font-bold">
            {stat?.value || 0}
            <span className="text-primary">{stat?.suffix || "+"}</span>
          </p>
          <p className="text-sm text-muted-foreground">{stat?.label || "Label"}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {stat ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  )
}

interface StatsClientProps {
  initialStats: SiteStat[]
}

export function StatsClient({ initialStats }: StatsClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<SiteStat | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteStat(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Statistique supprimée")
        router.refresh()
      }
    })
  }

  const closeDialog = () => {
    setEditingStat(null)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Modifiez les statistiques affichées sur la page d&apos;accueil.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStat(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle statistique
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingStat ? "Modifier la statistique" : "Créer une statistique"}</DialogTitle>
              <DialogDescription>
                Ces statistiques sont affichées sur la page d&apos;accueil.
              </DialogDescription>
            </DialogHeader>
            <StatForm stat={editingStat} onSuccess={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      {initialStats.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Aucune statistique configurée</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une statistique
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {initialStats.map((stat) => (
            <Card 
              key={stat.id}
              className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group"
            >
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-blue-500/5" />
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingStat(stat)
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
                          <AlertDialogTitle>Supprimer cette statistique ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(stat.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-3xl font-bold">
                  {stat.value}
                  <span className="text-primary">{stat.suffix}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-2 font-mono">
                  key: {stat.key}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
