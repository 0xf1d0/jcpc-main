import { prisma } from "@/lib/prisma"
import { StatsClient } from "./stats-client"

export const dynamic = "force-dynamic"

export default async function StatsPage() {
  let stats = []
  
  try {
    stats = await prisma.siteStat.findMany({
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
  }

  const showSeedInfo = stats.length === 0

  return (
    <div className="space-y-6">
      {showSeedInfo && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <p className="text-sm">
            <strong>Info:</strong> Aucune statistique en base de données. Les stats sont actuellement chargées depuis <code className="bg-muted px-1 rounded">lib/constants.ts</code>.
          </p>
        </div>
      )}
      <StatsClient initialStats={stats} />
    </div>
  )
}
