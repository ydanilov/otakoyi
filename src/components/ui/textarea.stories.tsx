import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Label } from "./label"
import { Textarea } from "./textarea"

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: { placeholder: "Event, dates, venue and what you want people to feel" },
  render: (args) => (
    <div className="grid w-96 gap-2">
      <Label htmlFor="brief">About the project</Label>
      <Textarea id="brief" {...args} />
    </div>
  ),
} satisfies Meta<typeof Textarea>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
