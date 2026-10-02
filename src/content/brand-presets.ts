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
