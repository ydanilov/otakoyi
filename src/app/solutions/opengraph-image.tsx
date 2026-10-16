import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Generative installations for conferences, launches, offices and exhibitions"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return ogImage({
    eyebrow: "Solutions",
    title: "What are you planning?",
    image: "/solutions/conferences.webp",
    layout: "split",
  })
}
