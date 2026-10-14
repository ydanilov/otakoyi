"use client"

import { ArrowDownIcon } from "lucide-react"

import { Process, processSteps } from "@/components/sections/process"
import { Button } from "@/components/ui/button"
import { GenerativeWork } from "@/components/works/generative-work"
import { proposalHref, site } from "@/config/site"
import { cn } from "@/lib/utils"
import { useEased } from "@/lib/use-eased"
import { useMotion } from "@/lib/motion"
import { useScrollProgress } from "@/lib/use-scroll-progress"

const HEADER = 56 // px — sticky site header height (h-14)

const finalStep = {
  title: "Your turn",
  time: "Today",
  description: "Venue and date are enough to start. In week one you see it running in your brand",
} as const

const steps = [...processSteps, finalStep]
const pad = (n: number, len = 2) => String(n).padStart(len, "0")

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (v: number) => v * v * (3 - 2 * v)
const inOut = (v: number) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2)

/**
 * Where a step sits for x = (scroll position in steps) − its index:
 * x < 0 waiting below · 0..1 current · then its caption and description fade first, the title
 * shrinks and greys into the stack on the left edge, which keeps climbing with the scroll and
 * fades out after a few rows.
 */
export function stepStyle(x: number) {
  const enter = 1 - smooth(clamp01((x + 0.1) / 0.25)) // 1 → still below, 0 → in place
  const lift = inOut(clamp01((x - 0.6) / 0.42)) // 0 → current, 1 → in the stack
  const details = 1 - smooth(clamp01(lift / 0.4)) // caption + description go first
  const climb = Math.max(0, x - 1.02)
  const fade = clamp01((climb - 2.4) / 1.6)
  return {
    enter,
    lift,
    details,
    climb,
    scale: 1 - 0.6 * lift,
    blur: enter * 10,
    opacity: (1 - enter) * (1 - fade),
  }
}

type PinnedProcessProps = {
  /** Where "Skip the steps" jumps to. */
  skipTo?: string
}

/**
 * "From brief to opening night" as a pinned scroll story: one step per screen, a build-progress
 * counter, a skip link, and the CTA as the last step. The generative work in the background gets
 * denser as the project takes shape. Under motion off (ADR-006) it falls back to the static
 * step grid; that grid is also what assistive tech reads.
 */
export function PinnedProcess({ skipTo = "#faq" }: PinnedProcessProps) {
  const [ref, raw] = useScrollProgress<HTMLDivElement>(HEADER)
  const motion = useMotion()
  const progress = useEased(raw, motion)
  const active = Math.min(steps.length - 1, Math.floor(progress * steps.length))
  const isLast = active === steps.length - 1

  return (
    <section id="process" aria-labelledby="process-title">
      {/* Static layout: motion off, and the accessible version of the story. */}
      <div className="sr-only motion-off:not-sr-only motion-off:mx-auto motion-off:block motion-off:max-w-7xl motion-off:px-4 motion-off:py-20 md:motion-off:px-8 md:motion-off:py-28">
        <div className="mb-12 max-w-2xl space-y-3">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            How it works
          </p>
          <h2
            id="process-title"
            className="text-3xl font-medium tracking-tight text-balance md:text-5xl"
          >
            From brief to opening night
          </h2>
          <p className="text-lg text-pretty text-muted-foreground">
            Fixed milestones, a live prototype in week one, and no surprises on site
          </p>
        </div>
        <Process />
      </div>

      {/* Pinned story — visual duplicate of the content above (aria-hidden), except for the CTA. */}
      <div
        ref={ref}
        className="relative motion-off:hidden"
        style={{ height: `${steps.length * 90 + 10}svh` }}
        data-pinned-process
        data-step={active + 1}
      >
        <div className="sticky top-14 isolate flex h-[calc(100svh-3.5rem)] flex-col overflow-hidden">
          <GenerativeWork
            work="contour"
            seed={4}
            density={0.15 + progress * 0.55}
            className="absolute inset-0 -z-10 opacity-60"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/30"
          />

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 md:px-8 md:py-14">
            <div aria-hidden className="flex items-start justify-between gap-6">
              <div className="space-y-3">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  How it works
                </p>
                <p className="max-w-md text-2xl font-medium tracking-tight md:text-4xl">
                  From brief to opening night
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Build progress
                </p>
                <p className="font-mono text-5xl font-medium tracking-tighter tabular-nums md:text-8xl">
                  {pad(Math.round(progress * 100), 3)}
                  <span className="text-2xl text-muted-foreground md:text-4xl">%</span>
                </p>
                <div className="mt-3 flex justify-end gap-1">
                  {steps.map((s, i) => (
                    <span
                      key={s.title}
                      className={cn(
                        "h-1 w-6 rounded-full bg-border transition-colors duration-300 md:w-10",
                        i <= active && "bg-signal",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto grid items-end gap-8 md:grid-cols-[1fr_auto]">
              <div>
                {/* --lift: how far a finished step rises above the current one; --row: stack pitch. */}
                <div
                  aria-hidden
                  className="grid [--lift:9.5rem] [--row:1.9rem] md:[--lift:14rem] md:[--row:3rem]"
                >
                  {steps.map((s, i) => {
                    const x = progress * steps.length - i
                    // The last step (the CTA) never leaves.
                    const st = stepStyle(i === steps.length - 1 ? Math.min(x, 0.55) : x)
                    return (
                      <div
                        key={s.title}
                        data-active={i === active}
                        className="col-start-1 row-start-1 max-w-2xl origin-bottom-left will-change-transform"
                        style={{
                          opacity: st.opacity,
                          filter: st.blur > 0.05 ? `blur(${st.blur}px)` : undefined,
                          transform: `translateY(calc(${st.lift} * var(--lift) * -1 - ${st.climb} * var(--row) + ${st.enter} * 2.5rem)) scale(${st.scale})`,
                        }}
                      >
                        <p
                          className="flex items-center gap-3 font-mono text-xs text-muted-foreground"
                          style={{
                            opacity: st.details,
                            transform: `translateY(${(1 - st.details) * -0.5}rem)`,
                          }}
                        >
                          <span className="text-signal">{pad(i + 1)}</span>
                          <span className="h-px w-8 bg-border" />
                          <span>{pad(steps.length)}</span>
                          <span>· {s.time}</span>
                        </p>
                        <p
                          className="mt-4 text-4xl font-medium tracking-tighter md:text-7xl md:whitespace-nowrap"
                          style={{
                            color: `color-mix(in oklab, var(--muted-foreground) ${Math.round(st.lift * 100)}%, var(--foreground))`,
                          }}
                        >
                          <span
                            className="inline-block overflow-hidden align-bottom font-mono whitespace-nowrap"
                            style={{ maxWidth: `${st.lift * 1.6}em`, opacity: st.lift }}
                          >
                            {pad(i + 1)}&nbsp;
                          </span>
                          {s.title}
                        </p>
                        <p
                          className="mt-4 max-w-lg text-lg text-pretty text-muted-foreground"
                          style={{
                            opacity: st.details,
                            transform: `translateY(${(1 - st.details) * -0.75}rem)`,
                          }}
                        >
                          {s.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
                <div
                  inert={!isLast}
                  className={cn(
                    "mt-8 transition-opacity duration-500",
                    isLast ? "opacity-100" : "opacity-0",
                  )}
                >
                  <Button asChild size="lg" variant="signal">
                    <a href={proposalHref}>{site.cta.label}</a>
                  </Button>
                </div>
              </div>
              {!isLast && (
                <a
                  href={skipTo}
                  aria-hidden
                  tabIndex={-1}
                  className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase hover:text-foreground"
                >
                  Skip the steps <ArrowDownIcon className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
