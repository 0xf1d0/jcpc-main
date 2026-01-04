import { MessageSquare, FileText, Cog, CheckCircle } from "lucide-react"
import { Container } from "@/components/ui/container"
import { FadeInView } from "@/components/animations/fade-in-view"
import { getMethodSteps } from "@/lib/data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  FileText,
  Cog,
  CheckCircle,
}

export async function MethodSection() {
  const steps = await getMethodSteps()

  if (steps.length === 0) {
    return null // Don't render if no method steps in database
  }

  return (
    <section id="methode" className="py-10 lg:py-20 bg-secondary/30 scroll-mt-20" aria-labelledby="method-heading">
      <Container>
        {/* Section Header */}
        <FadeInView className="text-center mb-16">
          <h2 id="method-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Notre <span className="gradient-text">Méthode</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus structuré et transparent pour garantir la qualité de nos prestations et votre satisfaction.
          </p>
        </FadeInView>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-1/2"
              aria-hidden="true"
            />

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = iconMap[step.icon] || CheckCircle
                const isEven = index % 2 === 0

                return (
                  <FadeInView
                    key={step.id}
                    delay={index * 0.15}
                    direction={isEven ? "left" : "right"}
                    className={cn(
                      "relative flex items-center gap-6 lg:gap-12",
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse",
                    )}
                  >
                    {/* Content */}
                    <div className={cn("flex-1 pl-12 lg:pl-0", isEven ? "lg:text-right" : "lg:text-left")}>
                      <div className={cn("glass-card p-6 rounded-xl", isEven ? "lg:mr-6" : "lg:ml-6")}>
                        <div className={cn("flex items-center gap-3 mb-3", isEven ? "lg:flex-row-reverse" : "")}>
                          <span className="text-sm font-mono text-primary">0{step.stepNumber}</span>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>

                    {/* Icon Node */}
                    <div className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <Icon className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Empty space for alignment on desktop */}
                    <div className="hidden lg:block flex-1" />
                  </FadeInView>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
