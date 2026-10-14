import { venuePalettes } from "@/content/brand-presets"
import type { WorkId } from "@/components/works/registry"

/**
 * The four venue stills rendered in Blender (docs/decisions/009). Each has the main screen cut
 * out of a front layer, so a live generative work can run on the screen behind people standing
 * in front of it. Corners are the screen in image space (0..1, y down): TL, TR, BR, BL.
 */
export type Venue = {
  image: string
  front: string
  corners: [number, number][]
  /** Width / height of the physical screen, so the work isn't stretched. */
  aspect: number
  work: WorkId
  seed: number
  colors: (typeof venuePalettes)[number]
}

export const venues: Venue[] = [
  {
    image: "/venues/scene-0.webp",
    front: "/venues/scene-0-front.webp",
    corners: [
      [0.14402, -0.1015],
      [0.56557, -0.05007],
      [0.56293, 0.36332],
      [0.16205, 0.42177],
    ],
    aspect: 1.7778,
    work: "signal-field",
    seed: 7,
    colors: venuePalettes[0]!,
  },
  {
    image: "/venues/scene-1.webp",
    front: "/venues/scene-1-front.webp",
    corners: [
      [0.42277, 0.18033],
      [0.6237, 0.19072],
      [0.62714, 0.72895],
      [0.42056, 0.73192],
    ],
    aspect: 0.6667,
    work: "signal-field",
    seed: 21,
    colors: venuePalettes[1]!,
  },
  {
    image: "/venues/scene-2.webp",
    front: "/venues/scene-2-front.webp",
    corners: [
      [0.28036, 0.25587],
      [0.7517, 0.2585],
      [0.74945, 0.58445],
      [0.28235, 0.58677],
    ],
    aspect: 2.5455,
    work: "signal-field",
    seed: 42,
    colors: venuePalettes[2]!,
  },
  {
    image: "/venues/scene-3.webp",
    front: "/venues/scene-3-front.webp",
    corners: [
      [0.07268, 0.15941],
      [0.77187, 0.23407],
      [0.77746, 0.70331],
      [0.06178, 0.74009],
    ],
    aspect: 2.4,
    work: "signal-field",
    seed: 64,
    colors: venuePalettes[3]!,
  },
]
