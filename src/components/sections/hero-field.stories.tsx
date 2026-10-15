import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { HeroField } from "./hero-field"

const meta = {
  title: "Sections/HeroField",
  component: HeroField,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <section className="relative isolate h-[32rem] overflow-hidden">
        <Story />
        <h1 className="p-10 text-6xl font-medium tracking-tighter">
          Move the cursor over the field
        </h1>
      </section>
    ),
  ],
} satisfies Meta<typeof HeroField>
export default meta
export const Default: StoryObj<typeof meta> = { args: { seed: 5 } }
