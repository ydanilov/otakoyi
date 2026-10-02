import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { formats, getCases } from "@/content/cases"
import { WorksGrid } from "./works-grid"

const meta = {
  title: "Sections/WorksGrid",
  component: WorksGrid,
  args: { items: getCases(), formats },
} satisfies Meta<typeof WorksGrid>
export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {}

export const FilterByOffice: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("radio", { name: "Office" }))
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1)
    await expect(canvas.getByText("Grainline")).toBeVisible()
  },
}

export const Empty: Story = { args: { items: [] } }
