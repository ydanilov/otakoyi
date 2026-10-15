"use client"

import { Fragment, useEffect, useRef } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type ReactiveHeadlineProps = {
  text: string
  /** Weight at rest (Geist variable axis, 100–900). */
  restWeight?: number
  /** Weight right under the pointer. */
  peakWeight?: number
  /** Influence radius in px. */
  radius?: number
  /** Element to render. Defaults to h1. */
  as?: "h1" | "h2" | "p"
  /** Visual duplicate of text given elsewhere (e.g. an sr-only h1): hidden from assistive tech. */
  decorative?: boolean
  className?: string
  style?: React.CSSProperties
}

const FINE_POINTER = "(pointer: fine)"

/**
 * Headline whose letters thicken around the pointer — the page reacts to people the way an
 * installation does. Pointer-only and off when site motion is off (ADR-006), so the static render
 * (and visual tests) always show every letter at `restWeight`.
 */
export function ReactiveHeadline({
  text,
  restWeight = 500,
  peakWeight = 800,
  radius = 220,
  as: Tag = "h1",
  decorative = false,
  className,
  style,
}: ReactiveHeadlineProps) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null)
  const motion = useMotion()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (!motion || !window.matchMedia(FINE_POINTER).matches) {
      root
        .querySelectorAll<HTMLSpanElement>("[data-letter]")
        .forEach((el) => el.style.setProperty("--w", String(restWeight)))
      return
    }

    const letters = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-letter]"))
    let centers: { x: number; y: number }[] = []
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const measure = () => {
      centers = letters.map((el) => {
        const r = el.getBoundingClientRect()
        return {
          x: r.left + r.width / 2 + window.scrollX,
          y: r.top + r.height / 2 + window.scrollY,
        }
      })
    }

    const paint = () => {
      frame = 0
      // Re-measure every frame: headlines may move (scroll parallax), and it is only a few spans.
      measure()
      letters.forEach((el, i) => {
        const c = centers[i]
        let w = restWeight
        if (pointer && c) {
          const d = Math.hypot(pointer.x - c.x, pointer.y - c.y)
          const t = Math.max(0, 1 - d / radius)
          // smoothstep for a soft falloff
          w = restWeight + (peakWeight - restWeight) * t * t * (3 - 2 * t)
        }
        el.style.setProperty("--w", w.toFixed(0))
      })
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const onMove = (e: PointerEvent) => {
      pointer = { x: e.pageX, y: e.pageY }
      schedule()
    }
    const onLeave = () => {
      pointer = null
      schedule()
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    window.addEventListener("pointermove", onMove, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    window.addEventListener("resize", measure)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", measure)
    }
  }, [restWeight, peakWeight, radius, motion])

  const words = text.split(" ")

  return (
    // Letters are split into spans for the effect; the heading's text content stays the plain
    // sentence once (copy, SEO, tests) and aria-label keeps screen readers from spelling it out.
    <Tag
      ref={ref}
      className={className}
      style={style}
      aria-label={decorative || Tag === "p" ? undefined : text}
      aria-hidden={decorative || undefined}
      data-reactive-headline
    >
      <span aria-hidden>
        {words.map((word, wi) => (
          <Fragment key={`${word}-${wi}`}>
            {wi > 0 && " "}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, ci) => (
                <span
                  key={ci}
                  data-letter
                  className={cn(
                    "inline-block transition-[font-variation-settings] duration-300 ease-out",
                    "[font-variation-settings:'wght'_var(--w)]",
                  )}
                  style={{ "--w": restWeight } as React.CSSProperties}
                >
                  {ch}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
