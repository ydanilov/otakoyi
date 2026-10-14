"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { GenerativeMode } from "@/lib/tokens.generated"
import { works, type WorkId } from "./registry"
import { useVisibility, useWebGL } from "./runtime"
import type { BrandColors, WorkDomain, WorkPointer } from "./shader-canvas"

const ShaderCanvas = dynamic(() => import("./shader-canvas"), { ssr: false })

/**
 * The generative work contract. Every work on the site is rendered through this
 * component so that seed / palette / density behave identically everywhere
 * (pages, MDX, Storybook, visual tests).
 */
export type GenerativeWorkProps = {
  work: WorkId
  /** Deterministic seed. Same seed → same image. */
  seed?: number
  /** Token palette mode. Defaults to "dark" (dark-first). */
  palette?: GenerativeMode
  /** Client brand colors (highlight, base, secondary, ink). Overrides `palette`. */
  brandColors?: BrandColors
  /** 0..1 — how busy the composition is. */
  density?: number
  /** Animate over time. Forced off when site motion is off (ADR-006) and when offscreen. */
  animate?: boolean
  /** Sample a field shared with other surfaces (several screens showing one continuous work). */
  domain?: WorkDomain
  /** React to a pointer given in field coordinates. */
  pointer?: { current: WorkPointer | null }
  className?: string
}

export function GenerativeWork({
  work,
  seed,
  palette = "dark",
  brandColors,
  density,
  animate = true,
  domain,
  pointer,
  className,
}: GenerativeWorkProps) {
  const def = works[work]
  const motion = useMotion()
  const [ref, { inView, seen }] = useVisibility<HTMLDivElement>()
  const webgl = useWebGL()
  const [ready, setReady] = useState(false)

  // Mount once when first seen, then keep the canvas alive and just pause it offscreen.
  const showCanvas = webgl === true && seen

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${def.title} — generative work, seed ${seed ?? def.defaults.seed}`}
      data-work={work}
      data-state={webgl === false ? "fallback" : ready ? "ready" : "loading"}
      className={cn("relative overflow-hidden bg-muted", className)}
    >
      {/* Poster: shown until WebGL is ready, and as the fallback when it is unavailable. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,var(--gen-2),transparent_60%),radial-gradient(ellipse_at_80%_80%,var(--gen-3),transparent_55%)] opacity-40"
      />
      {showCanvas && (
        <div className="absolute inset-0">
          <ShaderCanvas
            fragmentShader={def.fragmentShader}
            seed={seed ?? def.defaults.seed}
            density={density ?? def.defaults.density}
            palette={palette}
            brandColors={brandColors}
            animate={animate && motion && inView}
            frozenTime={12}
            domain={domain}
            pointer={pointer}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  )
}
