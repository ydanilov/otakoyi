import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { PinnedProcess } from "./pinned-process"

const meta = {
  title: "Sections/Pinned process",
  component: PinnedProcess,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PinnedProcess>
export default meta
type Story = StoryObj<typeof meta>

/** Scroll the canvas: one step per screen, progress counter, CTA on the last step. */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    // The full story stays readable by assistive tech as an ordered list.
    await expect(canvas.getAllByRole("listitem")).toHaveLength(5)
    // At the top the CTA is inert — it unlocks with the last step.
    const cta = canvasElement.querySelector("[data-pinned-process] a[href^='mailto:']")
    await expect(cta?.closest("[inert]")).not.toBeNull()
  },
}
