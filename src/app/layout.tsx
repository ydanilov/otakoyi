import type { Metadata, Viewport } from "next"

import { ProposalDialog } from "@/components/site/proposal-dialog"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { indexable, site, siteUrl } from "@/config/site"
import { motionScript, themeScript } from "@/lib/init-scripts"
import { JsonLd, organization, website } from "@/lib/seo"
import { colorHex } from "@/lib/tokens.generated"
import { fontLogo, fontMono, fontSans } from "@/fonts"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: `${site.name} — Generative design studio`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    title: `${site.name} — Generative design studio`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
}

export const viewport: Viewport = {
  themeColor: colorHex.dark.background,
  colorScheme: "dark light",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${fontSans.variable} ${fontMono.variable} ${fontLogo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + motionScript }} />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded bg-signal px-3 py-2 text-signal-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <ProposalDialog />
        <JsonLd data={[organization(), website()]} />
        {/* Vercel Web Analytics + Speed Insights as plain deferred scripts: no client bundle cost. */}
        <script defer src="/_vercel/insights/script.js" />
        <script defer src="/_vercel/speed-insights/script.js" />
      </body>
    </html>
  )
}
