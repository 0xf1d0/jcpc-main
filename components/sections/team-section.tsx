import Image from "next/image"
import { Linkedin, User } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FadeInView } from "@/components/animations/fade-in-view"
import { getTeamMembers } from "@/lib/data"

export async function TeamSection() {
  const members = await getTeamMembers()

  if (members.length === 0) {
    return null // Don't render section if no team members in database
  }

  return (
    <section id="equipe" className="py-10 lg:py-20 bg-secondary/30 scroll-mt-20" aria-labelledby="team-heading">
      <Container>
        {/* Section Header */}
        <FadeInView className="text-center mb-16">
          <h2 id="team-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Notre <span className="gradient-text">Équipe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Le Bureau 2025-2026 qui pilote JCPC avec passion et professionnalisme.
          </p>
        </FadeInView>

        {/* Team Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => (
            <FadeInView key={member.id} delay={index * 0.1}>
              <Card className="h-full glass-card text-center group hover:border-primary/30 transition-all duration-300">
                <CardHeader className="pb-4">
                  {/* Avatar */}
                  <div className="mx-auto mb-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform ring-2 ring-primary/20 group-hover:ring-primary/40">
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                          <User className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium text-primary">{member.role}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary hover:bg-primary/10 transition-colors focus-ring"
                      aria-label={`LinkedIn de ${member.name} (nouvelle fenêtre)`}
                    >
                      <Linkedin className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>
      </Container>
    </section>
  )
}
