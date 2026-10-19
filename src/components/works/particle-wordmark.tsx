"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { useVisibility, useWebGL } from "./runtime"

const ParticleWordmarkCanvas = dynamic(() => import("./particle-wordmark-canvas"), { ssr: false })

export type ParticleWordmarkProps = {
  /** The word drawn in particles. */
  text: string
  seed?: number
  /** 0..1 — 0 assembled, 1 scattered. Drive it from scroll. */
  scatter?: number
  className?: string
}

/**
 * The studio's name as a live particle field: it reacts to the pointer like an installation
 * reacts to visitors, and comes apart as you scroll. three.js loads lazily, only when visible.
 * Motion off (ADR-006) → a still, deterministic frame. No WebGL → nothing (the page's own
 * heading carries the message).
 */
export function ParticleWordmark({
  text,
  seed = 7,
  scatter = 0,
  className,
}: ParticleWordmarkProps) {
  const motion = useMotion()
  const webgl = useWebGL()
  const [ref, { inView, seen }] = useVisibility<HTMLDivElement>()
  const [ready, setReady] = useState(false)

  return (
    <div
      ref={ref}
      aria-hidden
      data-work="particle-wordmark"
      data-state={webgl === false ? "fallback" : ready ? "ready" : "loading"}
      className={cn(
        "pointer-events-none relative overflow-hidden transition-opacity duration-1000",
        ready ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {webgl === true && seen && (
        <div className="absolute inset-0">
          <ParticleWordmarkCanvas
            text={text}
            seed={seed}
            scatter={motion ? scatter : 0}
            animate={motion && inView}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  )
}
