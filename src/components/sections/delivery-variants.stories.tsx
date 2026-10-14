import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import {
  DeliveryCompare,
  DeliveryPromises,
  DeliveryStatement,
  DeliveryTimeline,
} from "./delivery-variants"

const meta = { title: "Sections/Delivery variants" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const wrap = (n: React.ReactNode) => <div className="p-8">{n}</div>

export const Promises: Story = {
  render: () => wrap(<DeliveryPromises />),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Grows with you")).toBeInTheDocument()
  },
}
export const Timeline: Story = { render: () => wrap(<DeliveryTimeline />) }
export const Compare: Story = { render: () => wrap(<DeliveryCompare />) }
export const Statement: Story = { render: () => wrap(<DeliveryStatement />) }
