import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { Occasions } from "@/components/sections/occasions"
import {
  OccasionsBento,
  OccasionsIndex,
  OccasionsSelector,
  OccasionsVenues,
} from "@/components/sections/occasions-variants"
import { SectionHeading } from "@/components/sections/section-heading"
import { solutions } from "@/content/solutions"

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Generative installations for conferences, launches, office lobbies and exhibitions — pick your occasion",
}

// Temporary: layout options for review. The chosen one replaces the rest.
const variants = [
  { id: "a", name: "Index", Component: OccasionsIndex },
  { id: "b", name: "Bento", Component: OccasionsBento },
  { id: "c", name: "Venues", Component: OccasionsVenues },
  { id: "d", name: "Selector", Component: OccasionsSelector },
] as const

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
        <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Current
        </p>
        <Occasions items={solutions} />
        {variants.map(({ id, name, Component }) => (
          <section
            key={id}
            id={`variant-${id}`}
            aria-label={`Variant ${id.toUpperCase()}: ${name}`}
            className="mt-24 border-t pt-10"
          >
            <p className="mb-8 font-mono text-xs tracking-widest text-signal uppercase">
              Variant {id.toUpperCase()} · {name}
            </p>
            <Component items={solutions} />
          </section>
        ))}
      </div>
      <Cta />
    </>
  )
}
