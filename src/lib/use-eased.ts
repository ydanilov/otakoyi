"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Follows a value with a little inertia (exponential smoothing per frame), so scroll-driven
 * animation glides instead of stepping with the wheel. Returns the target as-is when `enabled`
 * is false (e.g. site motion off).
 */
export function useEased(target: number, enabled = true, rate = 7) {
  const [value, setValue] = useState(target)
  const current = useRef(target)
  const goal = useRef(target)

  useEffect(() => {
    goal.current = target
    if (!enabled) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const next = current.current + (goal.current - current.current) * (1 - Math.exp(-rate * dt))
      current.current = Math.abs(goal.current - next) < 0.0005 ? goal.current : next
      setValue(current.current)
      if (current.current !== goal.current) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, enabled, rate])

  return enabled ? value : target
}
