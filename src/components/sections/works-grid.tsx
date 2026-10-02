"use client"

import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Case, CaseFormat } from "@/content/cases"
import { WorkCard } from "./work-card"

type WorksGridProps = { items: Case[]; formats: readonly CaseFormat[] }

export function WorksGrid({ items, formats }: WorksGridProps) {
  const [tag, setTag] = useState<string>("all")
  const visible = tag === "all" ? items : items.filter((i) => i.formats.includes(tag as CaseFormat))

  return (
    <div className="space-y-10">
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
      {visible.length === 0 ? (
        <p className="text-muted-foreground">No installations in this format yet.</p>
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
