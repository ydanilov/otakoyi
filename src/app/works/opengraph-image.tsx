import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Installations that worked for brands like yours"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({
    eyebrow: "Installations",
    title: alt,
    image: "/works/pump-the-market/hero.webp",
  })
}
