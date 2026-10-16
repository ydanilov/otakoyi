import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PauseIcon } from "lucide-react"
import { expect } from "storybook/test"

import { Toggle } from "./toggle"

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  args: { "aria-label": "Pause motion", children: <PauseIcon /> },
  argTypes: { variant: { control: "select", options: ["default", "outline"] } },
} satisfies Meta<typeof Toggle>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const t = canvas.getByRole("button", { name: "Pause motion" })
    await userEvent.click(t)
    await expect(t).toHaveAttribute("aria-pressed", "true")
  },
}
export const Outline: Story = { args: { variant: "outline" } }
