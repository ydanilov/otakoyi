import { site } from "@/config/site"
import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = `${site.name} — ${site.tagline}`
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({
    eyebrow: "Generative design studio",
    title: site.tagline,
    image: "/solutions/exhibitions.webp",
    layout: "split",
  })
}
