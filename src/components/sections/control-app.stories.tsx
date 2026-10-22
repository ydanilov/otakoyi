import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { controlApp, controlScreens } from "@/content/control"
import {
  ControlAppFeature,
  ControlDevices,
  ControlFeatures,
  ControlUseCases,
  PairingSteps,
} from "./control-app"
import { DeviceFrame } from "./device-frame"

const meta = {
  title: "Sections/Control app",
  parameters: { layout: "padded" },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

/** The /solutions block: both ends of the range, devices, pairing, link to /control. */
export const SolutionsBlock: Story = {
  render: () => <ControlAppFeature />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/simple controller for the lobby/)).toBeVisible()
    await expect(canvas.getByText(/full VJ console for the show/)).toBeVisible()
    await expect(canvas.getByRole("link", { name: /Explore the control app/ })).toHaveAttribute(
      "href",
      controlApp.path,
    )
    await expect(canvas.getByRole("link", { name: "Request a demo" })).toHaveAttribute(
      "href",
      "#proposal",
    )
    await expect(canvas.getAllByRole("listitem").length).toBeGreaterThanOrEqual(3)
    await expect(canvas.getByText(/No subscription/)).toBeVisible()
  },
}

export const SolutionsBlockMobile: Story = {
  render: () => <ControlAppFeature />,
  globals: { viewport: { value: "mobile1" } },
}

export const Devices: Story = {
  render: () => (
    <div className="max-w-3xl">
      <ControlDevices />
    </div>
  ),
}

export const PhoneFrame: Story = {
  render: () => (
    <DeviceFrame screen={controlScreens.phoneLoading} sizes="280px" className="w-[280px]" />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/.{20,}/))
  },
}

export const TabletFrame: Story = {
  render: () => (
    <DeviceFrame screen={controlScreens.tabletVj} sizes="720px" className="w-full max-w-3xl" />
  ),
}

export const Pairing: Story = {
  render: () => <PairingSteps />,
  play: async ({ canvas }) => {
    const steps = canvas.getAllByRole("listitem")
    await expect(steps).toHaveLength(3)
    await expect(steps[0]).toHaveTextContent("Show the QR")
  },
}

export const UseCases: Story = { render: () => <ControlUseCases /> }
export const Features: Story = { render: () => <ControlFeatures /> }
