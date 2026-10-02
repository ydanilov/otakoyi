import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { BrandDemo } from "./brand-demo"

const meta = {
  title: "Sections/BrandDemo",
  component: BrandDemo,
} satisfies Meta<typeof BrandDemo>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SwitchBrand: Story = {
  play: async ({ canvas, userEvent }) => {
    const luxury = canvas.getByRole("radio", { name: "Luxury" })
    await userEvent.click(luxury)
    await expect(luxury).toHaveAttribute("data-state", "on")
    const contour = canvas.getByRole("radio", { name: "Contour" })
    await userEvent.click(contour)
    await expect(canvas.getByRole("img", { name: /Contour/ })).toBeInTheDocument()
  },
}
