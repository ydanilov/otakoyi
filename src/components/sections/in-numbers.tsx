"use client"

import { useEffect, useRef, useState } from "react"

import { useMotion } from "@/lib/motion"

export type Stat = {
  /** Numeric part that counts up, e.g. 24 for "24/7". */
  value: number
  prefix?: string
  suffix?: string
  label: string
}

/**
 * Big numbers that count up the first time they scroll into view. Only use claims the studio
 * can stand behind (docs/brief.md: results must be real and verifiable).
 */
export function InNumbers({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDListElement>(null)
  const motion = useMotion()
  const [progress, setT] = useState(0)
  const t = motion ? progress : 1

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!motion) return
    let frame = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400)
          setT(1 - Math.pow(1 - p, 3))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [motion])

  return (
    <dl
      ref={ref}
      className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col-reverse bg-background p-6 md:p-8">
          <dt className="mt-3 text-muted-foreground">{s.label}</dt>
          <dd className="text-5xl font-medium tracking-tighter tabular-nums md:text-7xl">
            {/* Screen readers get the final value, not the animation. */}
            <span className="sr-only">
              {s.prefix}
              {s.value}
              {s.suffix}
            </span>
            <span aria-hidden>
              {s.prefix}
              {Math.round(s.value * t)}
              <span className="text-signal">{s.suffix}</span>
            </span>
          </dd>
        </div>
      ))}
    </dl>
  )
}
