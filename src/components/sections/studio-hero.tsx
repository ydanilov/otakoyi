"use client"

import { useEffect, useRef, useState } from "react"

import { useEased } from "@/lib/use-eased"
import { useMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"

type StudioHeroProps = {
  first: string
  second: string
  image: { src: string; alt: string }
}

/**
 * Editorial studio hero: two phrases overlap a portrait photo, with an outlined "&" between them.
 * On scroll the phrases drift apart, the photo eases back and the "&" turns. Motion off
 * (ADR-006): the same composition, still.
 */
export function StudioHero({ first, second, image }: StudioHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const motion = useMotion()
  const [raw, setRaw] = useState(0)
  const p = useEased(raw, motion)

  useEffect(() => {
    const el = ref.current
    if (!el || !motion) return
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      setRaw(Math.min(1, Math.max(0, -r.top / Math.max(1, r.height * 0.8))))
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
  }, [motion])

  const t = motion ? p : 0

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-10 md:px-8 md:py-8"
    >
      <h1 className="sr-only">
        {first}. {second}
      </h1>

      <div className="relative md:h-[calc(100svh-3.5rem-4rem)] md:min-h-[34rem]">
        {/* The photo sits in the middle; the type runs over its edges. */}
        <div className="relative mx-auto aspect-[4/5] w-[78%] md:absolute md:top-[7%] md:left-1/2 md:h-[80%] md:w-auto md:-translate-x-1/2">
          <div
            className="size-full overflow-hidden rounded-xl"
            style={{ transform: `translateY(${t * 60}px)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="size-full object-cover"
              style={{ transform: `scale(${1.12 - t * 0.12})` }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30"
            />
          </div>
        </div>

        {/* Outlined ampersand over the photo, between the two phrases. */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-[22%] left-1/2 z-10 font-medium text-transparent select-none [-webkit-text-stroke:2px_var(--signal)] md:top-[12%]"
          style={{
            fontSize: "clamp(12rem, min(30vw, 52svh), 26rem)",
            lineHeight: 1,
            transform: `translateX(-50%) rotate(${t * 18 - 6}deg) scale(${1 + t * 0.08})`,
          }}
        >
          &amp;
        </span>

        <p
          aria-hidden
          className={cn(
            "relative z-20 -mt-[36%] text-6xl leading-[0.85] font-medium tracking-tighter md:absolute md:top-0 md:left-0 md:mt-0 md:max-w-[48rem] md:text-[clamp(4rem,min(9vw,15svh),8.5rem)]",
            "drop-shadow-[0_2px_24px_var(--background)]",
          )}
          style={{ transform: `translateX(${-t * 90}px)` }}
        >
          {first}
        </p>

        <p
          aria-hidden
          className="relative z-20 mt-6 text-right text-6xl leading-[0.85] font-medium tracking-tighter text-signal drop-shadow-[0_2px_24px_var(--background)] md:absolute md:right-0 md:bottom-[12%] md:mt-0 md:max-w-[40rem] md:text-[clamp(4rem,min(9vw,15svh),8.5rem)]"
          style={{ transform: `translateX(${t * 90}px)` }}
        >
          {second}
        </p>
      </div>
    </section>
  )
}
