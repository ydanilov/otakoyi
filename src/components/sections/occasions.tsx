"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"

import { GenerativeWork } from "@/components/works/generative-work"
import type { Solution } from "@/content/solutions"
import { cn } from "@/lib/utils"

const num = (i: number) => String(i + 1).padStart(2, "0")

/**
 * "What are you planning?": big typographic rows, one per occasion. The hovered or focused row
 * shows its live work and promise beside the list; small screens show the promise under each row.
 */
export function Occasions({ items }: { items: Solution[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]!
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-16">
      <ol className="border-t">
        {items.map((s, i) => (
          <li key={s.slug} className="border-b">
            <Link
              href={`/solutions/${s.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-5 outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-7"
            >
              <span
                className={cn(
                  "font-mono text-xs tracking-widest",
                  i === active ? "text-signal" : "text-muted-foreground",
                )}
              >
                {num(i)}
              </span>
              <span>
                <span
                  className={cn(
                    "block text-3xl font-medium tracking-tight transition-colors md:text-5xl",
                    i === active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
                <span className="mt-2 block max-w-xl text-pretty text-muted-foreground lg:hidden">
                  {s.promise}
                </span>
              </span>
              <ArrowUpRightIcon
                className={cn(
                  "size-6 transition-[transform,opacity] group-hover:translate-x-1 group-hover:-translate-y-1",
                  i === active ? "opacity-100" : "opacity-30",
                )}
              />
            </Link>
          </li>
        ))}
      </ol>
      <div aria-hidden className="relative hidden lg:block">
        <div className="sticky top-24 overflow-hidden rounded-xl border">
          {current.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={current.image}
              src={current.image}
              alt=""
              className="aspect-[4/5] w-full animate-in object-cover duration-700 fade-in-0"
            />
          ) : (
            <GenerativeWork
              key={current.slug}
              work={current.hero.work}
              seed={current.hero.seed}
              className="aspect-[4/5]"
            />
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6">
            <p className="text-pretty text-muted-foreground">{current.promise}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
