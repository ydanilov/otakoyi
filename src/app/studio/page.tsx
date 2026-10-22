import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { Included } from "@/components/sections/included"
import { LogoWall } from "@/components/sections/logo-wall"
import { SectionHeading } from "@/components/sections/section-heading"
import { StudioHero } from "@/components/sections/studio-hero"
import { site } from "@/config/site"
import { JsonLd, breadcrumbs, orgId } from "@/lib/json-ld"
import { absoluteUrl, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Studio",
  description: `About ${site.name} — artists and engineers who design, build and install interactive generative installations, turnkey, from concept to opening night`,
  path: "/studio",
})

const principles = [
  {
    title: "Brand first",
    body: "We start from your identity and goals, not from a piece we want to show off",
  },
  {
    title: "Live, not rendered",
    body: "Real-time systems adapt to every screen, venue and moment — no re-renders",
  },
  {
    title: "Measured",
    body: "We agree on what success looks like — dwell time, leads, reach — and report on it",
  },
  {
    title: "Reliable on the night",
    body: "Tested on site, with fallbacks and an operator. Opening night is not a beta",
  },
]

const team = [
  { name: "Team Member", role: "CEO", image: "/studio/ceo.webp" },
  { name: "Team Member", role: "CTO", image: "/studio/cto.webp" },
  { name: "Team Member", role: "COO", image: "/studio/coo.webp" },
]

export default function StudioPage() {
  return (
    <>
      <JsonLd
        data={[
          { "@type": "AboutPage", url: absoluteUrl("/studio"), about: { "@id": orgId } },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Studio", path: "/studio" },
          ]),
        ]}
      />
      <StudioHero
        first="Artists with toolboxes"
        second="Engineers with taste"
        image={{
          src: "/studio/studio.webp",
          alt: "A creative technologist at work in the studio, generative visuals on the monitors",
        }}
      />

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-24 md:px-8 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16">
          <SectionHeading
            eyebrow="Principles"
            title="How we work"
            description="Four commitments we hold on every project, from the first call to the last night of the event"
            className="md:sticky md:top-24 md:self-start"
          />
          <ol className="border-b">
            {principles.map((p, i) => (
              <li
                key={p.title}
                className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-t py-8 md:grid-cols-[4rem_minmax(0,1fr)] md:py-10"
              >
                <span className="pt-2 font-mono text-xs tracking-widest text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-2xl font-medium tracking-tight md:text-4xl">{p.title}</h3>
                  <p className="mt-3 max-w-xl text-lg text-pretty text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading
          eyebrow="Turnkey"
          title="What's included"
          description="One team from first call to the last night of the event"
          className="mb-12"
        />
        <Included />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading eyebrow="People" title="The team" className="mb-8" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.image}
                alt={`${m.role} of ${site.name}`}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
              <p className="mt-3 font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading eyebrow="Clients" title="Brands we've built for" className="mb-12" />
        <LogoWall />
      </section>

      <Cta />
    </>
  )
}
