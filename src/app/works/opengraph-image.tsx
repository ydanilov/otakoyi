import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt = "Otakoyi installations — case studies"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    eyebrow: "Portfolio",
    title: "Installations that worked for brands like yours",
    bg: "works",
  })
}
