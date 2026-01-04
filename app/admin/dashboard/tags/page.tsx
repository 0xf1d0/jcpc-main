import { prisma } from "@/lib/prisma"
import { TagsClient } from "./tags-client"

export const dynamic = "force-dynamic"

export default async function TagsPage() {
  let tags = []
  
  try {
    tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch tags:", error)
  }

  return <TagsClient initialTags={tags} />
}
