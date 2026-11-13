import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { InfoIcon } from "lucide-react"

import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
} satisfies Meta<typeof Tooltip>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="What is a seed?">
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Same seed, same artwork — every time</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
