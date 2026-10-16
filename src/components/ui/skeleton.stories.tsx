import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Skeleton } from "./skeleton"

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>
export default meta
type Story = StoryObj<typeof meta>

export const WorkCard: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Skeleton className="aspect-[4/3] rounded-xl" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
}
