import { prisma } from "@/lib/prisma"
import { TeamClient } from "./team-client"

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  let members = []
  
  try {
    members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    })
  } catch (error) {
    console.error("Failed to fetch team members:", error)
  }

  const showSeedInfo = members.length === 0

  return (
    <div className="space-y-6">
      {showSeedInfo && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <p className="text-sm">
            <strong>Info:</strong> Aucun membre en base de données. Créez des membres ici pour les gérer dynamiquement.
          </p>
        </div>
      )}
      <TeamClient initialMembers={members} />
    </div>
  )
}
