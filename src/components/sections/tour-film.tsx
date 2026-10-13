"use client"

import { useEffect, useRef, useState } from "react"

import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * The venue tour as a pre-rendered film (Blender, EEVEE): stand → lobby → concert → museum,
 * each move diving into one room's screen and surfacing from the next. The page ships no 3D engine.
 *
 * The film is cut into timecoded parts. Inside a scene, scroll scrubs the film, so you can stop
 * anywhere. The transition between two scenes never stops halfway: once scroll crosses into the
 * next scene, the transition plays through on its own, forwards or backwards.
 * Encoded with a keyframe every few frames so seeking stays smooth (see docs/decisions/008).
 */
export const TOUR = {
  src: "/tour/tour.mp4",
  srcSmall: "/tour/tour-960.mp4",
  /** VP9 fallbacks for browsers without H.264 (some Chromium builds). */
  webm: "/tour/tour.webm",
  webmSmall: "/tour/tour-960.webm",
  fps: 24,
  /** Scroll-scrubbed part of each scene, in film frames [from, to]; the gaps are transitions. */
  scenes: [
    [1, 146],
    [226, 322],
    [402, 498],
    [578, 724],
  ],
  posters: ["/tour/stop-0.jpg", "/tour/stop-1.jpg", "/tour/stop-2.jpg", "/tour/stop-3.jpg"],
} as const

const SCENES = TOUR.scenes.length
const frameTime = (frame: number) => (frame - 1) / TOUR.fps

/** Which scene a scroll position belongs to: scroll is split into equal parts, one per scene. */
export function tourScene(progress: number) {
  return Math.min(SCENES - 1, Math.floor(Math.min(1, Math.max(0, progress)) * SCENES))
}

/** progress 0..1 → film time in seconds, inside the scene that progress belongs to. */
export function tourTime(progress: number) {
  const p = Math.min(1, Math.max(0, progress)) * SCENES
  const i = tourScene(progress)
  const [from, to] = TOUR.scenes[i]!
  return frameTime(from + (to - from) * Math.min(1, p - i))
}

/** Scroll position of the middle of a scene, for jumping to it. */
export function tourSceneProgress(scene: number) {
  return (scene + 0.5) / SCENES
}

/** The poster of the stop nearest to a progress value (0 stand … 1 museum). */
export function tourPoster(progress: number) {
  const i = Math.round(Math.min(1, Math.max(0, progress)) * (TOUR.posters.length - 1))
  return TOUR.posters[i]!
}

/** Longest a transition may take, in seconds — skipping several scenes speeds it up. */
const MAX_TRANSITION = 2.6

type TourFilmProps = {
  /** 0..1 along the tour. */
  progress: number
  /** Called when the film has arrived in another scene (after its transition). */
  onSceneChange?: (scene: number) => void
  label?: string
  className?: string
}

export function TourFilm({
  progress,
  onSceneChange,
  label = "Film flying through an exhibition stand, an office lobby, a concert and an immersive museum room, each with generative content on its screens",
  className,
}: TourFilmProps) {
  const motion = useMotion()
  const video = useRef<HTMLVideoElement>(null)
  const target = useRef({ scene: tourScene(progress), time: tourTime(progress) })
  const sceneCb = useRef(onSceneChange)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    target.current = { scene: tourScene(progress), time: tourTime(progress) }
  }, [progress])
  useEffect(() => {
    sceneCb.current = onSceneChange
  }, [onSceneChange])

  useEffect(() => {
    if (!motion) return
    const v = video.current
    if (!v) return
    let raf = 0
    let scene = target.current.scene
    let current = target.current.time
    // A running transition: film time from → to, started at `at` (ms), lasting `ms`.
    let move: { from: number; to: number; at: number; ms: number; scene: number } | null = null
    const seek = (t: number) => {
      if (v.readyState >= 1 && Math.abs(v.currentTime - t) > 1 / (TOUR.fps * 2)) v.currentTime = t
    }
    const tick = (now: number) => {
      const goal = target.current
      if (move) {
        const k = Math.min(1, (now - move.at) / move.ms)
        current = move.from + (move.to - move.from) * k
        if (k >= 1) {
          scene = move.scene
          move = null
          sceneCb.current?.(scene)
        }
      } else if (goal.scene !== scene) {
        // Leave the scene: play straight to the edge of the next one in the scroll direction.
        const next = scene + Math.sign(goal.scene - scene)
        const edge = frameTime(goal.scene > scene ? TOUR.scenes[next]![0] : TOUR.scenes[next]![1])
        const span = Math.abs(edge - current)
        const hops = Math.abs(goal.scene - scene)
        const seconds = Math.min(span, MAX_TRANSITION / hops)
        move = { from: current, to: edge, at: now, ms: seconds * 1000, scene: next }
      } else {
        current += (goal.time - current) * 0.18
        if (Math.abs(goal.time - current) < 0.002) current = goal.time
      }
      seek(current)
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
