import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { DeliveryStatement } from "./delivery-statement"

const meta = { title: "Sections/Delivery statement" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="p-8">
      <DeliveryStatement />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Runs on its own")).toBeInTheDocument()
  },
}
