import { site } from "@/config/site"
import { absoluteUrl, seoDescription, siteUrl } from "@/lib/seo"

type Thing = Record<string, unknown>

/** Renders schema.org structured data. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const json = JSON.stringify(
    Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : data,
  ).replace(/</g, "\\u003c")
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export const orgId = `${siteUrl}/#organization`

export const organization: Thing = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": orgId,
  name: site.name,
  url: siteUrl,
  logo: absoluteUrl("/logo.png"),
  image: absoluteUrl("/opengraph-image"),
  email: site.email,
  description: seoDescription,
  slogan: site.tagline,
  areaServed: "Worldwide",
  knowsAbout: [
    "Generative art",
    "Interactive installations",
    "Projection mapping",
    "LED walls",
    "Body tracking",
    "TouchDesigner",
    "Real-time graphics",
    "Experiential marketing",
  ],
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Turnkey generative installations",
      serviceType: "Interactive installation design, build and on-site delivery",
    },
  },
}

export const website: Thing = {
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: site.name,
  description: seoDescription,
  inLanguage: "en",
  publisher: { "@id": orgId },
}

export function breadcrumbs(items: { name: string; path: string }[]): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export function faqPage(items: readonly { q: string; a: string }[]): Thing {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}
