"use client"

import { PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { setMotion, useMotion } from "@/lib/motion"

/** Pauses every animation, scroll scene and live work on the site (WCAG 2.2.2). */
export function MotionToggle() {
  const on = useMotion()
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMotion(!on)}
      aria-pressed={!on}
      aria-label={on ? "Pause motion" : "Play motion"}
      title={on ? "Pause motion" : "Play motion"}
    >
      {on ? <PauseIcon /> : <PlayIcon />}
    </Button>
  )
}
