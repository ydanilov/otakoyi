"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { GenerativeWork } from "@/components/works/generative-work"
import type { Solution } from "@/content/solutions"
import { venues } from "@/content/venues"
import { cn } from "@/lib/utils"

/*
 * Four layout options for the "What are you planning?" block on /solutions, shown one under
 * another so the owner can pick. The chosen one replaces `Occasions`; the rest get deleted.
 */

const num = (i: number) => String(i + 1).padStart(2, "0")
const stillFor = (s: Solution) => venues[Math.round(s.venue * 3)]!.image

/** A — Index: big typographic rows; the hovered row shows its live work beside it. */
export function OccasionsIndex({ items }: { items: Solution[] }) {
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
          <GenerativeWork
            key={current.slug}
            work={current.hero.work}
            seed={current.hero.seed}
            className="aspect-[4/5]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-6">
            <p className="text-pretty text-muted-foreground">{current.promise}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** B — Bento: six equal cards, each with its live work, promise and surfaces. */
export function OccasionsBento({ items }: { items: Solution[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.slug} className="relative min-h-80 overflow-hidden rounded-xl border">
          <Link
            href={`/solutions/${s.slug}`}
            className="group absolute inset-0 flex flex-col justify-between p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <GenerativeWork
              work={s.hero.work}
              seed={s.hero.seed}
              animate={false}
              className="absolute inset-0 -z-10 opacity-50 transition-opacity duration-500 group-hover:opacity-90"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-background/20"
            />
            <p className="font-mono text-xs tracking-widest text-signal uppercase">{num(i)}</p>
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-medium tracking-tight">
                {s.label}
                <ArrowUpRightIcon className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p className="mt-2 text-pretty text-muted-foreground">{s.promise}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {s.surfaces.slice(0, 2).map((x) => (
                  <Badge key={x} variant="outline" className="bg-background/60 backdrop-blur">
                    {x}
                  </Badge>
                ))}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** C — Venues: the rendered venue stills as photos, two featured wide, four below. */
export function OccasionsVenues({ items }: { items: Solution[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li
          key={s.slug}
          className={cn(
            "relative overflow-hidden rounded-xl border",
            i < 2 ? "aspect-[16/10] lg:col-span-2" : "aspect-[4/5]",
          )}
        >
          <Link
            href={`/solutions/${s.slug}`}
            className="group absolute inset-0 flex flex-col justify-end p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stillFor(s)}
              alt=""
              loading="lazy"
              className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/40 to-transparent"
            />
            <p className="font-mono text-xs tracking-widest text-signal uppercase">
              {num(i)} · For your
            </p>
            <h3 className="mt-2 flex items-center gap-2 text-2xl font-medium tracking-tight md:text-3xl">
              {s.label}
              <ArrowUpRightIcon className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </h3>
            {i < 2 && (
              <p className="mt-2 max-w-md text-pretty text-muted-foreground">{s.promise}</p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** D — Selector: a tab list on the left, one big detail panel on the right. */
export function OccasionsSelector({ items }: { items: Solution[] }) {
  const [active, setActive] = useState(0)
  const s = items[active]!
  return (
    <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
      <div role="tablist" aria-label="Occasions" className="flex gap-2 overflow-x-auto lg:flex-col">
        {items.map((x, i) => (
          <button
            key={x.slug}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 cursor-pointer rounded-lg border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === active
                ? "border-signal/60 bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="mr-3 font-mono text-xs text-signal">{num(i)}</span>
            {x.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="relative overflow-hidden rounded-xl border">
        <GenerativeWork
          key={s.slug}
          work={s.hero.work}
          seed={s.hero.seed}
          className="absolute inset-0 -z-10 opacity-60"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/20"
        />
        <div className="max-w-xl space-y-5 p-6 md:p-10">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">For your</p>
          <h3 className="text-3xl font-medium tracking-tight text-balance md:text-5xl">
            {s.title}
          </h3>
          <p className="text-pretty text-muted-foreground">{s.promise}</p>
          <dl className="grid grid-cols-3 gap-4 border-t pt-5">
            {s.facts.slice(0, 3).map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {f.label}
                </dt>
                <dd className="mt-1 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/solutions/${s.slug}`}
            className="inline-flex items-center gap-2 font-medium text-signal hover:underline"
          >
            {s.label} <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
