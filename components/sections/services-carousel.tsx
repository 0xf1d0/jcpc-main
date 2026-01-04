import { getServices } from "@/lib/data"
import { ServicesCarouselClient } from "./services-carousel-client"

export async function ServicesCarousel() {
  const services = await getServices()

  if (services.length === 0) {
    return null // Don't render if no services in database
  }

  return <ServicesCarouselClient services={services} />
}
