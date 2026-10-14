import type { Metadata } from "next"
import { CheckIcon } from "lucide-react"

import { Cta } from "@/components/sections/cta"
import { SectionHeading } from "@/components/sections/section-heading"
import { Separator } from "@/components/ui/separator"
import { GenerativeWork } from "@/components/works/generative-work"
import { site } from "@/config/site"
import { technologies } from "@/content/technologies"

export const metadata: Metadata = {
  title: "Studio",
  description: `About ${site.name} — the team behind turnkey generative installations for brands`,
}

const included = [
  "Concept and live prototype in your brand",
  "Custom generative engine (yours to reuse)",
  "Data and interaction integration",
  "Hardware plan: projection, LED, sensors",
  "Installation, calibration and on-site operator",
  "Remote monitoring and support",
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
  { name: "Team Member", role: "Creative director" },
  { name: "Team Member", role: "Creative technologist" },
  { name: "Team Member", role: "Production & installation" },
]

const clients = [
  "Placeholder Capital",
  "Placeholder Expo",
  "Placeholder Bank",
  "Placeholder Telecom",
  "Placeholder Summit",
  "Placeholder Museum",
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
            Designers and engineers who install what they design
          </h1>
          <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            {site.description}
          </p>
        </div>
        <GenerativeWork work="lattice" seed={17} className="aspect-square rounded-xl" />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading
          eyebrow="Turnkey"
          title="What's included"
          description="One team from first call to the last night of the event"
          className="mb-8"
        />
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((i) => (
            <li key={i} className="flex gap-3 border-t pt-4 text-lg">
              <CheckIcon aria-hidden className="mt-1 size-5 shrink-0 text-signal" />
              {i}
            </li>
          ))}
        </ul>
      </section>

      <section id="any-venue" className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading
          eyebrow="Any venue"
          title="Whatever the space, we use everything it has"
          description="Whatever the venue and whatever the goal, our toolkit is wide enough to fit the installation to the room — and get the most out of every screen, surface and signal already there"
          className="mb-8"
        />
        <ul className="flex flex-wrap gap-2">
          {technologies.map((t) => (
            <li
              key={t.slug}
              className="rounded-full border px-4 py-2 text-sm text-pretty text-muted-foreground"
            >
              {t.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading eyebrow="Principles" title="How we work" className="mb-8" />
        <dl className="grid gap-8 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title}>
              <dt className="text-xl font-medium">{p.title}</dt>
              <dd className="mt-2 text-muted-foreground">{p.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading eyebrow="People" title="The team" className="mb-8" />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li key={i}>
              <GenerativeWork
                work="contour"
                seed={100 + i}
                animate={false}
                className="aspect-[4/5] rounded-lg"
              />
              <p className="mt-3 font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <SectionHeading eyebrow="Clients" title="Brands we've built for" className="mb-8" />
        <Separator />
        <ul className="grid grid-cols-2 md:grid-cols-3">
          {clients.map((c) => (
            <li key={c} className="border-b py-5 text-lg text-muted-foreground">
              {c}
            </li>
          ))}
        </ul>
      </section>

      <Cta />
    </>
  )
}
