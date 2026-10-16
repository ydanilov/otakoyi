import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen } from "storybook/test"

import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

const meta = {
  title: "UI/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="signal">Start a project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tell us about your space</DialogTitle>
          <DialogDescription>
            We reply within one working day with first ideas and the next step
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Start a project" }))
    // Opening animates from opacity 0, so assert the open state rather than visibility.
    await expect(await screen.findByRole("dialog")).toHaveAttribute("data-state", "open")
  },
}
