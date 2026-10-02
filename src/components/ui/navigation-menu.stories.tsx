import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./navigation-menu"

const meta = { title: "UI/NavigationMenu" } satisfies Meta
export default meta

export const Links: StoryObj<typeof meta> = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        {["Installations", "Studio"].map((l) => (
          <NavigationMenuItem key={l}>
            <NavigationMenuLink href="#">{l}</NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("link")).toHaveLength(2)
  },
}
