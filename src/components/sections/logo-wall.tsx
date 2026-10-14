import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Generic placeholder marks for the client wall. Replace with real client logos (as SVG, single
 * colour, `currentColor`) before launch: these names are not clients.
 */
const marks: { name: string; mark: ReactNode }[] = [
  {
    name: "Lumen",
    mark: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <circle cx="16" cy="16" r="6" fill="currentColor" />
        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Halden",
    mark: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <path d="M4 26 16 6l12 20H4Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Meridian",
    mark: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect x="4" y="4" width="10" height="24" rx="2" fill="currentColor" />
        <rect x="18" y="12" width="10" height="16" rx="2" fill="currentColor" opacity=".6" />
      </svg>
    ),
  },
  {
    name: "Vertex",
    mark: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <path d="M16 3 29 16 16 29 3 16Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 10 22 16 16 22 10 16Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Orbita",
    mark: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <ellipse cx="16" cy="16" rx="13" ry="6" fill="none" stroke="currentColor" strokeWidth="2" />
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          transform="rotate(60 16 16)"
        />
        <circle cx="16" cy="16" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Strata",
    mark: (
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect x="4" y="6" width="24" height="4" rx="2" fill="currentColor" />
        <rect x="8" y="14" width="20" height="4" rx="2" fill="currentColor" opacity=".75" />
        <rect x="12" y="22" width="16" height="4" rx="2" fill="currentColor" opacity=".5" />
      </svg>
    ),
  },
]

/** A wall of single-colour client logos: grey at rest, full colour on hover. */
export function LogoWall({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3",
        className,
      )}
    >
      {marks.map((m) => (
        <li
          key={m.name}
          className="group flex h-32 items-center justify-center gap-3 bg-background text-muted-foreground/60 transition-colors duration-300 hover:bg-card hover:text-foreground md:h-40"
        >
          {m.mark}
          <span className="text-2xl font-semibold tracking-tight md:text-3xl">{m.name}</span>
        </li>
      ))}
    </ul>
  )
}
