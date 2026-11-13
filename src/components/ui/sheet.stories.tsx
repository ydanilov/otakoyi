import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { MenuIcon } from "lucide-react"
import { expect, screen } from "storybook/test"

import { Button } from "./button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

const meta = {
  title: "UI/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>
export default meta
type Story = StoryObj<typeof meta>

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Otakoyi</SheetTitle>
          <SheetDescription>Installations, solutions and the studio</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }))
    // Opening animates from opacity 0, so assert the open state rather than visibility.
    await expect(await screen.findByRole("dialog")).toHaveAttribute("data-state", "open")
  },
}
