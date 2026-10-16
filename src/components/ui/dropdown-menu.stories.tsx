import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ChevronDownIcon } from "lucide-react"
import { expect, screen } from "storybook/test"

import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    // modal={false}: the story root stays in the a11y tree while the menu is open.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Solutions <ChevronDownIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Where it lives</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Conferences</DropdownMenuItem>
        <DropdownMenuItem>Product launches</DropdownMenuItem>
        <DropdownMenuItem>Offices &amp; lobbies</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Solutions" }))
    await expect(await screen.findByRole("menu")).toBeVisible()
  },
}
