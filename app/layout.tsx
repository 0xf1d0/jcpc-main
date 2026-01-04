import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://jcpc.fr"),
  title: {
    default: "JCPC - Junior Cybersécurité Paris Cité",
    template: "%s | JCPC",
  },
  description:
    "Junior-Entreprise de cybersécurité rattachée à l'Université Paris Cité. Expertise en audit de sécurité, pentest, et sensibilisation pour TPE/PME.",
  keywords: [
    "cybersécurité",
    "junior-entreprise",
    "audit sécurité",
    "pentest",
    "Paris",
    "université",
    "TPE",
    "PME",
    "RGPD",
  ],
  authors: [{ name: "JCPC" }],
  creator: "JCPC",
  publisher: "JCPC",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://jcpc.fr",
    siteName: "JCPC",
    title: "JCPC - Junior Cybersécurité Paris Cité",
    description: "Experts en cybersécurité pour TPE/PME. Audits, pentests et formations par des étudiants encadrés.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JCPC - Junior Cybersécurité Paris Cité",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JCPC - Junior Cybersécurité Paris Cité",
    description: "Experts en cybersécurité pour TPE/PME. Audits, pentests et formations.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
