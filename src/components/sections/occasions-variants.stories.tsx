import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { solutions } from "@/content/solutions"
import {
  OccasionsBento,
  OccasionsIndex,
  OccasionsSelector,
  OccasionsVenues,
} from "./occasions-variants"

const meta = {
  title: "Sections/Occasions variants",
  parameters: { layout: "fullscreen" },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const wrap = (node: React.ReactNode) => <div className="p-8">{node}</div>

export const Index: Story = {
  render: () => wrap(<OccasionsIndex items={solutions} />),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: /Conferences/ })).toHaveAttribute(
      "href",
      "/solutions/conferences",
    )
  },
}

export const Bento: Story = {
  render: () => wrap(<OccasionsBento items={solutions} />),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(solutions.length)
  },
}

export const Venues: Story = {
  render: () => wrap(<OccasionsVenues items={solutions} />),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(solutions.length)
  },
}

export const Selector: Story = {
  render: () => wrap(<OccasionsSelector items={solutions} />),
  play: async ({ canvas, userEvent }) => {
    const tab = canvas.getAllByRole("tab")[2]!
    await userEvent.click(tab)
    await expect(tab).toHaveAttribute("aria-selected", "true")
  },
}
