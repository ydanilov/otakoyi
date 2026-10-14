import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { LogoWall } from "./logo-wall"

const meta = { title: "Sections/Logo wall", component: LogoWall } satisfies Meta<typeof LogoWall>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { className: "m-8" },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("listitem")).toHaveLength(6)
  },
}
