import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PostEditor } from "@/components/admin/post-editor"

export const dynamic = "force-dynamic"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()

  if (!session) {
    redirect("/admin")
  }

  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <PostEditor post={post} />
    </div>
  )
}
