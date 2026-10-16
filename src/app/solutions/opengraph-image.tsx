import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt = "Otakoyi solutions — installations for every kind of event and space"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({ eyebrow: "Solutions", title: "What are you planning?", bg: "solutions" })
}
