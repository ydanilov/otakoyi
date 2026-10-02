import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"

import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  args: { type: "single", variant: "outline", defaultValue: "all" },
  render: (args) => (
    <ToggleGroup {...args} aria-label="Format">
      {["all", "Conference", "Office", "Exhibition"].map((v) => (
        <ToggleGroupItem key={v} value={v}>
          {v}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>
export default meta

export const Single: StoryObj<typeof meta> = {
  play: async ({ canvas }) => {
    const office = canvas.getByRole("radio", { name: "Office" })
    await userEvent.click(office)
    await expect(office).toHaveAttribute("data-state", "on")
    await expect(canvas.getByRole("radio", { name: "all" })).toHaveAttribute("data-state", "off")
  },
}
