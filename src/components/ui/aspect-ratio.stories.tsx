import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AspectRatio } from "./aspect-ratio"

const meta = {
  title: "UI/AspectRatio",
  component: AspectRatio,
  args: { ratio: 16 / 9 },
} satisfies Meta<typeof AspectRatio>
export default meta
type Story = StoryObj<typeof meta>

export const Widescreen: Story = {
  render: (args) => (
    <div className="w-96">
      <AspectRatio {...args} className="grid place-items-center rounded-xl border bg-muted">
        <span className="font-mono text-xs text-muted-foreground">16 / 9</span>
      </AspectRatio>
    </div>
  ),
}
