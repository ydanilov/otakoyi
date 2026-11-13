import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { solutions, tourStops } from "@/content/solutions"
import { technologies } from "@/content/technologies"
import { InNumbers } from "./in-numbers"
import { Occasions } from "./occasions"
import { SpecMarquee } from "./spec-marquee"
import { TechnologySelector } from "./technology-selector"
import { TechnologyBento } from "./technologies"
import { VenueStage, VenueStill } from "./venue-stage"
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

export const TechnologyInputsBento: Story = {
  render: () => (
    <div className="p-8">
      <TechnologyBento items={technologies.filter((t) => t.kind === "input")} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { name: "Motion and body tracking" })).toBeVisible()
    await expect(canvas.getAllByRole("listitem").length).toBeGreaterThanOrEqual(4)
  },
}

export const TechnologySurfacesSelector: Story = {
  render: () => (
    <div className="p-8">
      <TechnologySelector
        label="Surfaces"
        items={technologies.filter((t) => t.kind === "output")}
      />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole("tab", { name: /Projection mapping/ })
    await expect(first).toHaveAttribute("aria-selected", "true")
    await expect(canvas.queryByRole("tab", { name: /Motion and body tracking/ })).toBeNull()
    const led = canvas.getByRole("tab", { name: /^02\s*LED walls/ })
    await userEvent.click(led)
    await expect(led).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(/LED walls/)
  },
}

export const VenueStageLobby: Story = {
  render: () => (
    <div className="relative aspect-video w-full">
      <VenueStage active={1} className="absolute inset-0" />
    </div>
  ),
  play: async ({ canvas }) => {
    const stage = canvas.getByRole("img", { name: /an office lobby/ })
    await expect(stage).toHaveAttribute("data-venue", "1")
  },
}

export const VenueStillMuseum: Story = {
  render: () => (
    <VenueStill index={3} label="Immersive museum room" className="aspect-[4/3] w-96" />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Immersive museum room" })).toHaveAttribute(
      "src",
      "/venues/photo-3.webp",
    )
  },
}
