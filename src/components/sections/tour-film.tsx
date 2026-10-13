"use client"

import { useEffect, useRef, useState } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * The venue tour as a pre-rendered film (Blender, EEVEE): stand → lobby → concert → museum,
 * each move diving into one room's screen and surfacing from the next. Scroll scrubs it, so the
 * frame is exactly what was rendered and the page ships no 3D engine.
 * Encoded with a keyframe every few frames so seeking stays smooth (see docs/decisions/008).
 */
export const TOUR = {
  src: "/tour/tour.mp4",
  srcSmall: "/tour/tour-960.mp4",
  /** VP9 fallbacks for browsers without H.264 (some Chromium builds). */
  webm: "/tour/tour.webm",
  webmSmall: "/tour/tour-960.webm",
  fps: 24,
  /** Film frames where each stop holds (stand, lobby, concert, museum). */
  stops: [12, 120, 200, 312],
  posters: ["/tour/stop-0.jpg", "/tour/stop-1.jpg", "/tour/stop-2.jpg", "/tour/stop-3.jpg"],
} as const

/** progress 0..1 across the stops → film time in seconds (stops spread evenly over progress). */
export function tourTime(progress: number) {
  const n = TOUR.stops.length - 1
  const p = Math.min(1, Math.max(0, progress)) * n
  const i = Math.min(Math.floor(p), n - 1)
  const f = TOUR.stops[i]! + (TOUR.stops[i + 1]! - TOUR.stops[i]!) * (p - i)
  return (f - 1) / TOUR.fps
}

/** The poster of the stop nearest to a progress value (0 stand … 1 museum). */
export function tourPoster(progress: number) {
  const i = Math.round(Math.min(1, Math.max(0, progress)) * (TOUR.posters.length - 1))
  return TOUR.posters[i]!
}

type TourFilmProps = {
  /** 0..1 along the tour. */
  progress: number
  label?: string
  className?: string
}

export function TourFilm({
  progress,
  label = "Film flying through an exhibition stand, an office lobby, a concert and an immersive museum room, each with generative content on its screens",
  className,
}: TourFilmProps) {
  const motion = useMotion()
  const video = useRef<HTMLVideoElement>(null)
  const target = useRef(tourTime(progress))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    target.current = tourTime(progress)
  }, [progress])

  // Ease the playhead towards the scroll position; seek only when it actually moves.
  useEffect(() => {
    if (!motion) return
    const v = video.current
    if (!v) return
    let raf = 0
    let current = target.current
    const tick = () => {
      current += (target.current - current) * 0.18
      if (Math.abs(target.current - current) < 0.002) current = target.current
      if (v.readyState >= 1 && Math.abs(v.currentTime - current) > 1 / (TOUR.fps * 2)) {
        v.currentTime = current
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [motion])

  return (
    <div
      role="img"
      aria-label={label}
      data-work="tour-film"
      data-state={!motion || ready ? "ready" : "loading"}
      className={cn("relative overflow-hidden bg-background", className)}
    >
      {/* The poster is the frame of the nearest stop: instant first paint and the motion-off view. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tourPoster(progress)}
        alt=""
        aria-hidden
        className="absolute inset-0 size-full object-cover"
        decoding="async"
      />
      {motion && (
        <video
          ref={video}
          aria-hidden
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          onLoadedData={() => setReady(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-500",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          <source src={TOUR.srcSmall} type="video/mp4" media="(max-width: 767px)" />
          <source src={TOUR.webmSmall} type="video/webm" media="(max-width: 767px)" />
          <source src={TOUR.src} type="video/mp4" />
          <source src={TOUR.webm} type="video/webm" />
        </video>
      )}
    </div>
  )
}

/** A single still of one stop, for places that show one venue (solution pages, motion off). */
export function TourStill({
  progress,
  label,
  className,
}: {
  progress: number
  label: string
  className?: string
}) {
  return (
    <div className={cn("relative overflow-hidden bg-background", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tourPoster(progress)}
        alt={label}
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
