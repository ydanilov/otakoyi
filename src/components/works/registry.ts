import { bloom, contour, lattice, ribbedGlass, signalField } from "./shaders"

export type WorkDefinition = {
  title: string
  description: string
  fragmentShader: string
  defaults: { seed: number; density: number }
}

/** Every generative work available to pages, MDX and Storybook. */
export const works = {
  "signal-field": {
    title: "Signal Field",
    description: "Domain-warped noise drifting like a tide of data",
    fragmentShader: signalField,
    defaults: { seed: 7, density: 0.35 },
  },
  contour: {
    title: "Contour",
    description: "A living topographic print — iso-lines over a moving height map",
    fragmentShader: contour,
    defaults: { seed: 21, density: 0.4 },
  },
  lattice: {
    title: "Lattice",
    description: "A grid of cells breathing with noise; rare cells flare in accent",
    fragmentShader: lattice,
    defaults: { seed: 3, density: 0.3 },
  },
  bloom: {
    title: "Bloom",
    description:
      "A silk flower unfolds from the dark, then comes undone into smoke and the next one grows",
    fragmentShader: bloom,
    defaults: { seed: 11, density: 0.4 },
  },
  "ribbed-glass": {
    title: "Ribbed Glass",
    description:
      "A ring of light behind fluted glass — every rib bends its own slice and splits it into colour",
    fragmentShader: ribbedGlass,
    defaults: { seed: 5, density: 0.4 },
  },
} satisfies Record<string, WorkDefinition>

export type WorkId = keyof typeof works
export const workIds = Object.keys(works) as WorkId[]
