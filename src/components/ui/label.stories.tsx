import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "UI/Label",
  component: Label,
  args: { children: "Company" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="company" {...args} />
      <Input id="company" />
    </div>
  ),
} satisfies Meta<typeof Label>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
