"use client"

import { useEffect, useRef } from "react"

import { GenerativeWork } from "@/components/works/generative-work"
import type { WorkId } from "@/components/works/registry"
import type { BrandColors, WorkPointer } from "@/components/works/shader-canvas"
import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type HeroFieldProps = {
  work?: WorkId
  seed?: number
  density?: number
  /** Client or prototype colors instead of the token palette. */
  brandColors?: BrandColors
  /** Classes for the legibility scrim over the work. Defaults to the bottom-up fade. */
  scrimClassName?: string
  className?: string
}

/**
 * Live generative background for page heroes. It reacts to the cursor the way an installation
 * reacts to people in front of it. Decorative: hidden from assistive tech. Motion off (ADR-006):
 * a still frame with no pointer reaction.
 */
export function HeroField({
  work = "contour",
  seed,
  density,
  brandColors,
  scrimClassName,
  className,
}: HeroFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const pointer = useRef<WorkPointer>({ x: 0, y: 0, on: false })
  const motion = useMotion()

  useEffect(() => {
    if (!motion) return
    const move = (e: PointerEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      const inside = r.height > 0 && x >= 0 && y >= 0 && x <= r.width && y <= r.height
      // Field coordinates match the shader's aspectUv: x scaled by aspect, y up.
      pointer.current = inside
        ? { x: x / r.height, y: 1 - y / r.height, on: true }
        : { ...pointer.current, on: false }
    }
    const leave = () => (pointer.current = { ...pointer.current, on: false })
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
    }
  }, [motion])

  return (
    <div ref={ref} aria-hidden className={cn("absolute inset-0 -z-10", className)}>
      <GenerativeWork
        work={work}
        seed={seed}
        density={density}
        brandColors={brandColors}
        pointer={pointer}
        className="absolute inset-0"
      />
      <div
        className={cn(
          "absolute inset-0",
          scrimClassName ?? "bg-gradient-to-t from-background via-background/70 to-background/30",
        )}
      />
    </div>
  )
}
