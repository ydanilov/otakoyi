"use client"

import { Badge } from "@/components/ui/badge"
import { GenerativeWork } from "@/components/works/generative-work"
import type { Technology } from "@/content/technologies"

const num = (i: number) => String(i + 1).padStart(2, "0")

/** Bento: one card per technology, its live work behind, what it does and where it lives. */
export function TechnologyBento({ items }: { items: Technology[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((t, i) => (
        <li
          key={t.slug}
          className="group relative isolate flex min-h-80 flex-col justify-between overflow-hidden rounded-xl border p-6 md:min-h-96 md:p-8"
        >
          {t.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={t.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-10 size-full object-cover opacity-80 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <GenerativeWork
              work={t.preview.work}
              seed={t.preview.seed}
              density={t.preview.density}
              className="absolute inset-0 -z-10 opacity-50 transition-opacity duration-500 group-hover:opacity-90"
            />
          )}
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
