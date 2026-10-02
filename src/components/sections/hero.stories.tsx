import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Hero } from "./hero"

const meta = {
  title: "Sections/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Hero>
export default meta
export const Default: StoryObj<typeof meta> = {}
