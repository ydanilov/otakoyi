"use client"

import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { WorkCard } from "@/components/sections/work-card"
import { Button } from "@/components/ui/button"
import type { Case } from "@/content/cases"
import { CaseVisual } from "@/components/sections/case-visual"
import { cn } from "@/lib/utils"
import { useScrollProgress } from "@/lib/use-scroll-progress"

const HEADER = 56 // px — sticky site header height (h-14)
const pad = (n: number) => String(n).padStart(2, "0")
const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

type WorksReelProps = { items: Case[] }

/**
 * Selected installations as a fullscreen reel: each installation takes the whole screen and the
 * next one wipes in from below as you scroll. Corner labels show previous / next, the centre
 * carries the name, the headline result and the way into the case.
 * Under motion off (ADR-006) it falls back to the card grid; a plain link list is what
 * assistive tech reads.
 */
export function WorksReel({ items }: WorksReelProps) {
  const [ref, progress] = useScrollProgress<HTMLDivElement>(HEADER)
  const n = items.length
  const span = Math.max(1, n - 1)
  const position = progress * span
  const active = Math.min(n - 1, Math.round(position))

  return (
    <section id="installations" aria-labelledby="installations-title">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 pt-20 pb-12 md:px-8 md:pt-28">
        <div className="max-w-2xl space-y-3">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Selected installations
          </p>
          <h2
            id="installations-title"
            className="text-3xl font-medium tracking-tight text-balance md:text-5xl"
          >
            Built for stages, stands and lobbies
          </h2>
        </div>
        <Button asChild variant="ghost">
          <Link href="/works">
            All installations
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      {/* Assistive tech: the same installations as a simple list. */}
      <ul className="sr-only motion-off:hidden">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/works/${item.slug}`} tabIndex={-1}>
              {item.title} — {item.location}
              {item.results[0] && `. ${item.results[0].value} ${item.results[0].label}`}
            </Link>
          </li>
        ))}
      </ul>

      {/* Reduced motion: the card grid. */}
      <ul className="mx-auto hidden max-w-7xl gap-x-6 gap-y-12 px-4 pb-20 md:grid-cols-2 md:px-8 md:pb-28 lg:grid-cols-3 motion-off:grid">
        {items.map((item) => (
          <li key={item.slug}>
            <WorkCard item={item} />
          </li>
        ))}
      </ul>

      {/* The reel. */}
      <div
        ref={ref}
        className="relative motion-off:hidden"
        style={{ height: `${n * 100}svh` }}
        data-works-reel
        data-active={items[active]?.slug}
      >
        <div className="sticky top-14 h-[calc(100svh-3.5rem)] overflow-hidden bg-background">
          {items.map((item, i) => {
            // How far this layer has wiped in (layer 0 is always fully in).
            const reveal = i === 0 ? 1 : clamp01(position - (i - 1))
            // How far the next layer has covered this one — push it back a little.
            const covered = clamp01(position - i)
            return (
              <div
                key={item.slug}
                aria-hidden
                className="absolute inset-0 will-change-[clip-path]"
                style={{
                  clipPath: `inset(${((1 - reveal) * 100).toFixed(2)}% 0 0 0)`,
                  zIndex: i,
                }}
              >
                <div
                  className="absolute inset-0 origin-top"
                  style={{ transform: `scale(${(1 + covered * 0.06).toFixed(4)})` }}
                >
                  <CaseVisual item={item} animate={i === active} className="absolute inset-0" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/40" />
                {/* Centre scrim: keeps title, location and result readable over busy works. */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,var(--background)_0%,transparent_100%)] opacity-90" />
              </div>
            )
          })}

          {/* Overlay copy for the active installation. */}
          <div className="absolute inset-0 z-50 flex flex-col">
            <div
              aria-hidden
              className="mx-auto flex w-full max-w-7xl items-start justify-between px-4 pt-10 font-mono text-xs tracking-widest text-muted-foreground uppercase md:px-8"
            >
              <span>
                <span className="text-foreground">{pad(active + 1)}</span> / {pad(n)}
              </span>
            </div>

            <div className="relative mx-auto grid w-full max-w-7xl flex-1 place-items-center px-4 md:px-8">
              {items.map((item, i) => {
                const result = item.results[0]
                const on = i === active
                return (
                  <div
                    key={item.slug}
                    inert={!on}
                    className={cn(
                      "col-start-1 row-start-1 flex flex-col items-center text-center transition-[opacity,translate,filter] duration-500 ease-out",
                      on ? "blur-0 opacity-100" : "pointer-events-none opacity-0 blur-sm",
                      !on && (i < active ? "-translate-y-8" : "translate-y-8"),
                    )}
                  >
                    <div aria-hidden className="flex flex-col items-center">
                      <p className="font-mono text-xs tracking-[0.3em] text-signal uppercase">
                        {item.formats.join(" · ")}
                      </p>
                      <p className="mt-5 text-6xl leading-[0.85] font-medium tracking-tighter text-balance md:text-9xl">
                        {item.title}
                      </p>
                      <p className="mt-5 max-w-md text-lg text-pretty text-muted-foreground">
                        {item.location}
                      </p>
                      {result && (
                        <div className="mt-10 flex flex-col items-center border-t border-foreground/15 pt-6">
                          <span className="text-4xl font-medium tracking-tight tabular-nums md:text-5xl">
                            {result.value}
                          </span>
                          <span className="mt-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            {result.label}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button asChild variant="outline" className="mt-10 backdrop-blur">
                      <Link href={`/works/${item.slug}`}>
                        Open the case<span className="sr-only">: {item.title}</span>
                        <ArrowRightIcon data-icon="inline-end" />
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
