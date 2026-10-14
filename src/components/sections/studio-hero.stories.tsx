import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { StudioHero } from "./studio-hero"

const meta = {
  title: "Sections/Studio hero",
  component: StudioHero,
  parameters: { layout: "fullscreen" },
  args: {
    first: "Artists with toolboxes",
    second: "Engineers with taste",
    description: "We design, build and install generative visual installations",
    image: { src: "/studio/studio.webp", alt: "A creative technologist at work in the studio" },
  },
} satisfies Meta<typeof StudioHero>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: /Artists with toolboxes/ }),
    ).toBeInTheDocument()
  },
}
