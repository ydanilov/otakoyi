import type { MetadataRoute } from "next"

import { site } from "@/config/site"
import { seoDescription } from "@/lib/seo"
import { themeHex } from "@/lib/tokens.generated"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — generative installations`,
    short_name: site.name,
    description: seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: themeHex.background,
    theme_color: themeHex.background,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
