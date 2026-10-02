"use client"

import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GenerativeWork } from "@/components/works/generative-work"
import { workIds, works, type WorkId } from "@/components/works/registry"
import { brandPresets } from "@/content/brand-presets"

export const customisationPoints = [
  {
    title: "Your colours & type",
    description: "Brand palette and typeface drive every frame — nothing off-brand.",
  },
  {
    title: "Your shapes",
    description: "Logo, key visual or product silhouette become generative forms.",
  },
  {
    title: "Your data",
    description: "Live feeds from your product, CRM, markets or social set the motion.",
  },
  {
    title: "Your audience",
    description: "Motion tracking, touch, sound or phones let visitors play with it.",
  },
] as const

/** Interactive sales demo: the same generative system, recoloured per client brand. */
export function BrandDemo() {
  const [brand, setBrand] = useState(brandPresets[0]!.name)
  const [work, setWork] = useState<WorkId>("signal-field")
  const preset = brandPresets.find((p) => p.name === brand) ?? brandPresets[0]!

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
      <ul className="space-y-6">
        {customisationPoints.map((p) => (
          <li key={p.title} className="border-l-2 border-signal pl-4">
            <p className="text-lg font-medium">{p.title}</p>
            <p className="text-muted-foreground">{p.description}</p>
          </li>
        ))}
      </ul>
      <div className="space-y-4">
        <GenerativeWork
          work={work}
          seed={works[work].defaults.seed}
          brandColors={preset.colors}
          className="aspect-[16/10] rounded-xl"
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ToggleGroup
            type="single"
            value={brand}
            onValueChange={(v) => v && setBrand(v)}
            variant="outline"
            aria-label="Example brand palette"
          >
            {brandPresets.map((p) => (
              <ToggleGroupItem key={p.name} value={p.name} className="gap-2 px-3">
                <span
                  aria-hidden
                  className="size-3 rounded-full"
                  style={{ background: p.colors[0] }}
                />
                {p.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ToggleGroup
            type="single"
            value={work}
            onValueChange={(v) => v && setWork(v as WorkId)}
            variant="outline"
            aria-label="Installation system"
          >
            {workIds.map((id) => (
              <ToggleGroupItem key={id} value={id} className="px-3">
                {works[id].title}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <p className="text-sm text-muted-foreground">
          Same system, different brand. Pick a palette — this is how your installation is tailored.
        </p>
      </div>
    </div>
  )
}
