import type { Metadata } from "next"

import { site, siteUrl } from "@/config/site"

/** Absolute URL for a site path — for canonical links, sitemap and structured data. */
export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString()

/**
 * Per-page metadata with a canonical URL and matching Open Graph fields. Next replaces (does not
 * merge) a parent's `openGraph`, so the shared fields are repeated here. OG images come from the
 * `opengraph-image` files next to each route.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title?: string
  description: string
  path: string
  type?: "website" | "article"
}): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      locale: "en_US",
      url: path,
      ...(title ? { title: `${title} — ${site.name}` } : {}),
      description,
    },
  }
}

type Thing = Record<string, unknown>

/** schema.org structured data, rendered as JSON-LD (for search engines and AI answer engines). */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] }
  return (
    <script
      type="application/ld+json"
      // `<` is escaped so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  )
}

export const orgId = absoluteUrl("/#organization")

export function organization(): Thing {
  const sameAs = site.social.flatMap((s) => (s.href ? [s.href] : []))
  return {
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon-512.png"),
    email: site.email,
    description: site.description,
    slogan: site.tagline,
    knowsAbout: [
      "Generative design",
      "Interactive installations",
      "Projection mapping",
      "LED walls",
      "Event technology",
      "Brand experiences",
    ],
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function website(): Thing {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: absoluteUrl("/"),
    inLanguage: "en",
    publisher: { "@id": orgId },
  }
}

export function breadcrumbs(items: { name: string; path: string }[]): Thing {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

export function faqPage(items: readonly { q: string; a: string }[], path: string): Thing {
  return {
    "@type": "FAQPage",
    "@id": absoluteUrl(`${path}#faq`),
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}
