import type { Metadata } from "next"
import { CheckIcon } from "lucide-react"

import { Cta } from "@/components/sections/cta"
import { LogoWall } from "@/components/sections/logo-wall"
import { SectionHeading } from "@/components/sections/section-heading"
import { site } from "@/config/site"

export const metadata: Metadata = {
  title: "Studio",
  description: `About ${site.name} — the team behind turnkey generative installations for brands`,
}

const included = [
  { title: "Concept", body: "A concept and a live prototype in your brand, within a week" },
  {
    title: "Your installation",
    body: "A generative installation built for you, ready to grow into new venues",
  },
  { title: "Data and interaction", body: "Your data, sensors and audience wired into every frame" },
  { title: "Hardware", body: "Projection, LED and sensors specified, sourced and rigged" },
  { title: "On site", body: "Installation, calibration and an operator on the night" },
  { title: "Support", body: "Remote monitoring and updates long after the doors close" },
]

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
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Studio
          </p>
          <h1 className="text-5xl font-medium tracking-tighter text-balance md:text-7xl">
            Artists with toolboxes. Engineers with taste
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            {site.description}
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/studio/studio.webp"
          alt="A creative technologist at work in the studio, generative visuals on the monitors"
          className="aspect-square w-full rounded-xl object-cover"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading
          eyebrow="Turnkey"
          title="What's included"
          description="One team from first call to the last night of the event"
          className="mb-12"
        />
        <ol className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {included.map((item, i) => (
            <li
              key={item.title}
              className="group flex min-h-56 flex-col justify-between gap-10 bg-background p-6 transition-colors hover:bg-card md:p-8"
            >
              <span className="flex items-center justify-between font-mono text-xs tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
                <CheckIcon
                  aria-hidden
                  className="size-5 text-signal transition-transform duration-300 group-hover:scale-110"
                />
              </span>
              <span>
                <span className="block text-2xl font-medium tracking-tight">{item.title}</span>
                <span className="mt-2 block max-w-xs text-pretty text-muted-foreground">
                  {item.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
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
