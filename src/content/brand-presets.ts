import type { BrandColors } from "@/components/works/shader-canvas"

/**
 * Example client palettes for the "your brand, generated" demo.
 * These are client brand colors (content), not design tokens — the one place
 * raw color values are allowed in src/ (see eslint.config.mjs).
 */
export const brandPresets: { name: string; colors: BrandColors }[] = [
  { name: "Fintech", colors: ["#c1f354", "#2b59ff", "#00d4b4", "#f5f5f5"] },
  { name: "Telecom", colors: ["#ff2d55", "#5a1fd1", "#ff9f0a", "#ffffff"] },
  { name: "Energy", colors: ["#ffd60a", "#0a7d4f", "#00b4d8", "#f8f9fa"] },
  { name: "Luxury", colors: ["#e9d8a6", "#1b1b1f", "#9b2226", "#f1ede4"] },
]

/**
 * Screen palettes of the four venue renders (highlight, base, secondary, ink). They match the
 * light of each Blender scene so the live screen sits in the photo — content, not tokens.
 */
export const venuePalettes: BrandColors[] = [
  ["#c8fff6", "#0f8f86", "#2fd1c2", "#020b0a"], // exhibition stand — teal
  ["#ffe2b8", "#b8560f", "#f08a2a", "#0a0502"], // office lobby — amber
  ["#ffd0f2", "#9c1f7a", "#e04bb5", "#0a0208"], // concert — magenta
  ["#e2dcff", "#3b2fb8", "#7a5cff", "#04030c"], // museum room — blue-violet
]
