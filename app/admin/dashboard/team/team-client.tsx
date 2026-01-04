"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Pencil, Trash2, Linkedin, Loader2, Users, Upload, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TeamMember } from "@/generated/prisma/client"
import { 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember, 
  toggleTeamMemberActive,
  type TeamMemberFormData 
} from "@/lib/actions/team-actions"

interface TeamFormProps {
  member?: TeamMember | null
  onSuccess: () => void
}

function TeamForm({ member, onSuccess }: TeamFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [photoPreview, setPhotoPreview] = useState<string | null>(member?.photo || null)
  const [photoBase64, setPhotoBase64] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image")
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setPhotoPreview(base64)
      setPhotoBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setPhotoPreview(null)
    setPhotoBase64(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data: TeamMemberFormData = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      linkedin: formData.get("linkedin") as string || "",
      photo: photoBase64 || (photoPreview !== member?.photo ? null : member?.photo) || undefined,
    }

    startTransition(async () => {
      const result = member 
        ? await updateTeamMember(member.id, data)
        : await createTeamMember(data)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(member ? "Membre mis à jour" : "Membre ajouté")
        router.refresh()
        onSuccess()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Upload */}
      <div className="space-y-2">
        <Label>Photo de profil</Label>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-2 ring-border">
            {photoPreview ? (
              <>
                <Image
                  src={photoPreview}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-0 right-0 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {photoPreview ? "Changer" : "Uploader"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG ou WebP. Max 2 Mo.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={member?.name} 
          placeholder="John Doe"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle</Label>
        <Input 
          id="role" 
          name="role" 
          defaultValue={member?.role} 
          placeholder="Président, Développeur, etc."
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          defaultValue={member?.description} 
          placeholder="Description du rôle..."
          rows={2}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn (optionnel)</Label>
        <Input 
          id="linkedin" 
          name="linkedin" 
          type="url"
          defaultValue={member?.linkedin || ""} 
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {member ? "Mettre à jour" : "Ajouter"}
        </Button>
      </div>
    </form>
  )
}

interface TeamClientProps {
  initialMembers: TeamMember[]
}

export function TeamClient({ initialMembers }: TeamClientProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTeamMember(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Membre supprimé")
        router.refresh()
      }
    })
  }

  const handleToggleActive = (id: string) => {
    startTransition(async () => {
      const result = await toggleTeamMemberActive(id)
      if (result.error) {
        toast.error(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const closeDialog = () => {
    setEditingMember(null)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Gérez les membres de l&apos;équipe affichés sur le site.
        </p>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMember ? "Modifier le membre" : "Ajouter un membre"}
              </DialogTitle>
              <DialogDescription>
                {editingMember 
                  ? "Modifiez les informations du membre." 
                  : "Ajoutez un nouveau membre à l'équipe."}
              </DialogDescription>
            </DialogHeader>
            <TeamForm member={editingMember} onSuccess={closeDialog} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Grid */}
      {initialMembers.length === 0 ? (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">Aucun membre configuré</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un membre
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {initialMembers.map((member) => (
            <Card 
              key={member.id} 
              className={cn(
                "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm text-center transition-all hover:border-primary/30",
                !member.active && "opacity-60"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Switch
                    checked={member.active}
                    onCheckedChange={() => handleToggleActive(member.id)}
                    disabled={isPending}
                  />
                </div>
                <div className="mx-auto mb-3">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-lg shadow-cyan-500/25 ring-2 ring-primary/20">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="font-medium text-primary">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {member.description}
                </p>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-primary/10 transition-colors mb-4"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingMember(member)
                      setDialogOpen(true)
                    }}
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
                        <AlertDialogTitle>Supprimer ce membre ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(member.id)}
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
          ))}
        </div>
      )}
    </div>
  )
}
