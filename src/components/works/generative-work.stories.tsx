import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { GenerativeWork } from "./generative-work"
import { workIds } from "./registry"

/**
 * The generative work contract: `work` + `seed` + `density`.
 * Use the controls to explore — this is the designer's playground.
 */
const meta = {
  title: "Works/GenerativeWork",
  component: GenerativeWork,
  parameters: { layout: "fullscreen" },
  args: { work: "signal-field", seed: 7, density: 0.35, animate: true },
  argTypes: {
    work: { control: "select", options: workIds },
    seed: { control: { type: "number", min: 0, max: 9999, step: 1 } },
    density: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
  render: (args) => <GenerativeWork {...args} className="h-[70vh] w-full" />,
} satisfies Meta<typeof GenerativeWork>
export default meta
type Story = StoryObj<typeof meta>

export const SignalField: Story = {}
export const Contour: Story = { args: { work: "contour", seed: 21, density: 0.4 } }
export const Lattice: Story = { args: { work: "lattice", seed: 3, density: 0.3 } }
export const Still: Story = { args: { animate: false } }

export const SeedSheet: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-2 p-2 md:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <GenerativeWork key={i} {...args} seed={i + 1} animate={false} className="aspect-square" />
      ))}
    </div>
  ),
}
