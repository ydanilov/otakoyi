import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ToggleGroup, ToggleGroupItem } from "./toggle-group"

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  args: { type: "single", defaultValue: "all", "aria-label": "Filter installations" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="all">All</ToggleGroupItem>
      <ToggleGroupItem value="stage">Stage</ToggleGroupItem>
      <ToggleGroupItem value="lobby">Lobby</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Outline: Story = { args: { variant: "outline" } }
