"use client"

import Link from "next/link"
import { ArrowDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { proposalHref, site } from "@/config/site"

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col justify-end overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_55%_at_50%_30%,color-mix(in_oklch,var(--gen-2)_18%,transparent),transparent)]"
      />
      <div className="mx-auto w-full max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
        <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Generative installations for brands
        </p>
        <ReactiveHeadline
          text="Installations that take people's breath away"
          className="max-w-5xl text-5xl leading-[0.95] tracking-tighter md:text-8xl"
        />
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            {site.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="signal">
              <a href={proposalHref}>{site.cta.label}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/works">See installations</Link>
            </Button>
          </div>
        </div>
        <a
          href="#venues"
          className="mt-12 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground"
        >
          <ArrowDownIcon className="size-4 motion-on:animate-bounce" /> Walk through the venues
        </a>
      </div>
    </section>
  )
}
