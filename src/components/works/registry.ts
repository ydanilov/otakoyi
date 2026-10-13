import { contour, lattice, signalField } from "./shaders"

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
} satisfies Record<string, WorkDefinition>

export type WorkId = keyof typeof works
export const workIds = Object.keys(works) as WorkId[]
