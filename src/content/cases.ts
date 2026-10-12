import { z } from "zod"

import { workIds, type WorkId } from "@/components/works/registry"

/** Where installations live — drives the Works filter and the "Formats" section. */
export const formats = ["Conference", "Event", "Office", "Exhibition", "Brand activation"] as const

/**
 * Case study schema — the contract every case must satisfy.
 * Validated in unit tests (`pnpm test`) and at build time via `getCases()`.
 * Body copy lives in `src/content/cases/<slug>.mdx`.
 *
 * NOTE: all clients, numbers and results below are PLACEHOLDERS. Replace with real,
 * verifiable results before launch — this is a sales site, claims must be true.
 */
export const caseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  client: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  location: z.string().min(2),
  summary: z.string().min(20).max(200),
  formats: z.array(z.enum(formats)).min(1),
  hero: z.object({
    work: z.enum(workIds as [WorkId, ...WorkId[]]),
    seed: z.number().int(),
    density: z.number().min(0).max(1).optional(),
  }),
  /** What was customised for the client's brand. */
  customisation: z.array(z.string()).min(1),
  /** Business outcomes, shown as stat tiles. */
  results: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1)
    .max(4),
  /** Quick-facts strip on the case page. */
  facts: z.object({
    surface: z.string().min(2),
    timeline: z.string().min(2),
  }),
  /** "Backstage" — the setup that makes it reliable: hardware, inputs, runtime. */
  backstage: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(2)
    .max(6),
  featured: z.boolean().default(false),
})

export type Case = z.infer<typeof caseSchema>
export type CaseFormat = (typeof formats)[number]

const raw: z.input<typeof caseSchema>[] = [
  {
    slug: "tidal-index",
    title: "Tidal Index",
    client: "Placeholder Capital",
    year: 2026,
    location: "Fintech summit, main stage",
    summary:
      "A 24-metre stage backdrop driven by live market data, recoloured in the client's brand palette.",
    formats: ["Conference", "Event"],
    hero: { work: "signal-field", seed: 11, density: 0.4 },
    customisation: [
      "Brand palette and typography",
      "Live trading-volume feed",
      "Logo reveal on keynote cue",
    ],
    facts: { surface: "24 × 4 m LED backdrop", timeline: "5 weeks, brief to stage" },
    backstage: [
      { label: "Display", value: "Stage LED wall, 3.9 mm pitch" },
      { label: "Engine", value: "Real-time render node + hot spare" },
      { label: "Inputs", value: "Trading-volume API, show-caller cues" },
      { label: "On site", value: "1 operator, 3 days" },
    ],
    results: [
      { value: "2.4M", label: "social impressions in 3 days" },
      { value: "3×", label: "booth visits vs. previous year" },
      { value: "0", label: "content changes needed between sessions" },
    ],
    featured: true,
  },
  {
    slug: "halcyon-pavilion",
    title: "Halcyon Pavilion",
    client: "Placeholder Expo",
    year: 2025,
    location: "Trade show pavilion, 30 m projection",
    summary:
      "A projection floor that turns visitor movement into a slow-moving topography — the busiest stand on the floor.",
    formats: ["Exhibition", "Brand activation"],
    hero: { work: "contour", seed: 4, density: 0.5 },
    customisation: [
      "Contours shaped from the client's logo",
      "Motion tracking of visitors",
      "Branded photo moment",
    ],
    facts: { surface: "30 m floor projection", timeline: "6 weeks, brief to opening" },
    backstage: [
      { label: "Display", value: "4 laser projectors, edge-blended" },
      { label: "Tracking", value: "Overhead depth sensors" },
      { label: "Engine", value: "Real-time render node" },
      { label: "Runtime", value: "31 days, remote monitoring" },
    ],
    results: [
      { value: "48k", label: "visitors in 31 days" },
      { value: "11 min", label: "average dwell time" },
      { value: "1,900", label: "qualified leads scanned" },
    ],
    featured: true,
  },
  {
    slug: "grainline",
    title: "Grainline",
    client: "Placeholder Bank HQ",
    year: 2025,
    location: "Headquarters lobby, permanent LED wall",
    summary:
      "A permanent lobby wall that visualises the company's day — always on brand, never the same twice.",
    formats: ["Office"],
    hero: { work: "lattice", seed: 9, density: 0.25 },
    customisation: [
      "Corporate colours and grid",
      "Internal KPI feed",
      "Seasonal and campaign modes",
    ],
    facts: { surface: "Lobby LED wall, 6 × 3 m", timeline: "8 weeks, permanent" },
    backstage: [
      { label: "Display", value: "Existing lobby LED wall" },
      { label: "Inputs", value: "Internal KPI feed, time of day" },
      { label: "Runtime", value: "24/7, unattended" },
      { label: "Support", value: "Remote monitoring and updates" },
    ],
    results: [
      { value: "24/7", label: "running with zero content updates" },
      { value: "1", label: "engine reused for 6 campaigns" },
    ],
    featured: true,
  },
  {
    slug: "mono-bloom",
    title: "Mono Bloom",
    client: "Placeholder Telecom",
    year: 2024,
    location: "Product launch, 3 cities",
    summary:
      "A touring launch installation that reacts to sound — rebuilt for each city in an afternoon.",
    formats: ["Event", "Brand activation"],
    hero: { work: "signal-field", seed: 42, density: 0.2 },
    customisation: ["Launch campaign palette", "Audio-reactive visuals", "City-specific seeds"],
    facts: { surface: "Touring stage screens", timeline: "4 weeks + same-day re-setup" },
    backstage: [
      { label: "Display", value: "Venue screens, 3 different layouts" },
      { label: "Inputs", value: "Live audio from the set" },
      { label: "Engine", value: "Portable render node" },
      { label: "Re-setup", value: "One afternoon per city" },
    ],
    results: [
      { value: "3", label: "cities on one setup" },
      { value: "−40%", label: "content production cost vs. video" },
    ],
  },
]

export function getCases(): Case[] {
  return raw.map((c) => caseSchema.parse(c)).sort((a, b) => b.year - a.year)
}

export function getCase(slug: string): Case | undefined {
  return getCases().find((c) => c.slug === slug)
}
