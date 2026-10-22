import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt =
  "Otakoyi Control — the branded controller for phone and tablet that comes with every installation"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOg({
    eyebrow: "Control app",
    title: "Your installation, in your hands",
    bg: "control",
  })
}
