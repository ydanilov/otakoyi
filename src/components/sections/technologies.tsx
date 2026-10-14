"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { GenerativeWork } from "@/components/works/generative-work"
import type { Technology } from "@/content/technologies"
import { cn } from "@/lib/utils"

const num = (i: number) => String(i + 1).padStart(2, "0")

/**
 * Selector: a tab list on the left (a horizontal scroller on small screens) and one big panel on
 * the right with the selected technology's live work, what it does and where it lives.
 */
export function TechnologySelector({ items, label }: { items: Technology[]; label: string }) {
  const [active, setActive] = useState(0)
  const t = items[active]!
  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-10">
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((x, i) => (
          <button
            key={x.slug}
            id={`tech-tab-${x.slug}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-controls="tech-panel"
            onClick={() => setActive(i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className={cn(
              "flex shrink-0 cursor-pointer items-baseline gap-3 rounded-lg border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === active
                ? "border-signal/60 bg-muted text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground lg:border-border",
            )}
          >
            <span className="font-mono text-xs text-signal">{num(i)}</span>
            {x.name}
          </button>
        ))}
      </div>
      <div
        id="tech-panel"
        role="tabpanel"
        aria-labelledby={`tech-tab-${t.slug}`}
        className="relative isolate flex min-h-[28rem] overflow-hidden rounded-xl border lg:min-h-[32rem]"
      >
        {t.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={t.image}
            src={t.image}
            alt=""
            className="absolute inset-0 -z-10 size-full animate-in object-cover duration-700 fade-in-0"
          />
        ) : (
          <GenerativeWork
            key={t.preview.work}
            work={t.preview.work}
            seed={t.preview.seed}
            density={t.preview.density}
            className="absolute inset-0 -z-10"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-transparent md:bg-gradient-to-r md:via-background/60"
        />
        <div className="mt-auto max-w-xl space-y-5 p-6 md:p-10">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">
            {num(active)} / {num(items.length - 1)}
          </p>
          <h3 className="text-3xl font-medium tracking-tight text-balance md:text-5xl">{t.name}</h3>
          <p className="text-lg text-pretty text-muted-foreground">{t.line}</p>
          <div className="flex flex-wrap gap-1.5">
            {t.where.map((w) => (
              <Badge key={w} variant="outline" className="bg-background/60 backdrop-blur">
                {w}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Bento: one card per technology, its live work behind, what it does and where it lives. */
export function TechnologyBento({ items }: { items: Technology[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((t, i) => (
        <li
          key={t.slug}
          className="group relative isolate flex min-h-80 flex-col justify-between overflow-hidden rounded-xl border p-6 md:min-h-96 md:p-8"
        >
          <GenerativeWork
            work={t.preview.work}
            seed={t.preview.seed}
            density={t.preview.density}
            className="absolute inset-0 -z-10 opacity-50 transition-opacity duration-500 group-hover:opacity-90"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/20"
          />
          <p className="font-mono text-xs tracking-widest text-signal uppercase">{num(i)}</p>
          <div>
            <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{t.name}</h3>
            <p className="mt-2 max-w-md text-pretty text-muted-foreground">{t.line}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {t.where.map((w) => (
                <Badge key={w} variant="outline" className="bg-background/60 backdrop-blur">
                  {w}
                </Badge>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
