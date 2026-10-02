import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"

import { AspectRatio } from "./aspect-ratio"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { ScrollArea } from "./scroll-area"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Textarea } from "./textarea"
import { Toggle } from "./toggle"
import { Button } from "./button"

const meta = { title: "UI/Primitives" } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const CardStory: Story = {
  name: "Card",
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Offices & lobbies</CardTitle>
        <CardDescription>Permanent LED walls that stay alive 24/7.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Driven by your data.</CardContent>
      <CardFooter>
        <Button size="sm" variant="signal">
          Get a proposal
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const FormFields: Story = {
  render: () => (
    <form className="grid max-w-sm gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-2">
        <Label htmlFor="venue">Venue</Label>
        <Input id="venue" placeholder="Expo hall, Warsaw" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="brief">Brief</Label>
        <Textarea id="brief" placeholder="Dates, audience, goals" />
      </div>
    </form>
  ),
  play: async ({ canvas }) => {
    const venue = canvas.getByLabelText("Venue")
    await userEvent.type(venue, "Expo hall")
    await expect(venue).toHaveValue("Expo hall")
    await userEvent.type(canvas.getByLabelText("Brief"), "Two days")
    await expect(canvas.getByLabelText("Brief")).toHaveValue("Two days")
  },
}

export const TabsStory: Story = {
  name: "Tabs",
  render: () => (
    <Tabs defaultValue="rent" className="max-w-md">
      <TabsList>
        <TabsTrigger value="rent">Rent</TabsTrigger>
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="licence">Licence</TabsTrigger>
      </TabsList>
      <TabsContent value="rent">Per event.</TabsContent>
      <TabsContent value="buy">Permanent installation + support.</TabsContent>
      <TabsContent value="licence">Yearly, multi-event.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("tab", { name: "Buy" }))
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Permanent installation")
  },
}

export const ToggleStory: Story = {
  name: "Toggle",
  render: () => (
    <Toggle variant="outline" aria-label="Animate">
      Animate
    </Toggle>
  ),
  play: async ({ canvas }) => {
    const t = canvas.getByRole("button", { name: "Animate" })
    await expect(t).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(t)
    await expect(t).toHaveAttribute("aria-pressed", "true")
  },
}

export const Layout: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      <AspectRatio ratio={16 / 9} className="rounded-md bg-muted" />
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <ScrollArea className="h-24 rounded-md border p-3 text-sm">
        {Array.from({ length: 12 }, (_, i) => (
          <p key={i}>Seed #{i + 1}</p>
        ))}
      </ScrollArea>
    </div>
  ),
}
