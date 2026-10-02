import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "./badge"

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "Identity" },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "outline", "destructive"] },
  },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Secondary: Story = { args: { variant: "secondary" } }
export const Outline: Story = { args: { variant: "outline" } }
