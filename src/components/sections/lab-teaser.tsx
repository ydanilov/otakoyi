"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRightIcon, ShuffleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { GenerativeWork } from "@/components/works/generative-work"
import { workIds, works, type WorkId } from "@/components/works/registry"

/**
 * A taste of the Lab: one live work and a "new seed" button. Every press is a new,
 * reproducible composition — the point is that the system, not a video, is the product.
 */
export function LabTeaser() {
  const [work, setWork] = useState<WorkId>("signal-field")
  const [seed, setSeed] = useState(7)

  const shuffle = () => {
    // Deterministic walk through seeds and works — no Math.random() in render paths.
    const next = (seed * 48271 + 11) % 9973
    setSeed(next)
    setWork(workIds[next % workIds.length]!)
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-[1fr_1.4fr]">
      <div className="space-y-5">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Lab</p>
        <h2 className="text-3xl font-medium tracking-tight text-balance md:text-5xl">
          Not a video. A system you can play with.
        </h2>
        <p className="text-lg text-pretty text-muted-foreground">
          Every installation runs on an engine like this one. Press the button: a new composition,
          and the same seed always brings it back.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={shuffle} variant="signal" size="lg">
            <ShuffleIcon /> New seed
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/lab">
              Open the Lab <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        <p className="font-mono text-sm text-muted-foreground" aria-live="polite">
          {works[work].title} · seed {seed}
        </p>
      </div>
      <GenerativeWork work={work} seed={seed} className="aspect-[4/3] rounded-xl" />
    </div>
  )
}
