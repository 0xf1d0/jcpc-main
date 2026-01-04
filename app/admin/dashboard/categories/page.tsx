import { prisma } from "@/lib/prisma"
import { CategoriesClient } from "./categories-client"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
  let categories = []
  
  try {
    categories = await prisma.articleCategory.findMany({
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch categories:", error)
  }

  return <CategoriesClient initialCategories={categories} />
}
