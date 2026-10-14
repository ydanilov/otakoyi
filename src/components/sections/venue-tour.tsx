"use client"

import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  VenueStage,
  VenueStill,
  venueIndex,
  venueProgress,
} from "@/components/sections/venue-stage"
import type { Solution } from "@/content/solutions"
import { cn } from "@/lib/utils"
import { useScrollProgress } from "@/lib/use-scroll-progress"

const HEADER = 56

type VenueTourProps = {
  /** Stops along the tour, in camera order (their `venue` value places them on the path). */
  stops: Solution[]
}

/**
 * Scroll walks through four spaces — exhibition stand, office lobby, concert, museum room — one
 * at a time, each a Blender still with a live generative work on its main screen, so buyers see
 * the format where it would live. Motion off (ADR-006): a still and the stops as a list.
 */
export function VenueTour({ stops }: VenueTourProps) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>(HEADER)

  const active = venueIndex(progress)

  /** Scroll to the middle of a stop's scene; the film plays the transitions on the way. */
  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER
    const travel = el.offsetHeight - (window.innerHeight - HEADER)
    window.scrollTo({ top: top + venueProgress(i) * travel, behavior: "smooth" })
  }

  return (
    <section id="venues" aria-labelledby="venues-title">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-12 md:px-8 md:pt-28">
        <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Where it lives
        </p>
        <h2
          id="venues-title"
          className="max-w-3xl text-3xl font-medium tracking-tight text-balance md:text-5xl"
        >
          Walk through the spaces your brand shows up in
        </h2>
      </div>

      {/* Motion off: one still frame and the stops as cards. */}
      <div className="mx-auto hidden max-w-7xl px-4 pb-20 md:px-8 motion-off:block">
        <VenueStill
          index={0}
          label="An exhibition stand with generative content on its screens"
          className="aspect-[16/9] rounded-xl"
        />
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stops.map((s) => (
            <li key={s.slug}>
              <StopCopy stop={s} />
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={ref}
        style={{ height: `${stops.length * 110 + 60}svh` }}
        className="relative motion-off:hidden"
      >
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden">
          <VenueStage active={active} className="absolute inset-0" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent"
          />

          <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-between px-4 py-10 md:px-8">
            <nav aria-label="Tour stops" className="self-end">
              <ol className="flex gap-1">
                {stops.map((s, i) => (
                  <li key={s.slug}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      aria-label={`Go to ${s.label}`}
                      className="group flex cursor-pointer items-center gap-2 rounded-full px-2 py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-0.5 rounded-full transition-all duration-500",
                          i === active ? "w-14 bg-signal" : "w-8 bg-muted-foreground/40",
                          i < active && "bg-signal/60",
                          "group-hover:w-14 group-hover:bg-signal",
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-xs tracking-widest whitespace-nowrap uppercase transition-colors",
                          i === active
                            ? "text-foreground"
                            : "hidden text-muted-foreground group-hover:text-foreground md:inline",
                        )}
                      >
                        {s.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="relative max-w-md">
              {stops.map((s, i) => (
                <div
                  key={s.slug}
                  aria-hidden={i !== active}
                  inert={i !== active}
                  className={cn(
                    "transition-all duration-700 ease-out",
                    i === 0 ? "relative" : "absolute inset-x-0 bottom-0",
                    i === active
                      ? "translate-y-0 opacity-100"
                      : "pointer-events-none translate-y-6 opacity-0",
                  )}
                >
                  <StopCopy stop={s} large />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StopCopy({ stop, large }: { stop: Solution; large?: boolean }) {
  return (
    <div
      className={cn(
        "space-y-4",
        large &&
          "rounded-2xl border border-border/60 bg-background/55 p-6 shadow-2xl backdrop-blur-xl md:p-8",
      )}
    >
      <p className="font-mono text-xs tracking-widest text-signal uppercase">{stop.label}</p>
      <h3
        className={cn(
          "font-medium tracking-tight text-balance",
          large ? "text-3xl md:text-5xl" : "text-2xl",
        )}
      >
        {stop.title}
      </h3>
      <p className="text-pretty text-muted-foreground">{stop.promise}</p>
      <div className="flex flex-wrap gap-1.5">
        {stop.surfaces.map((x) => (
          <Badge key={x} variant="outline" className="bg-background/60 backdrop-blur">
            {x}
          </Badge>
        ))}
      </div>
      <Button asChild variant="outline" className="rounded-full">
        <Link href={`/solutions/${stop.slug}`}>{stop.label}</Link>
      </Button>
    </div>
  )
}
