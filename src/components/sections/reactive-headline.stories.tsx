import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { ReactiveHeadline } from "./reactive-headline"

const meta = {
  title: "Sections/Reactive headline",
  component: ReactiveHeadline,
  parameters: { layout: "padded" },
  args: {
    text: "Installations people stop for",
    className: "max-w-5xl text-5xl leading-[0.95] tracking-tighter md:text-8xl",
  },
} satisfies Meta<typeof ReactiveHeadline>
export default meta
type Story = StoryObj<typeof meta>

/** Move the pointer over the headline: letters thicken around it. */
export const Default: Story = {
  play: async ({ canvas }) => {
    // One accessible heading with the full sentence; per-letter spans are hidden from AT.
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Installations people stop for" }),
    ).toBeInTheDocument()
  },
}

export const Subtle: Story = { args: { peakWeight: 650, radius: 160 } }
