import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Artists with toolboxes. Engineers with taste"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({ eyebrow: "Studio", title: alt, image: "/studio/studio.webp" })
}
