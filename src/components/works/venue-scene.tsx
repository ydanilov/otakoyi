"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import { useMotion } from "@/lib/motion"
import type { GenerativeMode } from "@/lib/tokens.generated"
import { cn } from "@/lib/utils"
import { useThemeMode, useVisibility, useWebGL } from "./runtime"

const VenueSceneCanvas = dynamic(() => import("./venue-scene-canvas"), { ssr: false })

export type VenueSceneProps = {
  /** 0..1 — camera position along the tour: exhibition stand → office lobby → music stage → museum room. */
  progress?: number
  /** Defaults to the current site theme. */
  palette?: GenerativeMode
  label?: string
  className?: string
}

/**
 * A small 3D venue with live generative works on its screens — the formats shown where they
 * actually live. Drive `progress` from scroll to fly the camera through it. three.js loads lazily
 * when the scene first comes into view; motion off (ADR-006) renders one still frame.
 */
export function VenueScene({
  progress = 0,
  palette,
  label = "3D venue with generative installations on an exhibition stand, in an office lobby, on a music stage and in an immersive museum room",
  className,
}: VenueSceneProps) {
  const motion = useMotion()
  const theme = useThemeMode()
  const webgl = useWebGL()
  const [ref, { inView, seen }] = useVisibility<HTMLDivElement>("400px")
  const [ready, setReady] = useState(false)

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      data-work="venue-scene"
      data-state={webgl === false ? "fallback" : ready ? "ready" : "loading"}
      className={cn("relative overflow-hidden bg-muted", className)}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--gen-2),transparent_60%)] opacity-25"
      />
      {webgl === true && seen && (
        <div className="absolute inset-0">
          <VenueSceneCanvas
            progress={progress}
            palette={palette ?? theme}
            animate={motion && inView}
            onReady={() => setReady(true)}
          />
        </div>
      )}
    </div>
  )
}
