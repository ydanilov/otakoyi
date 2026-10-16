import type { MetadataRoute } from "next"

import { indexable } from "@/config/site"
import { absoluteUrl } from "@/lib/seo"

/** Production is open to every crawler, AI answer engines included; previews are closed. */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
