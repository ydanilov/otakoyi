"use client"

import { useState } from "react"

import { GenerativeWork } from "@/components/works/generative-work"
import type { WorkId } from "@/components/works/registry"
import type { Technology } from "@/content/technologies"
import { cn } from "@/lib/utils"

/**
 * What we build with: a large-type list of technologies — the surfaces we show on, then the
 * inputs that drive them — next to one live preview. Hover, focus or tap a row and the preview
 * switches to it; the row opens to show what it does and where it lives.
 * Small screens: the list alone, every row open.
 */
const GROUPS = [
  { kind: "output", label: "What it shows on" },
  { kind: "input", label: "What drives it" },
] as const

export function Technologies({ items }: { items: Technology[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]!
  const layers = [...new Set(items.map((t) => t.preview.work))] as WorkId[]

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
      <div className="space-y-10">
        {GROUPS.map((g) => (
          <section key={g.kind} aria-label={g.label}>
            <h3 className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {g.label}
            </h3>
            <ol className="border-t">
              {items.map((t, i) => {
                if (t.kind !== g.kind) return null
                const open = i === active
                return (
                  <li key={t.slug} className="border-b">
                    <button
                      type="button"
                      onPointerEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={open}
                      className="group grid w-full cursor-pointer grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-2 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-6"
                    >
                      <span
                        className={cn(
                          "font-mono text-xs tracking-widest transition-colors",
                          open ? "text-signal" : "text-muted-foreground",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "text-2xl font-medium tracking-tight text-balance transition-colors duration-300 md:text-4xl",
                          open ? "text-foreground" : "text-foreground lg:text-muted-foreground",
                          "group-hover:text-foreground",
                        )}
                      >
                        {t.name}
                      </span>
                      <span
                        className={cn(
                          "col-start-2 grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                          open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0",
                        )}
                      >
                        <span className="overflow-hidden">
                          <span className="mt-3 block max-w-xl text-pretty text-muted-foreground">
                            {t.line}
                          </span>
                          <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                            {t.where.map((w) => (
                              <span key={w}>{w}</span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>

      {/* One live preview, crossfading between the works behind each technology. */}
      <div aria-hidden className="relative hidden lg:block">
        <div className="sticky top-24 aspect-[4/5] overflow-hidden rounded-xl border">
          {layers.map((work) => {
            const on = current.preview.work === work
            const src = on ? current.preview : items.find((t) => t.preview.work === work)!.preview
            return (
              <GenerativeWork
                key={work}
                work={work}
                seed={src.seed}
                density={src.density}
                animate={on}
                className={cn(
                  "absolute inset-0 transition-[opacity,transform] duration-700",
                  on ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            )
          })}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6">
            <p className="font-mono text-xs tracking-widest text-signal uppercase">
              {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <p className="mt-1 text-lg font-medium">{current.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
