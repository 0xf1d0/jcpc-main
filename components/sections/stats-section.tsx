import { Container } from "@/components/ui/container"
import { FadeInView } from "@/components/animations/fade-in-view"
import { StatsCounter } from "./stats-counter"
import { getStats } from "@/lib/data"

export async function StatsSection() {
  const stats = await getStats()

  if (stats.length === 0) {
    return null // Don't render if no stats in database
  }

  return (
    <section className="py-10 lg:py-20" aria-label="Statistiques JCPC">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <FadeInView key={stat.id} delay={index * 0.1} className="text-center">
              <div className="space-y-2">
                <p className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text">
                  <StatsCounter value={stat.value} suffix={stat.suffix || ""} />
                </p>
                <p className="text-sm sm:text-base text-muted-foreground">{stat.label}</p>
              </div>
            </FadeInView>
          ))}
        </div>
      </Container>
    </section>
  )
}
