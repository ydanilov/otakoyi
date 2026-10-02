import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowRightIcon } from "lucide-react"
import { expect, fn } from "storybook/test"

import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Start a project", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "signal", "secondary", "outline", "ghost", "link", "destructive"],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
export const Signal: Story = { args: { variant: "signal" } }
export const Outline: Story = { args: { variant: "outline" } }
export const Ghost: Story = { args: { variant: "ghost" } }
export const WithIcon: Story = {
  args: {
    children: (
      <>
        See the work <ArrowRightIcon />
      </>
    ),
    size: "lg",
  },
}
export const Disabled: Story = { args: { disabled: true } }
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["default", "signal", "secondary", "outline", "ghost", "link", "destructive"] as const).map(
        (v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ),
      )}
    </div>
  ),
}
