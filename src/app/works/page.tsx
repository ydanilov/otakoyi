import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { HeroField } from "@/components/sections/hero-field"
import { SectionHeading } from "@/components/sections/section-heading"
import { WorksGrid } from "@/components/sections/works-grid"
import { formats, getCases, isPlaceholderCase } from "@/content/cases"
import { JsonLd, breadcrumbs } from "@/lib/json-ld"
import { absoluteUrl, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Installations",
  description:
    "Interactive generative installations for conferences, events, offices and exhibitions — case studies of body-tracking walls, live-data LED screens and interactive floors",
  path: "/works",
})

export default function WorksPage() {
  const cases = getCases()
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "CollectionPage",
            name: "Installations",
            url: absoluteUrl("/works"),
            mainEntity: {
              "@type": "ItemList",
              itemListElement: cases
                .filter((c) => !isPlaceholderCase(c))
                .map((c, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: absoluteUrl(`/works/${c.slug}`),
                  name: c.title,
                })),
            },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Installations", path: "/works" },
          ]),
        ]}
      />
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
        <h2 className="sr-only">All installations</h2>
        <WorksGrid items={cases} formats={formats} />
      </div>
      <Cta />
    </>
  )
}
