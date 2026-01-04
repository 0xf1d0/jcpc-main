"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Mail, Trash2, Eye, EyeOff, Clock, Building2, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { markContactAsRead, deleteContact } from "@/lib/actions/contact-actions"

interface Contact {
  id: string
  name: string
  email: string
  company: string | null
  subject: string
  message: string
  createdAt: Date
  read: boolean
}

interface MessagesClientProps {
  contacts: Contact[]
}

export function MessagesClient({ contacts: initialContacts }: MessagesClientProps) {
  const [contacts, setContacts] = useState(initialContacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleView = async (contact: Contact) => {
    setSelectedContact(contact)
    if (!contact.read) {
      const result = await markContactAsRead(contact.id)
      if (!result.error) {
        setContacts(contacts.map(c => 
          c.id === contact.id ? { ...c, read: true } : c
        ))
      }
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setLoading(true)
    const result = await deleteContact(deleteId)
    setLoading(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Message supprimé")
      setContacts(contacts.filter(c => c.id !== deleteId))
    }
    setDeleteId(null)
  }

  const unreadCount = contacts.filter(c => !c.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            {contacts.length} message{contacts.length !== 1 ? "s" : ""} 
            {unreadCount > 0 && ` • ${unreadCount} non lu${unreadCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      {/* Messages List */}
      {contacts.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun message pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card 
              key={contact.id} 
              className={cn(
                "glass-card transition-all hover:border-primary/30 cursor-pointer",
                !contact.read && "border-primary/50 bg-primary/5"
              )}
              onClick={() => handleView(contact)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!contact.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                      <CardTitle className="text-lg truncate">{contact.subject}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {contact.name}
                      </span>
                      {contact.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {contact.company}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={contact.read ? "secondary" : "default"}>
                      {contact.read ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteId(contact.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(contact.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedContact?.subject}</DialogTitle>
            <DialogDescription>
              De {selectedContact?.name} ({selectedContact?.email})
              {selectedContact?.company && ` • ${selectedContact.company}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
              {selectedContact?.message}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Reçu le {selectedContact && new Date(selectedContact.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = `mailto:${selectedContact?.email}`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Répondre
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce message ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
