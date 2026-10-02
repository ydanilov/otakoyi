import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

/** Portal-based primitives: open, focus management and Escape-to-close are tested. */
const meta = { title: "UI/Overlays" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const DialogStory: Story = {
  name: "Dialog",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Book a call</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book a 30-minute call</DialogTitle>
          <DialogDescription>Tell us about your venue and date.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="signal">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Book a call" }))
    const dialog = await screen.findByRole("dialog", { name: "Book a 30-minute call" })
    // Radix animates in from opacity 0 — wait for the animation instead of racing it.
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const SheetStory: Story = {
  name: "Sheet",
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Field Studio</SheetTitle>
          <SheetDescription>Navigation</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }))
    const sheet = await screen.findByRole("dialog", { name: "Field Studio" })
    await waitFor(() => expect(sheet).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  },
}

export const DropdownStory: Story = {
  name: "Dropdown menu",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Format</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Installation format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Conference</DropdownMenuItem>
        <DropdownMenuItem>Office</DropdownMenuItem>
        <DropdownMenuItem>Exhibition</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Format" }))
    const menu = await screen.findByRole("menu")
    await waitFor(() => expect(menu).toBeVisible())
    await expect(screen.getAllByRole("menuitem")).toHaveLength(3)
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument())
  },
}

export const TooltipStory: Story = {
  name: "Tooltip",
  render: () => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">What is a seed?</Button>
        </TooltipTrigger>
        <TooltipContent>Same seed → same image.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas }) => {
    await userEvent.hover(canvas.getByRole("button", { name: "What is a seed?" }))
    await expect(await screen.findByRole("tooltip")).toHaveTextContent("Same seed → same image.")
  },
}
