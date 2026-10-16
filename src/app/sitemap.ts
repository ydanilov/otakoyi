import type { MetadataRoute } from "next"

import { getCases } from "@/content/cases"
import { solutions } from "@/content/solutions"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number) => ({ url: absoluteUrl(path), priority })
  return [
    page("/", 1),
    page("/solutions", 0.9),
    ...solutions.map((s) => page(`/solutions/${s.slug}`, 0.8)),
    page("/works", 0.8),
    ...getCases().map((c) => page(`/works/${c.slug}`, 0.7)),
    page("/studio", 0.6),
  ]
}
