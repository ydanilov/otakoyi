import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { solutions, tourStops } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import { InNumbers } from "./in-numbers"
import { LabPlayground } from "./lab-playground"
import { LabTeaser } from "./lab-teaser"
import { Occasions } from "./occasions"
import { SpecMarquee } from "./spec-marquee"
import { Technologies } from "./technologies"
import { VenueTour } from "./venue-tour"

const meta = { title: "Sections/Home v2", parameters: { layout: "fullscreen" } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Marquee: Story = {
  render: () => (
    <SpecMarquee items={["Stage LED", "Interactive floors", "Lobby walls", "Live data"]} />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("list", { name: "What we deliver" })).toBeInTheDocument()
  },
}

export const Tour: Story = {
  render: () => <VenueTour stops={tourStops} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: /Exhibitions/ })).toHaveAttribute(
      "href",
      "/solutions/exhibitions",
    )
    const menu = canvas.getByRole("navigation", { name: "Tour stops" })
    await expect(menu.querySelectorAll("button")).toHaveLength(4)
    await expect(
      canvas.getByRole("button", { name: "Go to Exhibitions & trade shows" }),
    ).toHaveAttribute("aria-current", "step")
  },
}

export const SolutionsRow: Story = {
  render: () => (
    <div className="p-8">
      <Occasions items={solutions} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: /Conferences/ })).toHaveAttribute(
      "href",
      "/solutions/conferences",
    )
  },
}

export const Numbers: Story = {
  render: () => (
    <div className="p-8">
      <InNumbers
        stats={[
          { value: 24, suffix: "/7", label: "runtime" },
          { value: 1, suffix: " engine", label: "for every format" },
        ]}
      />
    </div>
  ),
}

export const Lab: Story = {
  render: () => (
    <div className="p-8">
      <LabTeaser />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const before = canvas.getByText(/seed \d+/).textContent
    await userEvent.click(canvas.getByRole("button", { name: "New seed" }))
    await expect(canvas.getByText(/seed \d+/).textContent).not.toBe(before)
  },
}

export const LabFull: Story = {
  render: () => (
    <div className="p-8">
      <LabPlayground />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Contour" }))
    await expect(canvas.getByText(/^contour#/)).toBeInTheDocument()
    await userEvent.click(canvas.getByRole("button", { name: "Next seed" }))
    await expect(canvas.getByText(/^contour#22@/)).toBeInTheDocument()
  },
}

export const TechnologyList: Story = {
  render: () => (
    <div className="p-8">
      <Technologies items={technologies} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole("region", { name: "What it shows on" })).toBeInTheDocument()
    await expect(canvas.getByRole("region", { name: "What drives it" })).toBeInTheDocument()
    const first = canvas.getByRole("button", { name: /Projection mapping/ })
    await expect(first).toHaveAttribute("aria-pressed", "true")
    const tracking = canvas.getByRole("button", { name: /Motion and body tracking/ })
    await userEvent.click(tracking)
    await expect(tracking).toHaveAttribute("aria-pressed", "true")
    await expect(first).toHaveAttribute("aria-pressed", "false")
  },
}
