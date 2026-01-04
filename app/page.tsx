import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ServicesCarousel } from "@/components/sections/services-carousel"
import { MethodSection } from "@/components/sections/method-section"
import { StatsSection } from "@/components/sections/stats-section"
import { CTFSection } from "@/components/sections/ctf-section"
import { CTFPlatformSection } from "@/components/sections/ctf-platform-section"
import { TeamSection } from "@/components/sections/team-section"
import { ContactSection } from "@/components/sections/contact-section"
import { CosmicBackground } from "@/components/animations/cosmic-background"

export default function HomePage() {
  return (
    <>
      <CosmicBackground fullPage />
      <Header />
      <main id="main-content" className="relative z-10">
        <HeroSection />
        <ServicesCarousel />
        <MethodSection />
        <StatsSection />
        <CTFPlatformSection />
        <CTFSection />
        <TeamSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
