import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { HeroField } from "@/components/sections/hero-field"
import { SectionHeading } from "@/components/sections/section-heading"
import { WorksGrid } from "@/components/sections/works-grid"
import { formats, getCases } from "@/content/cases"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Installations",
  description:
    "Generative installations for conferences, events, offices and exhibitions — customised to each client's brand",
  path: "/works",
})

export default function WorksPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <HeroField seed={13} />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:px-8 md:pt-24">
          <SectionHeading
            page
            eyebrow="Installations"
            title="Installations that worked for brands like yours"
            description="Our own TouchDesigner installations and studies from the generative engine we install on site. Filter by the kind of space you are planning"
          />
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <WorksGrid items={getCases()} formats={formats} />
      </div>
      <Cta />
    </>
  )
}
