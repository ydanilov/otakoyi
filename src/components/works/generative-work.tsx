"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { GenerativeMode } from "@/lib/tokens.generated"
import { works, type WorkId } from "./registry"
import type { BrandColors } from "./shader-canvas"

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
  className?: string
}

let webglSupport: boolean | undefined
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas")
      webglSupport = !!(c.getContext("webgl2") || c.getContext("webgl"))
    } catch {
      webglSupport = false
    }
  }
  return webglSupport
}

function useWebGL(): boolean | null {
  return useSyncExternalStore(
    () => () => {},
    detectWebGL,
    () => null,
  )
}

/** `inView` follows visibility; `seen` latches true the first time the element is visible. */
function useVisibility<T extends Element>() {
  const ref = useRef<T>(null)
  const [state, setState] = useState({ inView: false, seen: false })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        const inView = e?.isIntersecting ?? false
        setState((s) => ({ inView, seen: s.seen || inView }))
      },
      { rootMargin: "200px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, state] as const
}

export function GenerativeWork({
  work,
  seed,
  palette = "dark",
  brandColors,
  density,
  animate = true,
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
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  )
}
