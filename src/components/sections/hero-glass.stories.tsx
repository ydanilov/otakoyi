import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { HeroGlass } from "./hero-glass"

const meta = {
  title: "Sections/HeroGlass (prototype)",
  component: HeroGlass,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroGlass>
export default meta
export const Default: StoryObj<typeof meta> = {}
