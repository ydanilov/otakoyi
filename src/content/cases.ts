import { z } from "zod"

import { workIds, type WorkId } from "@/components/works/registry"

/** Where installations live — drives the Works filter and the "Formats" section. */
export const formats = ["Conference", "Event", "Office", "Exhibition", "Brand activation"] as const

/**
 * Case study schema — the contract every case must satisfy.
 * Validated in unit tests (`pnpm test`) and at build time via `getCases()`.
 * Body copy lives in `src/content/cases/<slug>.mdx`.
 *
 * NOTE: "pump-the-market" and "the-whale" are real studio projects (numbers from their repos).
 * All other clients, numbers and results are PLACEHOLDERS. Replace with real,
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
  /** Real imagery (in /public/works/<slug>/). When present it replaces the generative stand-in. */
  cover: z.object({ src: z.string().startsWith("/works/"), alt: z.string().min(10) }).optional(),
  gallery: z
    .array(
      z.object({
        src: z.string().startsWith("/works/"),
        alt: z.string().min(10),
        caption: z.string(),
      }),
    )
    .optional(),
  /** Honest project stage — shown as a badge. */
  status: z.enum(["Delivered", "Live-tested", "In development"]).default("Delivered"),
  featured: z.boolean().default(false),
})

export type Case = z.infer<typeof caseSchema>
export type CaseFormat = (typeof formats)[number]

const raw: z.input<typeof caseSchema>[] = [
  {
    slug: "pump-the-market",
    title: "Pump The Market",
    client: "Otakoyi original",
    year: 2026,
    location: "Crypto conference booths",
    summary:
      "A market heatmap that bleeds red until a visitor steps in — their silhouette turns the tiles under them green",
    formats: ["Exhibition", "Conference"],
    hero: { work: "lattice", seed: 12, density: 0.35 },
    customisation: [
      "Ticker list and market palette",
      "Up to 5 players, first come first served",
      "52 live parameters, 11 transition styles",
    ],
    facts: { surface: "Big screen or projection, 16:9", timeline: "R&D · live-tested Sept 2026" },
    backstage: [
      { label: "Engine", value: "TouchDesigner 2025, Python engine inside the network" },
      { label: "Tracking", value: "MediaPipe pose + segmentation, one webcam or iPhone" },
      { label: "Protocol", value: "OSC occupancy grid 32 × 18, two-way control" },
      { label: "Performance", value: "60 fps with ~950 tiles on an Apple Silicon Mac" },
    ],
    results: [
      { value: "60 fps", label: "with ~950 live tiles on screen" },
      { value: "5", label: "players at once, queued by arrival" },
      { value: "52", label: "show parameters tunable live" },
    ],
    cover: {
      src: "/works/pump-the-market/hero.webp",
      alt: "Red market heatmap with a visitor's silhouette rendered as a cluster of green tiles",
    },
    gallery: [
      {
        src: "/works/pump-the-market/idle.webp",
        alt: "Idle state: every tile of the heatmap in shades of red",
        caption: "Idle — the market bleeds",
      },
      {
        src: "/works/pump-the-market/entering.webp",
        alt: "A visitor entering the zone, green growing from their centre",
        caption: "A visitor steps in: green grows out from their centre",
      },
      {
        src: "/works/pump-the-market/two-people.webp",
        alt: "Two visitors as two green silhouettes on the red heatmap",
        caption: "Two players, each with their own mask",
      },
      {
        src: "/works/pump-the-market/clusters.webp",
        alt: "Fine green clusters following the outline of a body",
        caption: "Tiles split at the silhouette edge to keep the outline sharp",
      },
      {
        src: "/works/pump-the-market/dev-mode.webp",
        alt: "Developer mode overlaying the live silhouette on the heatmap",
        caption: "Dev mode: the live silhouette over the map",
      },
    ],
    status: "Live-tested",
    featured: true,
  },
  {
    slug: "the-whale",
    title: "The Whale",
    client: "Otakoyi original",
    year: 2026,
    location: "Blockchain and crypto conferences · floor zone + square projection",
    summary:
      "One visitor's arm steers a living crypto chart — raise it to pump, lower it to dump. The market always pushes back",
    formats: ["Conference", "Exhibition"],
    hero: { work: "signal-field", seed: 31, density: 0.3 },
    customisation: [
      "Market scenarios, price scale and events",
      "Gesture: arm up pumps, arm down dumps",
      "Moon and crash moments with full-screen overlays",
    ],
    facts: { surface: "Square projection, 1280 × 1280", timeline: "In development · 2026" },
    backstage: [
      { label: "Engine", value: "TouchDesigner, GPU-instanced candles" },
      { label: "Tracking", value: "MediaPipe Pose, up to 4 people, stable IDs" },
      { label: "Gesture", value: "Arm elevation against the torso, mapped 20–160" },
      { label: "Rehearsal", value: "Seeded market engine — every run reproducible" },
    ],
    results: [
      { value: "9", label: "market scenarios rotating every 30–90 s" },
      { value: "1", label: "ordinary camera — no depth sensor" },
      { value: "4", label: "candles a second, always alive" },
    ],
    cover: {
      src: "/works/the-whale/whale_pump.webp",
      alt: "Candlestick chart climbing steeply while a visitor holds their arm up in whale mode",
    },
    gallery: [
      {
        src: "/works/the-whale/market_live.webp",
        alt: "Live market chart with no visitor in the zone",
        caption: "No whale: scenarios and sentiment run on their own",
      },
      {
        src: "/works/the-whale/whale_dump.webp",
        alt: "Chart sliding down while the visitor lowers their arm",
        caption: "Arm down: the slide is steep, never perfectly clean",
      },
      {
        src: "/works/the-whale/to_the_moon.webp",
        alt: "Full-screen To the moon event when price hits the ceiling",
        caption: "Moon event: the news explains the correction",
      },
      {
        src: "/works/the-whale/market_crash.webp",
        alt: "Full-screen crash event when price hits the floor",
        caption: "Crash: price hits the floor, the bounce begins",
      },
      {
        src: "/works/the-whale/sandbox_ui.webp",
        alt: "Tuning sandbox with parameter panels next to the chart",
        caption: "Tuning sandbox mirroring the TouchDesigner parameters",
      },
    ],
    status: "In development",
    featured: true,
  },
  {
    slug: "tidal-index",
    title: "Tidal Index",
    client: "Placeholder Capital",
    year: 2026,
    location: "Fintech summit, main stage",
    summary:
      "A 24-metre stage backdrop driven by live market data, recoloured in the client's brand palette",
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
      "A projection floor that turns visitor movement into a slow-moving topography — the busiest stand on the floor",
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
      "A permanent lobby wall that visualises the company's day — always on brand, never the same twice",
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
      "A touring launch installation that reacts to sound — rebuilt for each city in an afternoon",
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
