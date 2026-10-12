"use client"

import Link from "next/link"
import { useState } from "react"
import { LayoutGridIcon, ListIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GenerativeWork } from "@/components/works/generative-work"
import type { Case, CaseFormat } from "@/content/cases"
import { WorkCard } from "./work-card"

type WorksGridProps = { items: Case[]; formats: readonly CaseFormat[] }

export function WorksGrid({ items, formats }: WorksGridProps) {
  const [tag, setTag] = useState<string>("all")
  const [view, setView] = useState<"grid" | "list">("grid")
  const visible = tag === "all" ? items : items.filter((i) => i.formats.includes(tag as CaseFormat))

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ToggleGroup
          type="single"
          value={tag}
          onValueChange={(v) => setTag(v || "all")}
          variant="outline"
          aria-label="Filter installations by format"
          className="flex-wrap"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          {formats.map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as "grid" | "list")}
          variant="outline"
          aria-label="View"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGridIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {visible.length === 0 ? (
        <p className="text-muted-foreground">No installations in this format yet.</p>
      ) : view === "list" ? (
        <ol className="border-t">
          {visible.map((item, i) => (
            <li key={item.slug} className="border-b">
              <Link
                href={`/works/${item.slug}`}
                className="group grid items-center gap-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-[3rem_1.4fr_1fr_auto_8rem]"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl font-medium tracking-tight transition-transform group-hover:translate-x-2 md:text-4xl">
                  {item.title}
                </span>
                <span className="text-muted-foreground">
                  {item.location} · {item.year}
                </span>
                <span className="flex flex-wrap gap-1">
                  {item.formats.map((f) => (
                    <Badge key={f} variant="secondary">
                      {f}
                    </Badge>
                  ))}
                </span>
                <GenerativeWork
                  work={item.hero.work}
                  seed={item.hero.seed}
                  density={item.hero.density}
                  animate={false}
                  className="hidden aspect-[4/3] rounded-md opacity-60 transition-opacity group-hover:opacity-100 md:block"
                />
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {visible.map((item) => (
            <li key={item.slug}>
              <WorkCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
