"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { GenerativeWork } from "@/components/works/generative-work"
import type { WorkPointer } from "@/components/works/shader-canvas"
import { venues, type Venue } from "@/content/venues"
import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Source size of the Blender stills. */
const IMG_W = 1920
const IMG_H = 1080
/** Bounds for the box a work renders into before it is warped onto its screen. */
/** Live screens mount this far ahead of the viewport, so they are drawn before they are seen. */
const PRELOAD = "150% 0px"
const MIN_W = 160
const MAX_W = 960

/** Which venue a scroll position belongs to: scroll is split into equal parts, one per venue. */
export function venueIndex(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  return Math.min(venues.length - 1, Math.floor(p * venues.length))
}

/** Scroll position of the middle of a venue, for jumping to it. */
export function venueProgress(index: number) {
  return (index + 0.5) / venues.length
}

// ─── Perspective mapping ─────────────────────────────────────────────────────
// A CSS matrix3d that maps a w×h box onto four points (TL, TR, BR, BL), so a flat canvas sits
// exactly on the screen in the photo. Standard projective mapping via adjugate matrices.
type M3 = number[]
const adj = (m: M3): M3 => [
  m[4]! * m[8]! - m[5]! * m[7]!,
  m[2]! * m[7]! - m[1]! * m[8]!,
  m[1]! * m[5]! - m[2]! * m[4]!,
  m[5]! * m[6]! - m[3]! * m[8]!,
  m[0]! * m[8]! - m[2]! * m[6]!,
  m[2]! * m[3]! - m[0]! * m[5]!,
  m[3]! * m[7]! - m[4]! * m[6]!,
  m[1]! * m[6]! - m[0]! * m[7]!,
  m[0]! * m[4]! - m[1]! * m[3]!,
]
const mul = (a: M3, b: M3): M3 => {
  const c: M3 = []
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      let s = 0
      for (let k = 0; k < 3; k++) s += a[3 * i + k]! * b[3 * k + j]!
      c[3 * i + j] = s
    }
  return c
}
const mulv = (m: M3, v: number[]) => [
  m[0]! * v[0]! + m[1]! * v[1]! + m[2]! * v[2]!,
  m[3]! * v[0]! + m[4]! * v[1]! + m[5]! * v[2]!,
  m[6]! * v[0]! + m[7]! * v[1]! + m[8]! * v[2]!,
]
function basis(p: [number, number][]): M3 {
  const m = [p[0]![0], p[1]![0], p[2]![0], p[0]![1], p[1]![1], p[2]![1], 1, 1, 1]
  const v = mulv(adj(m), [p[3]![0], p[3]![1], 1])
  return mul(m, [v[0]!, 0, 0, 0, v[1]!, 0, 0, 0, v[2]!])
}
/** 3×3 projective map from a w×h box (origin top-left) onto points TL, TR, BR, BL. */
function quadHomography(w: number, h: number, to: [number, number][]): M3 {
  const from: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ]
  return mul(basis(to), adj(basis(from)))
}

/** matrix3d() for a w×h box (origin top-left) onto points TL, TR, BR, BL. */
export function quadMatrix(w: number, h: number, to: [number, number][]) {
  const t = quadHomography(w, h, to)
  const n = t.map((x) => x / t[8]!)
  return `matrix3d(${[n[0], n[3], 0, n[6], n[1], n[4], 0, n[7], 0, 0, 1, 0, n[2], n[5], 0, n[8]].join(",")})`
}

/** Image-space point (0..1) → container pixels, for an object-cover 16:9 image. */
function coverPoint(u: number, v: number, cw: number, ch: number): [number, number] {
  const s = Math.max(cw / IMG_W, ch / IMG_H)
  const iw = IMG_W * s
  const ih = IMG_H * s
  return [(cw - iw) / 2 + u * iw, (ch - ih) / 2 + v * ih]
}

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<[number, number] | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize([e!.contentRect.width, e!.contentRect.height]))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

type ScreenGeom = { w: number; h: number; matrix: string; inverse: M3; reflection?: string }

/** Size and placement of every screen of a venue in the current container. */
function screenGeometry(venue: Venue, size: [number, number]): ScreenGeom[] {
  return venue.screens.map((sc) => {
    const pts = sc.corners.map(([u, v]) => coverPoint(u, v, size[0], size[1]))
    // Render each work at about its on-screen size: small totems stay cheap, big walls sharp.
    const span = Math.hypot(pts[1]![0] - pts[0]![0], pts[1]![1] - pts[0]![1])
    const w = Math.round(Math.min(MAX_W, Math.max(MIN_W, span * 1.2)))
    const h = Math.round(Math.min(MAX_W * 1.5, w / sc.aspect))
    const t = quadHomography(w, h, pts)
    const mirror = sc.reflection?.map(([u, v]) => coverPoint(u, v, size[0], size[1]))
    return {
      w,
      h,
      matrix: quadMatrix(w, h, pts),
      inverse: adj(t),
      reflection: mirror && quadMatrix(w, h, mirror),
    }
  })
}

/** Container point → field coordinates of the first screen under it, or null. */
function pointToField(venue: Venue, geom: ScreenGeom[], x: number, y: number) {
  for (let i = 0; i < geom.length; i++) {
    const g = geom[i]!
    const [a, b, c] = mulv(g.inverse, [x, y, 1])
    if (!c) continue
    const bx = a! / c
    const by = b! / c
    if (bx < 0 || by < 0 || bx > g.w || by > g.h) continue
    const u = bx / g.w
    const v = 1 - by / g.h
    const d = venue.screens[i]!.domain
    return [d.o[0] + u * d.u[0] + v * d.v[0], d.o[1] + u * d.u[1] + v * d.v[1]] as const
  }
  return null
}

type VenueStageProps = {
  /** Index of the venue on show. */
  active: number
  label?: string
  className?: string
}

/**
 * Four venues — exhibition stand, office lobby, concert, museum room — as Blender stills with
 * live generative works on every screen. Layers per venue: the still, the live screens, then the
 * still again with the screens cut out, so people in front of a screen stay in front.
 * All screens of a venue sample one shared field (walls unfold around the room), and the cursor
 * bends that field wherever it points. Venues crossfade; only the venue on show runs WebGL.
 * Motion off (ADR-006): the stills alone, with their rendered screens.
 */
export function VenueStage({
  active,
  label = "An exhibition stand, an office lobby, a concert and an immersive museum room, with live generative works on their screens that react to the cursor",
  className,
}: VenueStageProps) {
  const motion = useMotion()
  const [ref, size] = useSize<HTMLDivElement>()
  const pointer = useRef<WorkPointer>({ x: 0, y: 0, on: false })
  // Geometry for every venue, so neighbours can be mounted ahead of time.
  const geoms = useMemo(() => (size ? venues.map((v) => screenGeometry(v, size)) : null), [size])
  const geom = geoms?.[active] ?? null

  useEffect(() => {
    if (!motion || !geom) return
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const hit = pointToField(venues[active]!, geom, e.clientX - r.left, e.clientY - r.top)
      if (hit) pointer.current = { x: hit[0], y: hit[1], on: true }
      else pointer.current = { ...pointer.current, on: false }
    }
    const leave = () => (pointer.current = { ...pointer.current, on: false })
    window.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", leave)
    }
  }, [motion, geom, active, ref])

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      data-venue={active}
      className={cn("relative overflow-hidden bg-background", className)}
    >
      {venues.map((v, i) => (
        <div
          key={v.image}
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={v.photo ?? v.image}
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          {/* The venue on show and its neighbours keep live layers mounted (only the one on show
              animates), so a scene never arrives with a still where its live screens should be. */}
          {motion && geoms && !v.photo && Math.abs(i - active) <= 1 && (
            <>
              {v.base && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.base}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                  decoding="async"
                />
              )}
              {/* Live floor reflections: the same field, mirrored, blurred and fading away. */}
              {v.screens.map((sc, k) =>
                geoms[i]![k]!.reflection ? (
                  <div
                    key={`${sc.name}-reflection`}
                    className="absolute top-0 left-0 origin-top-left mix-blend-screen"
                    style={{
                      width: geoms[i]![k]!.w,
                      height: geoms[i]![k]!.h,
                      transform: geoms[i]![k]!.reflection,
                      filter: "blur(14px) brightness(1.5) saturate(1.15)",
                      opacity: 0.7,
                      // Fades with distance from the screen, and softly at the sides.
                      maskImage:
                        "linear-gradient(to bottom, transparent 35%, black 100%), linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
                      maskComposite: "intersect",
                    }}
                  >
                    <GenerativeWork
                      work={sc.work}
                      seed={v.seed}
                      brandColors={v.colors}
                      domain={sc.domain}
                      pointer={i === active ? pointer : undefined}
                      animate={i === active}
                      preloadMargin={PRELOAD}
                      poster={false}
                      className="size-full bg-transparent"
                    />
                  </div>
                ) : null,
              )}
              {v.screens.map((sc, k) => (
                <div
                  key={sc.name}
                  className="absolute top-0 left-0 origin-top-left saturate-125"
                  style={{
                    width: geoms[i]![k]!.w,
                    height: geoms[i]![k]!.h,
                    transform: geoms[i]![k]!.matrix,
                    filter: `brightness(${1.5 * sc.dim})`,
                  }}
                >
                  <GenerativeWork
                    work={sc.work}
                    seed={v.seed}
                    brandColors={v.colors}
                    domain={sc.domain}
                    pointer={i === active ? pointer : undefined}
                    animate={i === active}
                    preloadMargin={PRELOAD}
                    poster={false}
                    className="size-full bg-transparent"
                  />
                </div>
              ))}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.front}
                alt=""
                className="absolute inset-0 size-full object-cover"
                decoding="async"
              />
            </>
          )}
        </div>
      ))}
    </div>
  )
}

/** One venue as a plain still (rendered screen), for solution pages and other single views. */
export function VenueStill({
  index,
  label,
  className,
}: {
  index: number
  label: string
  className?: string
}) {
  const v = venues[Math.min(venues.length - 1, Math.max(0, index))]!
  return (
    <div className={cn("relative overflow-hidden bg-background", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={v.photo ?? v.image}
        alt={label}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
