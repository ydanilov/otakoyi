import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "UI/Input",
  component: Input,
  args: { placeholder: "you@company.com", type: "email" },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="email">Work email</Label>
      <Input id="email" {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByLabelText("Work email")
    await userEvent.type(input, "hi@otakoyi.team")
    await expect(input).toHaveValue("hi@otakoyi.team")
  },
}
export const Invalid: Story = { args: { "aria-invalid": true } }
export const Disabled: Story = { args: { disabled: true } }
