"use client"

import { useEffect, useRef } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type SpecMarqueeProps = { items: readonly string[]; className?: string }

/**
 * An endless strip of concrete specs (surfaces, timelines, inputs). It drifts on its own and
 * speeds up and skews with scroll velocity — the page answers your movement. The OS-level
 * `prefers-reduced-motion` is not used (ADR-006); motion off shows a static, wrapping row.
 */
export function SpecMarquee({ items, className }: SpecMarqueeProps) {
  const track = useRef<HTMLUListElement>(null)
  const motion = useMotion()

  useEffect(() => {
    const el = track.current
    if (!el || !motion) return
    let x = 0
    let velocity = 0
    let lastY = window.scrollY
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const y = window.scrollY
      const scrollV = (y - lastY) / Math.max(dt, 0.001)
      lastY = y
      // Ease towards the scroll speed; direction follows the scroll.
      velocity += (scrollV * 0.12 - velocity) * Math.min(1, dt * 6)
      const speed = 40 + Math.abs(velocity)
      const dir = velocity < -1 ? -1 : 1
      x -= speed * dt * dir
      const half = el.scrollWidth / 2
      if (half > 0) x = ((x % half) - half) % half
      const skew = Math.max(-12, Math.min(12, velocity * 0.02))
      el.style.transform = `translate3d(${x}px,0,0) skewX(${-skew}deg)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      el.style.transform = ""
    }
  }, [motion])

  const row = (hidden: boolean) =>
    items.map((item, i) => (
      <li
        key={`${hidden}-${i}`}
        aria-hidden={hidden || undefined}
        className={cn(
          "flex shrink-0 items-center gap-6 pr-6 font-mono text-sm tracking-widest whitespace-nowrap text-muted-foreground uppercase md:text-base",
          hidden && "motion-off:hidden",
        )}
      >
        {item}
        <span aria-hidden className="size-1.5 rounded-full bg-signal" />
      </li>
    ))

  return (
    <div className={cn("overflow-hidden border-y py-5", className)}>
      <ul
        aria-label="What we deliver"
        ref={track}
        className="flex w-max will-change-transform motion-off:w-auto motion-off:flex-wrap motion-off:justify-center motion-off:gap-y-3 motion-off:px-4"
      >
        {row(false)}
        {row(true)}
      </ul>
    </div>
  )
}
