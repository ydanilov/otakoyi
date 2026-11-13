import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  args: { defaultValue: "stage" },
  render: (args) => (
    <Tabs {...args} className="w-96">
      <TabsList>
        <TabsTrigger value="stage">Stage</TabsTrigger>
        <TabsTrigger value="stand">Stand</TabsTrigger>
        <TabsTrigger value="lobby">Lobby</TabsTrigger>
      </TabsList>
      <TabsContent value="stage" className="text-sm text-muted-foreground">
        LED backdrop that follows the speaker
      </TabsContent>
      <TabsContent value="stand" className="text-sm text-muted-foreground">
        Floors and walls that pull visitors in
      </TabsContent>
      <TabsContent value="lobby" className="text-sm text-muted-foreground">
        A wall that stays alive for years
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Lobby" }))
    await expect(canvas.getByText("A wall that stays alive for years")).toBeVisible()
  },
}
export const Vertical: Story = { args: { orientation: "vertical" } }
