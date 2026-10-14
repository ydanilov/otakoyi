import type { WorkId } from "@/components/works/registry"

/**
 * What we build with: the output and input technologies one engine drives. Copy follows
 * docs/brief.md — what it does for the space first, no engineering jargon.
 */
export type Technology = {
  slug: string
  /** Surfaces we show on, or the inputs that drive them. */
  kind: "output" | "input"
  name: string
  /** One line: what it does in the space. */
  line: string
  /** Where it typically lives. */
  where: string[]
  preview: { work: WorkId; seed: number; density?: number }
  /** Behind-the-scenes photo of the hardware; replaces the live preview where set. */
  image?: string
}

export const technologies: Technology[] = [
  {
    kind: "output",
    slug: "projection-mapping",
    image: "/technologies/projection-mapping.webp",
    name: "Projection mapping",
    line: "Any surface becomes a screen — facades, stage sets, walls, even the product itself",
    where: ["Facades", "Stage sets", "Product reveals"],
    preview: { work: "contour", seed: 31 },
  },
  {
    kind: "output",
    slug: "led-walls",
    image: "/technologies/led-walls.webp",
    name: "LED walls",
    line: "Bright enough for daylight and main stages, built to any size and shape",
    where: ["Stages", "Lobbies", "Outdoor"],
    preview: { work: "signal-field", seed: 11 },
  },
  {
    kind: "output",
    slug: "led-strips",
    image: "/technologies/led-strips.webp",
    name: "LED strips and pixel mapping",
    line: "Lines of light on architecture, trusses and furniture, driven pixel by pixel",
    where: ["Architecture", "Trusses", "Stand edges"],
    preview: { work: "lattice", seed: 8, density: 0.7 },
  },
  {
    kind: "output",
    slug: "displays",
    image: "/technologies/displays.webp",
    name: "Displays and video walls",
    line: "LCD and OLED walls for lobbies, stands and kiosks — touch-enabled when people should play",
    where: ["Lobbies", "Kiosks", "Meeting floors"],
    preview: { work: "lattice", seed: 3 },
  },
  {
    kind: "output",
    slug: "interactive-floors",
    image: "/technologies/interactive-floors.webp",
    name: "Interactive floors",
    line: "Projection or LED floors that answer every step",
    where: ["Trade show stands", "Museums", "Parks"],
    preview: { work: "contour", seed: 4 },
  },
  {
    kind: "output",
    slug: "transparent",
    image: "/technologies/transparent.webp",
    name: "Transparent and holographic displays",
    line: "Transparent LED, holo fans and mesh: images that float in the room",
    where: ["Shop windows", "Stages", "Product displays"],
    preview: { work: "signal-field", seed: 64 },
  },
  {
    kind: "output",
    slug: "light-lasers",
    image: "/technologies/light-lasers.webp",
    name: "Lasers and kinetic light",
    line: "Moving heads, lasers and kinetic pieces cued by the same engine as the screens",
    where: ["Concerts", "Launches", "Festivals"],
    preview: { work: "lattice", seed: 9, density: 0.6 },
  },
  {
    kind: "input",
    slug: "body-tracking",
    name: "Motion and body tracking",
    line: "Cameras read how visitors move and turn it into the show — nothing to wear, nothing to learn",
    where: ["Booths", "Immersive rooms", "Activations"],
    preview: { work: "signal-field", seed: 27 },
  },
  {
    kind: "input",
    slug: "sound-show-control",
    name: "Sound and show control",
    line: "The music, the lighting desk and the show caller's cues drive every drop and reveal",
    where: ["Concerts", "Keynotes", "Launches"],
    preview: { work: "lattice", seed: 21, density: 0.55 },
  },
  {
    kind: "input",
    slug: "sensors-data",
    name: "Sensors and live data",
    line: "Touch, lidar, weather or your own business numbers, turned into a calm, on-brand picture",
    where: ["Lobbies", "Data walls", "Museums"],
    preview: { work: "contour", seed: 12 },
  },
  {
    kind: "input",
    slug: "phones",
    name: "Visitors' phones",
    line: "Scan, vote, add your name to the wall — and leave your contact for the sales team",
    where: ["Booths", "Conferences", "Activations"],
    preview: { work: "signal-field", seed: 41 },
  },
]
