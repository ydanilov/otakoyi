"use client"

import { useSyncExternalStore } from "react"

/**
 * Site-level motion switch (ADR-006). Motion is ON for everyone by default — the OS
 * `prefers-reduced-motion` setting is not used — and visitors turn it off with the header
 * toggle. The choice lives on `<html data-motion="off">` (set before paint by `motionScript` in `@/lib/init-scripts`)
 * and in localStorage. Visual tests set it off to freeze every generative work.
 */
export const MOTION_KEY = "motion-test"

export function isMotionOn() {
  return typeof document === "undefined" || document.documentElement.dataset.motion !== "off"
}

export function setMotion(on: boolean) {
  const root = document.documentElement
  if (on) delete root.dataset.motion
  else root.dataset.motion = "off"
  try {
    localStorage.setItem(MOTION_KEY, on ? "on" : "off")
  } catch {}
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] })
  return () => mo.disconnect()
}

/** Reactive motion flag. Server render assumes motion on. */
export function useMotion() {
  return useSyncExternalStore(subscribe, isMotionOn, () => true)
}
