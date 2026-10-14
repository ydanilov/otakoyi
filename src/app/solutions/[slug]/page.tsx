import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CheckIcon } from "lucide-react"

import { Cta } from "@/components/sections/cta"
import { HeroField } from "@/components/sections/hero-field"
import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { Faq } from "@/components/sections/faq"
import { Process } from "@/components/sections/process"
import { SectionHeading } from "@/components/sections/section-heading"
import { WorkCard } from "@/components/sections/work-card"
import { Button } from "@/components/ui/button"
import { VenueStill } from "@/components/sections/venue-stage"
import { proposalHref, site } from "@/config/site"
import { casesFor, getSolution, solutions } from "@/content/solutions"

export const dynamicParams = false

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const s = getSolution(slug)
  return s ? { title: `${s.label} installations`, description: s.promise } : {}
}

export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params
  const s = getSolution(slug)
  if (!s) notFound()
  const matching = casesFor(s)
  const others = solutions.filter((o) => o.slug !== s.slug)

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <HeroField work={s.hero.work} seed={s.hero.seed} />
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 md:px-8 md:pt-40 md:pb-24">
          <p className="mb-4 font-mono text-xs tracking-widest text-signal uppercase">
            For {s.label.toLowerCase()}
          </p>
          <ReactiveHeadline
            text={s.title}
            className="max-w-4xl text-5xl leading-[0.95] tracking-tighter text-balance md:text-8xl"
          />
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
            {s.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="signal">
              <a href={proposalHref}>{site.cta.label}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#installations">See installations</a>
            </Button>
          </div>
          <dl className="mt-14 grid max-w-3xl gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
            {s.facts.map((f) => (
              <div
                key={f.label}
                className="flex flex-col-reverse bg-background/80 p-5 backdrop-blur"
              >
                <dt className="mt-1 text-sm text-muted-foreground">{f.label}</dt>
                <dd className="text-2xl font-medium tracking-tight">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="What you get"
          title="Built for this exact moment"
          className="mb-12"
        />
        <ul className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3">
          {s.outcomes.map((o, i) => (
            <li key={o.title} className="bg-background p-6 md:p-8">
              <p className="mb-6 font-mono text-xs text-muted-foreground">0{i + 1}</p>
              <h3 className="text-xl font-medium tracking-tight">{o.title}</h3>
              <p className="mt-2 text-muted-foreground">{o.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 md:grid-cols-[1fr_1.4fr] md:px-8 md:pb-28">
        <div>
          <SectionHeading eyebrow="Surfaces" title="Where it goes" className="mb-8" />
          <ul className="space-y-3">
            {s.surfaces.map((x) => (
              <li key={x} className="flex items-start gap-3 text-lg">
                <CheckIcon aria-hidden className="mt-1 size-5 shrink-0 text-signal" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <VenueStill
          index={Math.round(s.venue * 3)}
          label={`A ${s.label.toLowerCase()} installation with generative content on its screens`}
          className="aspect-[4/3] rounded-xl"
        />
      </section>

      <section id="installations" className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <SectionHeading
          eyebrow="Installations"
          title={`${s.label} we have built`}
          className="mb-12"
        />
        {matching.length ? (
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {matching.map((c) => (
              <li key={c.slug}>
                <WorkCard item={c} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Case studies for this format are on the way.{" "}
            <Link href="/works" className="underline">
              See all installations
            </Link>
            .
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <SectionHeading
          eyebrow="How it works"
          title="From brief to opening night"
          className="mb-12"
        />
        <Process />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <SectionHeading eyebrow="FAQ" title="Questions we hear" className="mb-8" />
        <Faq items={s.faq} />
      </section>

      <Cta />

      <nav aria-label="Other solutions" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="mb-4 text-sm text-muted-foreground">Planning something else?</p>
        <ul className="flex flex-wrap gap-x-10 gap-y-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/solutions/${o.slug}`}
                className="text-2xl font-medium tracking-tight hover:text-signal md:text-4xl"
              >
                {o.label} →
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
