"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, Mail, MapPin, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Container } from "@/components/ui/container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeInView } from "@/components/animations/fade-in-view"
import { contactFormSchema, type ContactFormSchema } from "@/lib/schemas"
import { SITE_CONFIG, CONTACT_SUBJECTS } from "@/lib/constants"
import { cn } from "@/lib/utils"

type FormStatus = "idle" | "submitting" | "success" | "error"

export function ContactSection() {
  const [status, setStatus] = useState<FormStatus>("idle")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      consent: false,
    },
  })

  const consent = watch("consent")

  const onSubmit = async (data: ContactFormSchema) => {
    setStatus("submitting")

    // Build mailto link as fallback
    const subject = encodeURIComponent(`[JCPC] ${data.subject} - ${data.company}`)
    const body = encodeURIComponent(
      `Entreprise: ${data.company}\nNom: ${data.name}\nEmail: ${data.email}\nTéléphone: ${data.phone || "Non renseigné"}\n\nMessage:\n${data.message}`,
    )

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Open mailto
    window.location.href = `mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}`

    setStatus("success")
    reset()

    // Reset status after 5 seconds
    setTimeout(() => setStatus("idle"), 5000)
  }

  return (
    <section id="contact" className="py-10 lg:py-20 scroll-mt-20" aria-labelledby="contact-heading">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <FadeInView direction="right">
            <div className="space-y-8">
              <div>
                <h2 id="contact-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                  Parlons de votre <span className="gradient-text">projet</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Vous avez des questions sur nos services ou souhaitez obtenir un devis ? Remplissez le formulaire et
                  nous vous répondrons sous 48h.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-muted-foreground">
                      {SITE_CONFIG.address.street}
                      <br />
                      {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-4">Vos données sont protégées</p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                    RGPD Compliant
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                    Données chiffrées
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                    Aucun tracking
                  </span>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* Right Column - Form */}
          <FadeInView direction="left">
            <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 sm:p-8 rounded-2xl space-y-6">
              {/* Status Messages */}
              {status === "success" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="text-sm">Votre client email va s&apos;ouvrir pour envoyer le message.</p>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <p className="text-sm">Une erreur est survenue. Veuillez réessayer.</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Entreprise <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Nom de votre entreprise"
                    {...register("company")}
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? "company-error" : undefined}
                    className={cn(errors.company && "border-destructive")}
                  />
                  {errors.company && (
                    <p id="company-error" className="text-xs text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nom complet <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Prénom Nom"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={cn(errors.name && "border-destructive")}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@entreprise.fr"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={cn(errors.email && "border-destructive")}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    {...register("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={cn(errors.phone && "border-destructive")}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="text-xs text-destructive">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  Sujet <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("subject", value)}>
                  <SelectTrigger
                    id="subject"
                    aria-invalid={!!errors.subject}
                    className={cn(errors.subject && "border-destructive")}
                  >
                    <SelectValue placeholder="Sélectionnez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre projet ou vos besoins en cybersécurité..."
                  rows={5}
                  {...register("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(errors.message && "border-destructive", "resize-none")}
                />
                {errors.message && (
                  <p id="message-error" className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Consent */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setValue("consent", checked === true)}
                    aria-invalid={!!errors.consent}
                    className="mt-0.5"
                  />
                  <Label htmlFor="consent" className="text-sm text-muted-foreground font-normal leading-relaxed">
                    J&apos;accepte que mes données soient traitées conformément à la{" "}
                    <a href="/mentions-legales#confidentialite" className="text-primary underline underline-offset-2">
                      politique de confidentialité
                    </a>{" "}
                    de JCPC. <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                    Envoyer le message
                  </>
                )}
              </Button>
            </form>
          </FadeInView>
        </div>
      </Container>
    </section>
  )
}
