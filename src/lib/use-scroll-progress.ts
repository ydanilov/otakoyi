"use client"

import { useEffect, useRef, useState } from "react"

const REDUCED = "(prefers-reduced-motion: reduce)"

/**
 * Progress (0..1) of scrolling through a tall "pinned" section: 0 when its top reaches
 * `offset` px below the viewport top, 1 when its bottom reaches the viewport bottom.
 * Stays 0 under `prefers-reduced-motion` — pinned sections render their static layout there.
 */
export function useScrollProgress<T extends HTMLElement>(offset = 0) {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia(REDUCED).matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const travel = rect.height - (window.innerHeight - offset)
      const p = travel > 0 ? (offset - rect.top) / travel : 0
      setProgress(Math.min(1, Math.max(0, p)))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [offset])

  return [ref, progress] as const
}
