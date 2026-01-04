import { prisma } from "@/lib/prisma"
import { HeaderClient, type ServiceNavItem, type CategoryNavItem } from "./header-client"

export async function Header() {
  let services: ServiceNavItem[] = []
  let categories: CategoryNavItem[] = []

  try {
    // Fetch active services
    const dbServices = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        icon: true,
      },
    })
    services = dbServices

    // Fetch article categories
    const dbCategories = await prisma.articleCategory.findMany({
      orderBy: { order: "asc" },
      select: {
        slug: true,
        label: true,
        description: true,
        icon: true,
      },
    })
    categories = dbCategories
  } catch (error) {
    console.error("Failed to fetch navigation data:", error)
  }

  return <HeaderClient services={services} categories={categories} />
}
