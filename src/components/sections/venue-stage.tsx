"use client"

import { useEffect, useRef, useState } from "react"

import { GenerativeWork } from "@/components/works/generative-work"
import { venues, type Venue } from "@/content/venues"
import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Source size of the Blender stills. */
const IMG_W = 1920
const IMG_H = 1080
/** Width of the box the generative work renders into before it is warped onto the screen. */
const WORK_W = 960

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
/** matrix3d() for a w×h box (origin top-left) onto points TL, TR, BR, BL. */
export function quadMatrix(w: number, h: number, to: [number, number][]) {
  const from: [number, number][] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ]
  const t = mul(basis(to), adj(basis(from)))
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

/** The live generative work, warped onto the venue's screen. */
function LiveScreen({
  venue,
  size,
  live,
}: {
  venue: Venue
  size: [number, number]
  live: boolean
}) {
  const w = WORK_W
  const h = Math.round(WORK_W / venue.aspect)
  const pts = venue.corners.map(([u, v]) => coverPoint(u, v, size[0], size[1]))
  return (
    <div
      aria-hidden
      className="absolute top-0 left-0 origin-top-left brightness-150 saturate-125"
      style={{ width: w, height: h, transform: quadMatrix(w, h, pts) }}
    >
      <GenerativeWork
        work={venue.work}
        seed={venue.seed}
        brandColors={venue.colors}
        animate={live}
        className="size-full bg-background"
      />
    </div>
  )
}

type VenueStageProps = {
  /** Index of the venue on show. */
  active: number
  label?: string
  className?: string
}

/**
 * Four venues — exhibition stand, office lobby, concert, museum room — as Blender stills with a
 * live generative work on each main screen. Layers per venue: the still, the live screen, then
 * the still again with the screen cut out, so people in front of the screen stay in front.
 * Venues crossfade. Motion off (ADR-006): the stills alone, with their rendered screens.
 */
export function VenueStage({
  active,
  label = "An exhibition stand, an office lobby, a concert and an immersive museum room, each with a live generative work on its main screen",
  className,
}: VenueStageProps) {
  const motion = useMotion()
  const [ref, size] = useSize<HTMLDivElement>()

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
            src={v.image}
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          {motion && size && (
            <>
              <LiveScreen venue={v} size={size} live={i === active} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.front}
                alt=""
                className="absolute inset-0 size-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
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
        src={v.image}
        alt={label}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
