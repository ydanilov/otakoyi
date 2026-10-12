import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRightIcon } from "lucide-react"

import { Cta } from "@/components/sections/cta"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GenerativeWork } from "@/components/works/generative-work"
import { getCase, getCases } from "@/content/cases"

export const dynamicParams = false

export function generateStaticParams() {
  return getCases().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps<"/works/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const item = getCase(slug)
  return item ? { title: item.title, description: item.summary } : {}
}

export default async function CasePage({ params }: PageProps<"/works/[slug]">) {
  const { slug } = await params
  const item = getCase(slug)
  if (!item) notFound()

  const { default: Body } = await import(`@/content/cases/${slug}.mdx`)
  const all = getCases()
  const next = all[(all.findIndex((c) => c.slug === slug) + 1) % all.length]!

  return (
    <article>
      <header className="mx-auto max-w-7xl px-4 pt-16 md:px-8 md:pt-24">
        <p className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {item.client} · {item.year}
        </p>
        <h1 className="max-w-4xl text-5xl font-medium tracking-tighter text-balance md:text-7xl">
          {item.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-pretty text-muted-foreground">{item.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {item.formats.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
        <dl
          aria-label="Quick facts"
          className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            { label: "Client", value: item.client },
            { label: "Venue", value: item.location },
            { label: "Surface", value: item.facts.surface },
            { label: "Timeline", value: item.facts.timeline },
          ].map((f) => (
            <div key={f.label} className="flex flex-col-reverse bg-background p-5">
              <dt className="mt-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {f.label}
              </dt>
              <dd className="font-medium text-pretty">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <GenerativeWork
        work={item.hero.work}
        seed={item.hero.seed}
        density={item.hero.density}
        className="mx-auto mt-12 aspect-[16/9] max-w-7xl md:mt-16 md:rounded-xl"
      />

      <section aria-label="Results" className="mx-auto max-w-7xl px-4 pt-12 md:px-8">
        <dl className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
          {item.results.map((r) => (
            <div key={r.label} className="bg-background p-6">
              <dt className="sr-only">{r.label}</dt>
              <dd className="text-4xl font-medium tracking-tight md:text-5xl">{r.value}</dd>
              <dd className="mt-2 text-sm text-muted-foreground">{r.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1fr_2fr] md:px-8 md:py-24">
        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Location</p>
            <p>{item.location}</p>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">Customised for the brand</p>
            <ul className="space-y-1">
              {item.customisation.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-sm text-muted-foreground">System</p>
            <p className="font-mono">
              {item.hero.work}#{item.hero.seed}
            </p>
          </div>
        </aside>
        <div className="max-w-2xl">
          <Body />
        </div>
      </div>

      <section aria-labelledby="backstage-title" className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1fr_2fr] md:px-8 md:py-20">
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Backstage
            </p>
            <h2 id="backstage-title" className="text-3xl font-medium tracking-tight text-balance">
              What made it reliable on the night.
            </h2>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
            {item.backstage.map((b) => (
              <div key={b.label} className="flex flex-col-reverse bg-background p-5">
                <dt className="mt-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {b.label}
                </dt>
                <dd className="text-lg">{b.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="pt-24">
        <Cta />
      </div>

      <Separator className="mt-24" />
      <nav aria-label="Next installation" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <Link
          href={`/works/${next.slug}`}
          className="group relative block overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <GenerativeWork
            work={next.hero.work}
            seed={next.hero.seed}
            density={next.hero.density}
            className="aspect-[21/9] transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-10">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Next installation</p>
              <p className="text-3xl font-medium tracking-tight md:text-6xl">{next.title}</p>
            </div>
            <ArrowRightIcon className="size-8 shrink-0 transition-transform group-hover:translate-x-2 md:size-12" />
          </div>
        </Link>
      </nav>
    </article>
  )
}
