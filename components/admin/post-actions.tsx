"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { deletePostAction, togglePublishAction } from "@/lib/actions/post-actions"
import { MoreHorizontal, Edit, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react"
import type { Post } from "@/generated/prisma/client"

interface PostActionsProps {
  post: Post
}

export function PostActions({ post }: PostActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await deletePostAction(post.id)
    setShowDeleteDialog(false)
    setIsDeleting(false)
  }

  const handleTogglePublish = async () => {
    await togglePublishAction(post.id, !post.published)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/edit/${post.id}`}>
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Link>
          </DropdownMenuItem>
          {post.published && (
            <DropdownMenuItem asChild>
              <Link href={`/journal/${post.slug}`} target="_blank">
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir l'article
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleTogglePublish}>
            {post.published ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Dépublier
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Publier
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'article ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'article "{post.title}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
