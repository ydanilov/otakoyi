import { getSolution, solutions } from "@/content/solutions"
import { ogContentType, ogImage, ogSize } from "@/lib/og"

export const alt = "Generative installations by occasion"
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getSolution(slug)!
  return ogImage({
    eyebrow: `For ${s.label.toLowerCase()}`,
    title: s.title,
    image: s.image,
    layout: "split",
  })
}
