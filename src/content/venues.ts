import { venuePalettes } from "@/content/brand-presets"
import type { WorkId } from "@/components/works/registry"

/**
 * The four venue stills rendered in Blender (docs/decisions/009). Every screen is cut out of a
 * front layer, so live generative works run on the screens behind people standing in front of
 * them. Generated from Blender (`renders/stills/screens.json`).
 *
 * corners: the screen in image space (0..1, y down) — TL, TR, BR, BL.
 * domain: where the screen sits in the venue's shared field (origin + u/v axes, in ~3 m units).
 * Walls are unfolded around the room, so one field flows across walls and floor.
 */
export type VenueScreen = {
  name: string
  work: WorkId
  corners: [number, number][]
  /** Width / height of the physical screen, so the work isn't stretched. */
  aspect: number
  domain: { o: [number, number]; u: [number, number]; v: [number, number] }
  /** 0..1 brightness, for surfaces that should stay quieter (floors). */
  dim: number
}

export type Venue = {
  image: string
  front: string
  seed: number
  colors: (typeof venuePalettes)[number]
  screens: VenueScreen[]
}

export const venues: Venue[] = [
  {
    image: "/venues/scene-0.webp",
    front: "/venues/scene-0-front.webp",
    seed: 7,
    colors: venuePalettes[0]!,
    screens: [
      {
        name: "Screen_StandWall",
        work: "signal-field",
        corners: [
          [0.14402, -0.1015],
          [0.56557, -0.05007],
          [0.56293, 0.36332],
          [0.16205, 0.42177],
        ],
        aspect: 1.7778,
        domain: { o: [-0.6066, 0.3655], u: [1.6053, 0.0], v: [0.0, 0.903] },
        dim: 1,
      },
      {
        name: "Screen_Totem",
        work: "signal-field",
        corners: [
          [0.71433, 0.29201],
          [0.74891, 0.28819],
          [0.74516, 0.43766],
          [0.71102, 0.44517],
        ],
        aspect: 0.5641,
        domain: { o: [0.7189, 0.3533], u: [0.1467, 0.0], v: [0.0, 0.26] },
        dim: 1,
      },
      {
        name: "Screen_Totem.001",
        work: "signal-field",
        corners: [
          [0.12908, 0.36653],
          [0.11014, 0.35448],
          [0.11845, 0.56513],
          [0.13743, 0.58837],
        ],
        aspect: 0.5641,
        domain: { o: [-2.197, 0.3509], u: [0.1456, 0.0], v: [0.0, 0.26] },
        dim: 1,
      },
      {
        name: "Screen_StandFloor",
        work: "contour",
        corners: [
          [0.30463, 1.03894],
          [0.96681, 0.70813],
          [0.5465, 0.50604],
          [0.06144, 0.62035],
        ],
        aspect: 1.0,
        domain: { o: [-0.9317, 0.0158], u: [1.8633, 0.0], v: [0.0, -1.8633] },
        dim: 0.55,
      },
    ],
  },
  {
    image: "/venues/scene-1.webp",
    front: "/venues/scene-1-front.webp",
    seed: 21,
    colors: venuePalettes[1]!,
    screens: [
      {
        name: "Screen_Lobby",
        work: "signal-field",
        corners: [
          [0.42277, 0.18033],
          [0.6237, 0.19072],
          [0.62714, 0.72895],
          [0.42056, 0.73192],
        ],
        aspect: 0.6667,
        domain: { o: [-0.1333, 0.1], u: [1.2, 0.0], v: [0.0, 1.8] },
        dim: 1,
      },
    ],
  },
  {
    image: "/venues/scene-2.webp",
    front: "/venues/scene-2-front.webp",
    seed: 42,
    colors: venuePalettes[2]!,
    screens: [
      {
        name: "Screen_Stage",
        work: "signal-field",
        corners: [
          [0.28036, 0.25587],
          [0.7517, 0.2585],
          [0.74945, 0.58445],
          [0.28235, 0.58677],
        ],
        aspect: 2.5455,
        domain: { o: [-2.3333, 0.5333], u: [4.6667, 0.0], v: [0.0, 1.8333] },
        dim: 1,
      },
      {
        name: "Screen_Side_-1",
        work: "contour",
        corners: [
          [0.12797, 0.18769],
          [0.18935, 0.18816],
          [0.193, 0.61782],
          [0.13236, 0.61818],
        ],
        aspect: 0.25,
        domain: { o: [-3.4667, 0.4667], u: [0.5333, 0.0], v: [0.0, 2.1333] },
        dim: 1,
      },
      {
        name: "Screen_Side_1",
        work: "contour",
        corners: [
          [0.84903, 0.19326],
          [0.90763, 0.19371],
          [0.90295, 0.6136],
          [0.84501, 0.61395],
        ],
        aspect: 0.25,
        domain: { o: [2.9333, 0.4667], u: [0.5333, 0.0], v: [0.0, 2.1333] },
        dim: 1,
      },
    ],
  },
  {
    image: "/venues/scene-3.webp",
    front: "/venues/scene-3-front.webp",
    seed: 64,
    colors: venuePalettes[3]!,
    screens: [
      {
        name: "Proj_back",
        work: "signal-field",
        corners: [
          [0.07268, 0.15941],
          [0.77187, 0.23407],
          [0.77746, 0.70331],
          [0.06178, 0.74009],
        ],
        aspect: 2.4,
        domain: { o: [-2.0, 0.0], u: [4.0, 0.0], v: [0.0, 1.6667] },
        dim: 1,
      },
      {
        name: "Proj_left",
        work: "signal-field",
        corners: [
          [0.07268, 0.15941],
          [-4.46187, -5.53629],
          [-7.58791, 5.22048],
          [0.06178, 0.74009],
        ],
        aspect: 1.8,
        domain: { o: [-2.0, 0.0], u: [-3.0, 0.0], v: [-0.0, 1.6667] },
        dim: 1,
      },
      {
        name: "Proj_right",
        work: "signal-field",
        corners: [
          [1.98055, -0.75502],
          [0.77187, 0.23407],
          [0.77746, 0.70331],
          [2.11443, 1.22129],
        ],
        aspect: 1.8,
        domain: { o: [5.0, 0.0], u: [-3.0, 0.0], v: [0.0, 1.6667] },
        dim: 1,
      },
      {
        name: "Proj_floor",
        work: "signal-field",
        corners: [
          [0.06179, 0.73949],
          [0.77745, 0.70284],
          [2.11429, 1.21913],
          [-7.58282, 5.20296],
        ],
        aspect: 1.3333,
        domain: { o: [-2.0, -3.0], u: [4.0, 0.0], v: [0.0, 3.0] },
        dim: 1,
      },
    ],
  },
]
