"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { ParticleWordmark } from "@/components/works/particle-wordmark"
import { proposalHref, site } from "@/config/site"
import { useMotion } from "@/lib/motion"

/** 0 at the top of the page → 1 after one viewport of scroll. Drives the wordmark scatter. */
function useHeroScroll() {
  const motion = useMotion()
  const [p, setP] = useState(0)
  useEffect(() => {
    if (!motion) return
    let frame = 0
    const update = () => {
      frame = 0
      setP(Math.min(1, window.scrollY / (window.innerHeight * 0.9)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [motion])
  return motion ? p : 0
}

export function Hero() {
  const scatter = useHeroScroll()

  return (
    <section className="relative isolate flex min-h-[calc(100svh-3.5rem)] flex-col justify-end overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_55%_at_50%_30%,color-mix(in_oklch,var(--gen-2)_18%,transparent),transparent)]"
      />
      <ParticleWordmark
        text={site.name.replace(/\.team$/, "")}
        scatter={scatter}
        className="absolute inset-x-0 top-0 -z-10 h-[62%]"
      />
      <div className="mx-auto w-full max-w-7xl px-4 pb-14 md:px-8 md:pb-20">
        <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Generative installations for brands
        </p>
        <ReactiveHeadline
          text="Installations people stop for."
          className="max-w-5xl text-5xl leading-[0.95] tracking-tighter md:text-8xl"
        />
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
            {site.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="signal">
              <a href={proposalHref}>
                {site.cta.label} <ArrowRightIcon />
              </a>
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
