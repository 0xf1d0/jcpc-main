"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  GripVertical,
  Shield,
  Bug,
  Users,
  FileCheck,
  Lock,
  Eye,
  Loader2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Service } from "@/generated/prisma/client"
import { 
  createService, 
  updateService, 
  deleteService, 
  toggleServiceActive,
  type ServiceFormData 
} from "@/lib/actions/service-actions"

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Bug,
  Users,
  FileCheck,
  Lock,
  Eye,
}

const availableIcons = ["Shield", "Bug", "Users", "FileCheck", "Lock", "Eye"]

interface ServiceFormProps {
  service?: Service | null
  onSuccess: () => void
}

function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [features, setFeatures] = useState<string[]>(service?.features || [])
  const [newFeature, setNewFeature] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(service?.icon || "Shield")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data: ServiceFormData = {
      slug: formData.get("slug") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      icon: selectedIcon,
      features: features,
    }

    startTransition(async () => {
      const result = service 
        ? await updateService(service.id, data)
        : await createService(data)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(service ? "Service mis à jour" : "Service créé")
        router.refresh()
        onSuccess()
      }
    })
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input 
            id="title" 
            name="title" 
            defaultValue={service?.title} 
            placeholder="Audit de Sécurité"
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            name="slug" 
            defaultValue={service?.slug} 
            placeholder="audit-securite"
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          defaultValue={service?.description} 
          placeholder="Description du service..."
          rows={3}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label>Icône</Label>
        <div className="flex flex-wrap gap-2">
          {availableIcons.map((iconName) => {
            const Icon = iconMap[iconName]
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setSelectedIcon(iconName)}
                className={cn(
                  "w-12 h-12 rounded-lg border flex items-center justify-center transition-all",
                  selectedIcon === iconName
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Fonctionnalités</Label>
        <div className="flex gap-2">
          <Input 
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Nouvelle fonctionnalité"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
          />
          <Button type="button" onClick={addFeature} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="gap-1 pr-1">
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {service ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  )
}

interface ServicesClientProps {
  initialServices: Service[]
}

export function ServicesClient({ initialServices }: ServicesClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteService(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Service supprimé")
        router.refresh()
      }
    })
  }

  const handleToggleActive = (id: string) => {
    startTransition(async () => {
      const result = await toggleServiceActive(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setEditingService(null)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Gérez les services affichés dans le carousel sur la page d&apos;accueil.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Modifier le service" : "Créer un service"}
              </DialogTitle>
              <DialogDescription>
                {editingService 
                  ? "Modifiez les informations du service." 
                  : "Ajoutez un nouveau service au carousel."}
              </DialogDescription>
            </DialogHeader>
            <ServiceForm service={editingService} onSuccess={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      {initialServices.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Aucun service configuré</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer votre premier service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialServices.map((service) => {
            const Icon = iconMap[service.icon] || Shield
            return (
              <Card 
                key={service.id} 
                className={cn(
                  "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30",
                  !service.active && "opacity-60"
                )}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-cyan-500 to-blue-600" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => handleToggleActive(service.id)}
                        disabled={isPending}
                      />
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-3">{service.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {service.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.features.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le service &quot;{service.title}&quot; sera définitivement supprimé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(service.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
