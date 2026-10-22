import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Included, includedItems } from "./included"

const meta = {
  title: "Sections/Included",
  component: Included,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Included>
export default meta
type Story = StoryObj<typeof meta>

/** "What's included" on /studio: six turnkey cards and the full-width control-app row (07). */
export const Default: Story = {
  play: async ({ canvas }) => {
    const items = canvas.getAllByRole("listitem")
    await expect(items).toHaveLength(includedItems.length + 1)
    await expect(items.at(-1)).toHaveTextContent("07")
    await expect(items.at(-1)).toHaveTextContent("Control app")
    await expect(items.at(-1)).toHaveTextContent(/controller for your generative installation/)
    await expect(items.at(-1)).toHaveTextContent(/full VJ console/)
    await expect(canvas.getByRole("link", { name: /See the control app/ })).toHaveAttribute(
      "href",
      "/control",
    )
  },
}

export const Mobile: Story = { globals: { viewport: { value: "mobile1" } } }
