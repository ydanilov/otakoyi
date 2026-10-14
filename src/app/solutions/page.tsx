import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { Occasions } from "@/components/sections/occasions"
import { SectionHeading } from "@/components/sections/section-heading"
import { TechnologySelector } from "@/components/sections/technologies"
import { solutions } from "@/content/solutions"
import { technologies } from "@/content/technologies"

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
