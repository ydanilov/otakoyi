import type { Metadata } from "next"

import { site } from "@/config/site"

/**
 * Canonical origin. Set NEXT_PUBLIC_SITE_URL once a custom domain is live; on Vercel the
 * production domain is picked up automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://studio-portfolio-navy.vercel.app")
).replace(/\/$/, "")

export const absoluteUrl = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`

/** Search-facing summary of what the studio sells (used in metadata, JSON-LD and llms.txt). */
export const seoDescription =
  "Otakoyi designs, builds and installs interactive generative installations for conferences, trade show stands, brand launches, music events, museums and office lobbies — LED walls, projection mapping and interactive floors, customised to your brand and driven by live data"

export const keywords = [
  "generative installations",
  "interactive installations",
  "immersive installations",
  "trade show booth installation",
  "conference stage visuals",
  "LED wall content",
  "projection mapping",
  "interactive floor",
  "brand activation",
  "event technology",
  "TouchDesigner studio",
  "generative design studio",
  "experiential agency",
]

type PageMeta = { title: string; description: string; path: string; type?: "website" | "article" }

/**
 * Per-page metadata with canonical URL and matching Open Graph / Twitter text. Next replaces
 * nested objects instead of merging them, so each page sets its own openGraph block.
 */
export function pageMetadata({ title, description, path, type = "website" }: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description },
  }
}
