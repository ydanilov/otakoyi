import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"

const meta = {
  title: "UI/Accordion",
  component: Accordion,
  args: { type: "single", collapsible: true },
  render: (args) => (
    <Accordion {...args} className="max-w-xl">
      <AccordionItem value="a">
        <AccordionTrigger>Rules over renders</AccordionTrigger>
        <AccordionContent>We deliver systems, not single images.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Every image is reproducible</AccordionTrigger>
        <AccordionContent>Seeds are archived.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Rules over renders" })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  },
}
