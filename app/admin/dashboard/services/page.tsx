import { prisma } from "@/lib/prisma"
import { ServicesClient } from "./services-client"
import { SERVICES } from "@/lib/constants"

export const dynamic = "force-dynamic"

export default async function ServicesPage() {
  let services = []
  
  try {
    services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch services:", error)
    // Fallback: show message about database
  }

  // If no services in DB, show info about seeding
  const showSeedInfo = services.length === 0

  return (
    <div className="space-y-6">
      {showSeedInfo && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <p className="text-sm">
            <strong>Info:</strong> Aucun service en base de données. Les services sont actuellement chargés depuis <code className="bg-muted px-1 rounded">lib/constants.ts</code>. 
            Créez des services ici pour les gérer dynamiquement.
          </p>
        </div>
      )}
      <ServicesClient initialServices={services} />
    </div>
  )
}
