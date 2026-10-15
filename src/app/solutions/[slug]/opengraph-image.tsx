import { getSolution, solutions } from "@/content/solutions"
import { renderOg, ogContentType, ogSize } from "@/lib/og"

export const alt = "Otakoyi installations for your event"
export const size = ogSize
export const contentType = ogContentType

export const dynamicParams = false

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getSolution(slug)
  return renderOg({
    eyebrow: s ? `For ${s.label.toLowerCase()}` : "Solutions",
    title: s?.title ?? "Installations for your event",
    bg: `solution-${slug}`,
  })
}
