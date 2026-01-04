// Site configuration
export const SITE_CONFIG = {
  name: "JCPC",
  fullName: "Junior Cybersécurité Paris Cité",
  description: "Junior-Entreprise de cybersécurité rattachée à l'Université Paris Cité",
  email: "contact@jcpc.fr",
  phone: "",
  address: {
    street: "45 Rue des Saints-Pères",
    city: "Paris",
    postalCode: "75006",
    country: "France",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/jcpc-junior-cybers%C3%A9curit%C3%A9-paris-cit%C3%A9/",
    twitter: "",
    github: "",
  },
  legal: {
    siret: "En cours d'immatriculation",
    rna: "En cours",
    tva: "Non assujetti",
  },
} as const

// Contact form subjects
export const CONTACT_SUBJECTS = [
  "Demande de devis",
  "Information sur les services",
  "Partenariat",
  "Recrutement",
  "Autre",
] as const
