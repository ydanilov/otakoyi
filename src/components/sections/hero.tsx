import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GenerativeWork } from "@/components/works/generative-work"
import { proposalHref, site } from "@/config/site"

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-end overflow-hidden">
      <GenerativeWork work="signal-field" className="absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/50 to-transparent"
      />
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8 md:pb-24">
        <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Generative installations for brands
        </p>
        <h1 className="max-w-5xl text-5xl leading-[0.95] font-medium tracking-tighter text-balance md:text-8xl">
          Installations people stop for.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
          {site.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="signal">
            <a href={proposalHref}>
              {site.cta.label} <ArrowRightIcon />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/works">See installations</Link>
          </Button>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          <li>Conferences</li>
          <li>Events</li>
          <li>Offices</li>
          <li>Exhibitions</li>
        </ul>
      </div>
    </section>
  )
}
