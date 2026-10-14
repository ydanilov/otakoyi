import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { Occasions } from "@/components/sections/occasions"
import { SectionHeading } from "@/components/sections/section-heading"
import { solutions } from "@/content/solutions"

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Generative installations for conferences, launches, office lobbies and exhibitions — pick your occasion",
}

export default function SolutionsPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          eyebrow="Solutions"
          title="What are you planning?"
          description="Start from the space and the moment. Each page shows what you get, how long it takes and installations like it"
          className="mb-12"
        />
        <Occasions items={solutions} />
      </div>
      <Cta />
    </>
  )
}
