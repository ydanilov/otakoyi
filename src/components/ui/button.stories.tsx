import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowRightIcon } from "lucide-react"
import { expect, fn } from "storybook/test"

import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Start a project", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "signal", "secondary", "outline", "ghost", "link", "destructive"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon-xs", "icon-sm", "icon", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}
export const Signal: Story = {
  args: {
    variant: "signal",
    size: "lg",
    children: (
      <>
        Start a project <ArrowRightIcon data-icon="inline-end" />
      </>
    ),
  },
}
export const Outline: Story = { args: { variant: "outline" } }
export const Ghost: Story = { args: { variant: "ghost" } }
export const WithIcon: Story = {
  args: {
    children: (
      <>
        See the work <ArrowRightIcon data-icon="inline-end" />
      </>
    ),
    size: "lg",
  },
}
export const Disabled: Story = { args: { disabled: true } }
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["default", "signal", "secondary", "outline", "ghost", "link", "destructive"] as const).map(
        (v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ),
      )}
    </div>
  ),
}
export const Link: Story = { args: { variant: "link", children: "Read the case" } }

const VARIANTS = ["signal", "default", "secondary", "outline", "ghost", "link"] as const
const SIZES = ["xs", "sm", "default", "lg"] as const

/** The full matrix — the same set Code Connect maps to the Figma Button component. */
export const Matrix: Story = {
  render: () => (
    <div className="grid gap-4">
      {VARIANTS.map((v) => (
        <div key={v} className="flex flex-wrap items-center gap-3">
          <span className="w-20 font-mono text-xs text-muted-foreground">{v}</span>
          {SIZES.map((s) => (
            <Button key={s} variant={v} size={s}>
              {s === "xs" ? "Works" : "See installations"}
              {s !== "xs" && <ArrowRightIcon data-icon="inline-end" />}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
}
