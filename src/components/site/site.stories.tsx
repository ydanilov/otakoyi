import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, within } from "storybook/test"

import { Logo } from "./logo"
import { PageTransition } from "./page-transition"
import { socialIcons } from "./social-icons"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"
import { ProposalDialog } from "./proposal-dialog"
import ProposalForm from "./proposal-form"

const meta = { title: "Site/Chrome", parameters: { layout: "fullscreen" } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Header: Story = {
  render: () => <SiteHeader />,
  parameters: { nextjs: { navigation: { pathname: "/works" } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Portfolio" })).toHaveAttribute(
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

export const Wordmark: Story = { render: () => <Logo className="m-6" /> }

export const Proposal: Story = {
  render: () => <ProposalForm open onOpenChange={() => {}} />,
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await expect(await body.findByRole("dialog", { name: "Get a proposal" })).toBeInTheDocument()
    await expect(body.getAllByRole("slider")).toHaveLength(2)
  },
}

// Listener only; renders nothing until a #proposal link is followed.
export const ProposalListener: Story = { render: () => <ProposalDialog /> }

export const SocialIcons: Story = {
  render: () => (
    <div className="flex gap-4 p-6">
      {Object.entries(socialIcons).map(([name, Icon]) => (
        <Icon key={name} className="size-6" aria-label={name} role="img" />
      ))}
    </div>
  ),
}

// Route-change fade wrapper; in Storybook (stable React, no ViewTransition) it renders children as-is.
export const PageTransitionWrapper: Story = {
  render: () => (
    <PageTransition>
      <main className="p-6">Page content</main>
    </PageTransition>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("main")).toHaveTextContent("Page content")
  },
}
