import { getCase, getCases } from "@/content/cases"
import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Installation case study"
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getCase(slug)!
  return ogImage({
    eyebrow: `Installation · ${item.formats[0]}`,
    title: item.title,
    image: item.cover?.src,
  })
}
