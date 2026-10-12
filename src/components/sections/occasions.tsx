"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUpRightIcon } from "lucide-react"

import { GenerativeWork } from "@/components/works/generative-work"
import type { Solution } from "@/content/solutions"
import { cn } from "@/lib/utils"

/**
 * "For your …" — the four buyer situations as a row of panels. The hovered (or focused) panel
 * widens and its work comes alive; each panel leads to that situation's landing page.
 * On small screens the panels stack.
 */
export function Occasions({ items }: { items: Solution[] }) {
  const [active, setActive] = useState(0)

  return (
    <ul className="flex flex-col gap-3 lg:h-[34rem] lg:flex-row">
      {items.map((s, i) => {
        const open = i === active
        return (
          <li
            key={s.slug}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={cn(
              "relative min-h-72 overflow-hidden rounded-xl border transition-[flex-grow] duration-700 ease-out lg:min-h-0",
              open ? "lg:flex-[2.6]" : "lg:flex-1",
            )}
          >
            <Link
              href={`/solutions/${s.slug}`}
              className="group absolute inset-0 flex flex-col justify-end p-6 outline-none focus-visible:ring-2 focus-visible:ring-ring md:p-8"
            >
              <GenerativeWork
                work={s.hero.work}
                seed={s.hero.seed}
                animate={open}
                className={cn(
                  "absolute inset-0 -z-10 transition-[opacity,transform] duration-700",
                  open ? "scale-100 opacity-100" : "scale-105 opacity-40",
                )}
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-background/10"
              />
              <p className="font-mono text-xs tracking-widest text-signal uppercase">
                0{i + 1} · For your
              </p>
              <h3 className="mt-2 flex items-center gap-2 text-2xl font-medium tracking-tight md:text-3xl">
                {s.label}
                <ArrowUpRightIcon className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </h3>
              <p
                className={cn(
                  "mt-3 max-w-md text-pretty text-muted-foreground transition-opacity duration-500",
                  open ? "opacity-100" : "lg:opacity-0",
                )}
              >
                {s.promise}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
