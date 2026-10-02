import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Logo } from "./logo"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { ThemeToggle } from "./theme-toggle"

const meta = { title: "Site/Chrome", parameters: { layout: "fullscreen" } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Header: Story = {
  render: () => <SiteHeader />,
  parameters: { nextjs: { navigation: { pathname: "/works" } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Installations" })).toHaveAttribute(
      "aria-current",
      "page",
    )
  },
}

export const HeaderMobile: Story = {
  render: () => <SiteHeader />,
  globals: { viewport: { value: "mobile1" } },
}

export const Footer: Story = { render: () => <SiteFooter /> }

export const ThemeSwitch: Story = {
  render: () => <ThemeToggle />,
  play: async ({ canvas, userEvent }) => {
    const before = document.documentElement.classList.contains("dark")
    await userEvent.click(canvas.getByRole("button", { name: "Toggle theme" }))
    await expect(document.documentElement.classList.contains("dark")).toBe(!before)
    await userEvent.click(canvas.getByRole("button", { name: "Toggle theme" }))
  },
}

export const Wordmark: Story = { render: () => <Logo className="m-6" /> }
