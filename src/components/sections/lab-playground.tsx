"use client"

import { useState } from "react"
import { CopyIcon, MinusIcon, PlusIcon, ShuffleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { GenerativeWork } from "@/components/works/generative-work"
import { workIds, works, type WorkId } from "@/components/works/registry"

/**
 * The Lab: the live engine with its real parameters. Same work + seed + density always gives
 * the same composition — that is what we hand over with every installation.
 */
export function LabPlayground() {
  const [work, setWork] = useState<WorkId>("signal-field")
  const [seed, setSeed] = useState(works["signal-field"].defaults.seed)
  const [density, setDensity] = useState(works["signal-field"].defaults.density)
  const [copied, setCopied] = useState(false)
  const def = works[work]
  const recipe = `${work}#${seed}@${density.toFixed(2)}`

  const pick = (id: WorkId) => {
    setWork(id)
    setSeed(works[id].defaults.seed)
    setDensity(works[id].defaults.density)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(recipe)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <GenerativeWork
        work={work}
        seed={seed}
        density={density}
        className="aspect-[4/3] rounded-xl lg:aspect-auto lg:min-h-[36rem]"
      />

      <div className="flex flex-col gap-8">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground" id="lab-work-label">
            System
          </p>
          <ToggleGroup
            type="single"
            value={work}
            onValueChange={(v) => v && pick(v as WorkId)}
            variant="outline"
            aria-labelledby="lab-work-label"
            className="flex-wrap"
          >
            {workIds.map((id) => (
              <ToggleGroupItem key={id} value={id}>
                {works[id].title}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="text-pretty text-muted-foreground">{def.description}</p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="lab-seed">Seed</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous seed"
              onClick={() => setSeed((s) => Math.max(0, s - 1))}
            >
              <MinusIcon />
            </Button>
            <input
              id="lab-seed"
              type="number"
              min={0}
              max={9999}
              value={seed}
              onChange={(e) => setSeed(Math.max(0, Math.min(9999, Number(e.target.value) || 0)))}
              className="h-9 w-28 rounded-md border bg-transparent px-3 text-center font-mono tabular-nums"
            />
            <Button
              variant="outline"
              size="icon"
              aria-label="Next seed"
              onClick={() => setSeed((s) => Math.min(9999, s + 1))}
            >
              <PlusIcon />
            </Button>
            <Button variant="signal" onClick={() => setSeed((s) => (s * 48271 + 11) % 9973)}>
              <ShuffleIcon /> New seed
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="lab-density">Density</Label>
            <span className="font-mono text-sm text-muted-foreground tabular-nums">
              {density.toFixed(2)}
            </span>
          </div>
          <input
            id="lab-density"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full accent-signal"
          />
        </div>

        <div className="mt-auto space-y-3 rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">
            Recipe — paste it into your brief and we will open exactly this.
          </p>
          <div className="flex items-center justify-between gap-3">
            <code className="truncate font-mono">{recipe}</code>
            <Button variant="ghost" size="sm" onClick={copy}>
              <CopyIcon /> {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
