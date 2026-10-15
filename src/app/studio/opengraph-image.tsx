import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt = "The Otakoyi studio"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    eyebrow: "Studio",
    title: "Artists with toolboxes. Engineers with taste",
    bg: "studio",
  })
}
