import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export const dynamic = "force-dynamic"

import { PostEditor } from "@/components/admin/post-editor"

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const session = await getSession()

  if (!session) {
    redirect("/admin")
  }

  const params = await searchParams
  const defaultCategory = params.category || "ctf"

  return (
    <div className="min-h-screen bg-background">
      <PostEditor defaultCategory={defaultCategory} />
    </div>
  )
}
