import { z } from "zod"

import { workIds, type WorkId } from "@/components/works/registry"
import { formats, getCases, type Case } from "./cases"

/**
 * Solutions = the four buyer situations (how event, brand and workplace teams search),
 * each with its own landing page at /solutions/<slug>. Copy follows docs/brief.md:
 * business benefit first, concrete over clever, every section ends with a path to the CTA.
 */
export const solutionSchema = z.object({
  slug: z.enum(["conferences", "launches", "offices", "exhibitions"]),
  label: z.string(),
  title: z.string(),
  promise: z.string().max(140),
  description: z.string(),
  /** Case formats that count as this solution (drives "matching installations"). */
  matches: z.array(z.enum(formats)).min(1),
  hero: z.object({ work: z.enum(workIds as [WorkId, ...WorkId[]]), seed: z.number().int() }),
  /** Where the 3D venue camera sits for this solution (0 stage → 0.5 lobby → 1 stand). */
  venue: z.number().min(0).max(1),
  surfaces: z.array(z.string()).min(2),
  outcomes: z.array(z.object({ title: z.string(), body: z.string() })).length(3),
  facts: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .min(3)
    .max(4),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).min(2),
})

export type Solution = z.infer<typeof solutionSchema>

const raw: Solution[] = [
  {
    slug: "conferences",
    label: "Conferences",
    title: "A stage people film, not a slide people skip.",
    promise:
      "Stage backdrops, sponsor booths and registration zones that make your brand the one on every phone.",
    description:
      "Keynote stages, sponsor zones and registration areas compete for the same attention. A live generative backdrop changes every minute, reacts to the room and the agenda, and stays unmistakably on brand from the first session to the last.",
    matches: ["Conference"],
    hero: { work: "signal-field", seed: 11 },
    venue: 0,
    surfaces: ["Stage LED backdrop", "Sponsor booth screens", "Registration and wayfinding walls"],
    outcomes: [
      {
        title: "Own the stage",
        body: "Your palette and type on the biggest screen in the room, all day.",
      },
      {
        title: "Cue-driven moments",
        body: "Logo reveals, speaker intros and session breaks triggered live by the show caller.",
      },
      {
        title: "Content without production",
        body: "One engine covers every session — no new videos to render between talks.",
      },
    ],
    facts: [
      { label: "Live prototype", value: "≈ 1 week" },
      { label: "Typical surface", value: "8–30 m LED" },
      { label: "On site", value: "Operator + fallback" },
    ],
    faq: [
      {
        q: "Can it follow the agenda?",
        a: "Yes. We connect to the run-of-show so scenes change with sessions, breaks and keynote cues.",
      },
      {
        q: "Does it work with the venue's AV team?",
        a: "We deliver a standard video signal and work alongside the venue's AV, or bring our own media server.",
      },
    ],
  },
  {
    slug: "launches",
    label: "Events & launches",
    title: "One launch moment, then the same engine on tour.",
    promise: "Audio-reactive, touring installations that rebuild in an afternoon for every venue.",
    description:
      "A product launch has one shot at the room. We build the moment around the product and the music — and because the system is generative, it adapts to the next city's screens and stage without re-rendering a frame.",
    matches: ["Event", "Brand activation"],
    hero: { work: "contour", seed: 9 },
    venue: 0.15,
    surfaces: ["Stage and reveal screens", "Projection on product and set", "Audio-reactive LED"],
    outcomes: [
      {
        title: "A reveal people share",
        body: "The product appears out of the field on cue — built to be filmed in your colours.",
      },
      {
        title: "Tour-ready",
        body: "Any screen size, any venue: the engine re-lays itself out instead of being re-rendered.",
      },
      {
        title: "Music in the loop",
        body: "Live audio drives motion, so the visuals and the set breathe together.",
      },
    ],
    facts: [
      { label: "Live prototype", value: "≈ 1 week" },
      { label: "Re-setup per venue", value: "Same day" },
      { label: "Inputs", value: "Audio, cues, data" },
    ],
    faq: [
      {
        q: "Can we reuse it for social?",
        a: "Yes. The engine renders loops and stills in any aspect ratio for social and press.",
      },
      {
        q: "What if the venue changes?",
        a: "Screen sizes and layouts are parameters, not re-renders. We adapt in hours.",
      },
    ],
  },
  {
    slug: "offices",
    label: "Offices & lobbies",
    title: "A lobby wall that stays alive for years.",
    promise: "Permanent LED walls driven by your data — on brand 24/7, with no content treadmill.",
    description:
      "Lobby screens usually end up showing last year's video. A generative brand wall never repeats: it follows the time of day, the weather or your own business data, and it is monitored remotely so it simply keeps running.",
    matches: ["Office"],
    hero: { work: "lattice", seed: 3 },
    venue: 0.5,
    surfaces: ["Lobby LED walls", "Meeting floor and atrium screens", "Data walls in client areas"],
    outcomes: [
      {
        title: "Always fresh",
        body: "No playlist to maintain — the wall composes itself, all day, every day.",
      },
      {
        title: "Your data, visible",
        body: "Sales, energy, sensors or social — turned into a calm, on-brand visual story.",
      },
      {
        title: "Hands-off",
        body: "Remote monitoring and support, so facilities never need to touch it.",
      },
    ],
    facts: [
      { label: "Runtime", value: "24/7" },
      { label: "Content updates", value: "None needed" },
      { label: "Support", value: "Remote monitoring" },
    ],
    faq: [
      {
        q: "Do we need new hardware?",
        a: "Often not. We run on your existing LED wall or recommend hardware if it is missing.",
      },
      {
        q: "Who maintains it?",
        a: "We do. The system is monitored remotely and updated without anyone on site.",
      },
    ],
  },
  {
    slug: "exhibitions",
    label: "Exhibitions & trade shows",
    title: "The stand everyone walks towards.",
    promise: "Interactive floors and walls that pull visitors to your stand and keep them there.",
    description:
      "On a trade show floor every stand fights for the same aisle. Interactive generative surfaces respond to the people walking past, turn passers-by into visitors and give your team a reason to start the conversation.",
    matches: ["Exhibition"],
    hero: { work: "contour", seed: 4 },
    venue: 1,
    surfaces: [
      "Interactive floor projection",
      "Stand back walls and towers",
      "Touch and motion kiosks",
    ],
    outcomes: [
      {
        title: "Footfall",
        body: "Motion that reacts to visitors pulls people off the aisle and onto your stand.",
      },
      {
        title: "Dwell time",
        body: "People stay to play with it — and your sales team gets the conversation.",
      },
      {
        title: "Leads",
        body: "Optional photo moments and QR hand-offs turn attention into contacts.",
      },
    ],
    facts: [
      { label: "Live prototype", value: "≈ 1 week" },
      { label: "Build on site", value: "1 day" },
      { label: "Interaction", value: "Motion, touch, QR" },
    ],
    faq: [
      {
        q: "How much floor space do we need?",
        a: "Interactive floors work from about 3 × 3 m; walls from a single screen up to the whole stand.",
      },
      {
        q: "Do you handle the stand builder?",
        a: "We coordinate with your stand builder on power, mounting and sightlines.",
      },
    ],
  },
]

export const solutions = raw.map((s) => solutionSchema.parse(s))

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug)
}

export function casesFor(solution: Solution): Case[] {
  return getCases().filter((c) => c.formats.some((f) => solution.matches.includes(f)))
}
