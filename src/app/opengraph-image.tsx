import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt = "Otakoyi — interactive generative installations for events and brands"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    eyebrow: "Generative installations for brands",
    title: "Installations that take people's breath away",
    bg: "home",
  })
}
