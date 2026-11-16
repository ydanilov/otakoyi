import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge has to know the token scales from tokens.json (ADR-012). Without this it reads
 * `text-logo` as a text *colour* and drops `text-foreground`, and it can't tell that `glass-chip`
 * replaces a component's own background.
 */
const twMerge = extendTailwindMerge<"glass" | "page-container">({
  extend: {
    theme: {
      text: ["display-fluid", "display-outline", "display-outline-fluid", "logo", "logo-md"],
      leading: ["display", "display-tight"],
      tracking: ["eyebrow"],
    },
    classGroups: {
      duration: [{ duration: ["fast", "base", "slow", "slower", "slowest"] }],
      delay: [{ delay: ["fast"] }],
      glass: [{ glass: ["bar", "panel", "pill", "chip", "chip-strong"] }],
      "page-container": ["page-container"],
    },
    conflictingClassGroups: {
      glass: ["bg-color", "backdrop-blur", "backdrop-saturate"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
