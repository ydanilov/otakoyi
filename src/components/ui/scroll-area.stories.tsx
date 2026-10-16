import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ScrollArea } from "./scroll-area"

const items = [
  "Conferences",
  "Product launches",
  "Festivals",
  "Offices",
  "Lobbies",
  "Museums",
  "Retail",
  "Exhibitions",
  "Trade shows",
  "Concerts",
]

const meta = {
  title: "UI/ScrollArea",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-56 rounded-xl border">
      <ul className="p-4 text-sm">
        {items.map((x) => (
          <li key={x} className="border-b py-2 last:border-0">
            <a href={`#${x}`} className="hover:text-signal">
              {x}
            </a>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
}
