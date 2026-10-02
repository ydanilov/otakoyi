import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { getCases } from "@/content/cases"
import { Benefits } from "./benefits"
import { Cta } from "./cta"
import { Faq } from "./faq"
import { Formats } from "./formats"
import { Process } from "./process"
import { SectionHeading } from "./section-heading"
import { WorkCard } from "./work-card"

const meta = { title: "Sections/Building blocks", parameters: { layout: "padded" } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Heading: Story = {
  render: () => (
    <SectionHeading
      eyebrow="Why it pays off"
      title="Attention is the scarcest thing at any event."
      description="Generative installations are a measurable way to win footfall, dwell time and reach."
    />
  ),
}

export const FormatsGrid: Story = { render: () => <Formats /> }
export const BenefitsGrid: Story = { render: () => <Benefits /> }
export const ProcessSteps: Story = { render: () => <Process /> }

export const FaqList: Story = {
  render: () => <Faq />,
  play: async ({ canvas, userEvent }) => {
    const q = canvas.getByRole("button", { name: "How is it priced?" })
    await userEvent.click(q)
    await expect(q).toHaveAttribute("aria-expanded", "true")
  },
}

export const Card: Story = {
  render: () => (
    <div className="max-w-md">
      <WorkCard item={getCases()[0]!} />
    </div>
  ),
}

export const CallToAction: Story = { render: () => <Cta />, parameters: { layout: "fullscreen" } }
