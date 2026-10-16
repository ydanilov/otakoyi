import type { MetadataRoute } from "next"

import { getIndexableCases } from "@/content/cases"
import { solutions } from "@/content/solutions"
import { absoluteUrl } from "@/lib/seo"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const page = (
    path: string,
    priority: number,
    changeFrequency: "weekly" | "monthly" = "monthly",
    images?: string[],
  ) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
    ...(images?.length ? { images: images.map((i) => absoluteUrl(i)) } : {}),
  })

  return [
    page("/", 1, "weekly", ["/venues/photo-0.webp"]),
    page("/works", 0.9, "weekly"),
    page("/solutions", 0.9),
    page("/studio", 0.7, "monthly", ["/studio/studio.webp"]),
    ...solutions.map((s) => page(`/solutions/${s.slug}`, 0.8, "monthly", s.image ? [s.image] : [])),
    ...getIndexableCases().map((c) =>
      page(`/works/${c.slug}`, 0.7, "monthly", [
        ...(c.cover ? [c.cover.src] : []),
        ...(c.gallery ?? []).map((g) => g.src),
      ]),
    ),
  ]
}
