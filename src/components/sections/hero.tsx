"use client"

import { ArrowDownIcon } from "lucide-react"

import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { site } from "@/config/site"

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
        <div className="mt-8">
          <p className="max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            {site.description}
          </p>
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
