import type { Metadata, Viewport } from "next"

import { PageTransition } from "@/components/site/page-transition"
import { ProposalDialog } from "@/components/site/proposal-dialog"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { site } from "@/config/site"
import { motionScript, themeScript } from "@/lib/init-scripts"
import { JsonLd, organization, website } from "@/lib/json-ld"
import { keywords, seoDescription, siteUrl } from "@/lib/seo"
import { themeHex } from "@/lib/tokens.generated"
import { fontLogo, fontMono, fontSans } from "@/fonts"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — Interactive generative installations for events and brands`,
    template: `%s — ${site.name}`,
  },
  description: seoDescription,
  applicationName: site.name,
  keywords,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: `${site.name} — Interactive generative installations for events and brands`,
    description: seoDescription,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  category: "design",
}

export const viewport: Viewport = { themeColor: themeHex.dark.background, colorScheme: "dark" }

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`dark ${fontSans.variable} ${fontMono.variable} ${fontLogo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + motionScript }} />
        <JsonLd data={[organization, website]} />
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded bg-signal px-3 py-2 text-signal-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <PageTransition>
          <main id="main" className="flex-1 pt-(--header-h)">
            {children}
          </main>
        </PageTransition>
        <SiteFooter />
        <ProposalDialog />
        {/* Vercel Web Analytics + Speed Insights as plain deferred scripts: no client bundle cost. */}
        <script defer src="/_vercel/insights/script.js" />
        <script defer src="/_vercel/speed-insights/script.js" />
      </body>
    </html>
  )
}
