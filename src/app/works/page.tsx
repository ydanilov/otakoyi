import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { SectionHeading } from "@/components/sections/section-heading"
import { WorksGrid } from "@/components/sections/works-grid"
import { formats, getCases } from "@/content/cases"

export const metadata: Metadata = {
  title: "Installations",
  description:
    "Generative installations for conferences, events, offices and exhibitions — customised to each client's brand.",
}

export default function WorksPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          as="h1"
          eyebrow="Installations"
          title="Installations that worked for brands like yours"
          description="Every image here is rendered live by the same engine we install on site. Filter by the kind of space you are planning."
          className="mb-12"
        />
        <WorksGrid items={getCases()} formats={formats} />
      </div>
      <Cta />
    </>
  )
}
