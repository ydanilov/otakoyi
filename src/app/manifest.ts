import type { MetadataRoute } from "next"

import { site } from "@/config/site"
import { colorHex } from "@/lib/tokens.generated"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Generative design studio`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: colorHex.dark.background,
    theme_color: colorHex.dark.background,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
