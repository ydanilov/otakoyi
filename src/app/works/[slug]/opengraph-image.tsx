import { getCase, getCases } from "@/content/cases"
import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt = "Otakoyi installation case study"
export const size = ogSize
export const contentType = ogContentType

export const dynamicParams = false

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getCase(slug)
  return renderOg({
    eyebrow: item ? `${item.formats.join(" · ")} · ${item.year}` : "Installation",
    title: item?.title ?? "Installation",
    bg: `case-${slug}`,
  })
}
