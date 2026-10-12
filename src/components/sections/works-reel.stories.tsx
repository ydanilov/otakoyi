import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { getCases } from "@/content/cases"
import { WorksReel } from "./works-reel"

const meta = {
  title: "Sections/Works reel",
  component: WorksReel,
  parameters: { layout: "fullscreen" },
  args: { items: getCases().filter((c) => c.featured) },
} satisfies Meta<typeof WorksReel>
export default meta
type Story = StoryObj<typeof meta>

/** Scroll the canvas: each installation wipes in fullscreen, prev / next in the corners. */
export const Default: Story = {
  play: async ({ canvas, args }) => {
    // Every installation is reachable — not only the one on screen. (With motion off, which the
    // test runner uses, these are the fallback cards; otherwise the screen-reader list.)
    const hrefs = canvas.getAllByRole("link").map((a) => a.getAttribute("href"))
    for (const item of args.items) {
      await expect(hrefs).toContain(`/works/${item.slug}`)
    }
  },
}

export const TwoItems: Story = { args: { items: getCases().slice(0, 2) } }
