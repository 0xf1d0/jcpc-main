import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Building2, User, Shield, Database, FileText, Scale, Sparkles } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_CONFIG } from "@/lib/constants"
import { CosmicBackground } from "@/components/animations/cosmic-background"

export const metadata: Metadata = {
  title: "Mentions légales | JCPC",
  description: "Mentions légales, politique de confidentialité et conditions générales de vente de JCPC.",
}

interface LegalSectionProps {
  id?: string
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

function LegalSection({ id, icon, title, children }: LegalSectionProps) {
  return (
    <Card id={id} className="glass-card border-border/50 scroll-mt-24">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose prose-neutral dark:prose-invert prose-sm max-w-none">
        {children}
      </CardContent>
    </Card>
  )
}

export default function MentionsLegalesPage() {
  return (
    <>
      <CosmicBackground />
      <Header />
      <main className="relative z-10 pt-24 pb-16 min-h-screen">
        <Container>
          {/* Header */}
          <div className="mb-12">
            <Button asChild variant="ghost" className="mb-6 -ml-2">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Scale className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Informations légales</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Mentions <span className="gradient-text">Légales</span>
              </h1>
              <p className="text-muted-foreground">
                Dernière mise à jour : Janvier 2025
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Identité */}
            <LegalSection
              id="identite"
              icon={<Building2 className="w-5 h-5 text-primary" />}
              title="1. Identité de l'éditeur"
            >
              <p className="font-semibold text-foreground">{SITE_CONFIG.fullName} ({SITE_CONFIG.name})</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-4 not-prose">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Statut</p>
                  <p className="text-sm font-medium">Association loi 1901 (Junior-Entreprise)</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Rattachement</p>
                  <p className="text-sm font-medium">Université Paris Cité</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">SIRET</p>
                  <p className="text-sm font-medium font-mono">{SITE_CONFIG.legal.siret}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">RNA</p>
                  <p className="text-sm font-medium font-mono">{SITE_CONFIG.legal.rna}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">TVA</p>
                  <p className="text-sm font-medium font-mono">{SITE_CONFIG.legal.tva}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm font-medium text-primary hover:underline">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 mt-4 not-prose">
                <p className="text-xs text-muted-foreground mb-1">Siège social</p>
                <p className="text-sm font-medium">
                  {SITE_CONFIG.address.street}, {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
                </p>
              </div>
            </LegalSection>

            {/* Directeur de publication */}
            <LegalSection
              icon={<User className="w-5 h-5 text-primary" />}
              title="2. Directeur de la publication"
            >
              <p>Le directeur de la publication est le/la Président(e) de JCPC en exercice.</p>
            </LegalSection>

            {/* Hébergement */}
            <LegalSection
              icon={<Shield className="w-5 h-5 text-primary" />}
              title="3. Hébergement"
            >
              <p>
                Ce site est hébergé sur une infrastructure sécurisée en Union Européenne, conformément aux exigences du RGPD.
              </p>
            </LegalSection>

            {/* Propriété intellectuelle */}
            <LegalSection
              icon={<Sparkles className="w-5 h-5 text-primary" />}
              title="4. Propriété intellectuelle"
            >
              <p>
                L&apos;ensemble des contenus (textes, images, logos, éléments graphiques) présents sur ce site sont la
                propriété exclusive de JCPC ou de ses partenaires. Toute reproduction, représentation, modification ou
                exploitation non autorisée est interdite et constitue une contrefaçon sanctionnée par le Code de la
                propriété intellectuelle.
              </p>
            </LegalSection>

            {/* RGPD */}
            <LegalSection
              id="confidentialite"
              icon={<Database className="w-5 h-5 text-primary" />}
              title="5. Protection des données (RGPD)"
            >
              <h3>5.1 Responsable du traitement</h3>
              <p>JCPC est responsable du traitement des données personnelles collectées sur ce site.</p>

              <h3>5.2 Données collectées</h3>
              <p>Les données personnelles collectées via le formulaire de contact sont :</p>
              <ul>
                <li>Nom de l&apos;entreprise</li>
                <li>Nom et prénom du contact</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Message</li>
              </ul>

              <h3>5.3 Finalités du traitement</h3>
              <ul>
                <li>Répondre aux demandes de contact et de devis</li>
                <li>Gérer la relation commerciale</li>
                <li>Envoyer des informations relatives à nos services (avec consentement)</li>
              </ul>

              <h3>5.4 Base légale</h3>
              <p>
                Le traitement est fondé sur le consentement (article 6.1.a du RGPD) et l&apos;exécution de mesures 
                précontractuelles (article 6.1.b du RGPD).
              </p>

              <h3>5.5 Durée de conservation</h3>
              <p>Les données sont conservées pendant une durée maximale de 3 ans à compter du dernier contact.</p>

              <h3>5.6 Vos droits</h3>
              <div className="grid sm:grid-cols-2 gap-2 not-prose my-4">
                {[
                  { title: "Accès", desc: "Obtenir confirmation du traitement" },
                  { title: "Rectification", desc: "Corriger des données inexactes" },
                  { title: "Effacement", desc: "Demander la suppression" },
                  { title: "Limitation", desc: "Limiter le traitement" },
                  { title: "Portabilité", desc: "Recevoir vos données" },
                  { title: "Opposition", desc: "Vous opposer au traitement" },
                ].map((right) => (
                  <div key={right.title} className="p-2.5 rounded-lg bg-muted/50 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="text-sm font-medium">{right.title}</span>
                      <span className="text-xs text-muted-foreground ml-1">— {right.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                Pour exercer ces droits : <a href={`mailto:${SITE_CONFIG.email}`} className="text-primary">{SITE_CONFIG.email}</a>
              </p>
              <p>
                Réclamation CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
              </p>
            </LegalSection>

            {/* Cookies */}
            <LegalSection
              id="cookies"
              icon={<Shield className="w-5 h-5 text-primary" />}
              title="6. Cookies"
            >
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 not-prose mb-4">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Ce site n&apos;utilise aucun cookie
                </p>
              </div>
              <p>
                Aucun cookie de tracking, publicitaire, analytique ou technique n&apos;est déposé sur votre navigateur.
                La préférence de thème (clair/sombre) est stockée localement via le localStorage, qui n&apos;est pas 
                considéré comme un cookie.
              </p>
            </LegalSection>

            {/* CGV */}
            <LegalSection
              id="cgv"
              icon={<FileText className="w-5 h-5 text-primary" />}
              title="7. Conditions Générales de Vente"
            >
              <h3>7.1 Objet</h3>
              <p>
                Les présentes CGV régissent les prestations de services en cybersécurité réalisées par JCPC.
              </p>

              <h3>7.2 Prestations</h3>
              <p>
                JCPC propose des prestations d&apos;audit de sécurité, tests d&apos;intrusion, sensibilisation,
                accompagnement RGPD et conseil en cybersécurité. Chaque mission fait l&apos;objet d&apos;une convention
                d&apos;étude détaillant le périmètre, les livrables et le tarif.
              </p>

              <h3>7.3 Tarification</h3>
              <p>
                Les tarifs sont établis sur devis. TVA non applicable (article 293 B du CGI).
              </p>

              <h3>7.4 Modalités de paiement</h3>
              <p>
                Paiement par virement bancaire. Acompte de 30% à la signature, solde à la livraison.
              </p>

              <h3>7.5 Confidentialité</h3>
              <p>
                JCPC s&apos;engage à maintenir la confidentialité de toutes les informations obtenues. 
                Un NDA peut être signé sur demande.
              </p>

              <h3>7.6 Responsabilité</h3>
              <p>
                JCPC est une association pédagogique dont les membres sont des étudiants encadrés par des professionnels. 
                La responsabilité est limitée au montant facturé.
              </p>

              <h3>7.7 Litiges</h3>
              <p>
                En cas de litige, recherche d&apos;une solution amiable. À défaut, tribunaux de Paris compétents.
              </p>
            </LegalSection>

            {/* Crédits */}
            <LegalSection
              icon={<Sparkles className="w-5 h-5 text-primary" />}
              title="8. Crédits"
            >
              <p>Site développé par les membres de JCPC.</p>
              <div className="flex flex-wrap gap-2 mt-3 not-prose">
                {["Next.js", "React", "Tailwind CSS", "Prisma", "PostgreSQL"].map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {tech}
                  </span>
                ))}
              </div>
            </LegalSection>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
