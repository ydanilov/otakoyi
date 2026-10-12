"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"

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

/** `null` on the server / before hydration, then whether WebGL is available. */
export function useWebGL(): boolean | null {
  return useSyncExternalStore(
    () => () => {},
    detectWebGL,
    () => null,
  )
}

/** `inView` follows visibility; `seen` latches true the first time the element is visible. */
export function useVisibility<T extends Element>(rootMargin = "200px") {
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
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, state] as const
}

/** Small deterministic PRNG (mulberry32) — never use Math.random() in render paths. */
export function seeded(seed: number) {
  let a = seed >>> 0 || 1
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => mo.disconnect()
}

/** Current site theme as a generative palette mode (dark-first on the server). */
export function useThemeMode(): "dark" | "light" {
  return useSyncExternalStore(
    subscribeTheme,
    () => (document.documentElement.classList.contains("dark") ? "dark" : "light"),
    () => "dark",
  )
}
