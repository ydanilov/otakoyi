import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { HeroField } from "@/components/sections/hero-field"
import { Occasions } from "@/components/sections/occasions"
import { SectionHeading } from "@/components/sections/section-heading"
import { TechnologySelector } from "@/components/sections/technologies"
import { solutions } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Solutions",
  description:
    "Generative installations for conferences, launches, office lobbies and exhibitions — pick your occasion",
  path: "/solutions",
})

export default function SolutionsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <HeroField seed={29} />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:px-8 md:pt-24">
          <SectionHeading
            page
            eyebrow="Solutions"
            title="What are you planning?"
            description="Start from the space and the moment. Each page shows what you get, how long it takes and installations like it"
          />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <Occasions items={solutions} />
      </div>
      <section id="surfaces" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <SectionHeading
          eyebrow="Any venue, every surface"
          title="One installation. Every surface it meets"
          description="Whatever the space and the goal, we fit the installation to the room and use every screen, surface and signal already there. Projection, LED, light and screens play one living artwork, re-shaped to every size, in sync"
          className="mb-12"
        />
        <TechnologySelector
          label="Surfaces"
          items={technologies.filter((t) => t.kind === "output")}
        />
      </section>
      <Cta />
    </>
  )
}
