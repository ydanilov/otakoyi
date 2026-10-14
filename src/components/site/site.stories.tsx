import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Logo } from "./logo"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { MotionToggle } from "./motion-toggle"
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

export const MotionSwitch: Story = {
  render: () => <MotionToggle />,
  play: async ({ canvas, userEvent }) => {
    const before = document.documentElement.dataset.motion === "off"
    const button = canvas.getByRole("button", { name: before ? "Play motion" : "Pause motion" })
    await userEvent.click(button)
    await expect(document.documentElement.dataset.motion === "off").toBe(!before)
    await userEvent.click(canvas.getByRole("button"))
    await expect(document.documentElement.dataset.motion === "off").toBe(before)
  },
}
