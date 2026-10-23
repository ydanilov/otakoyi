import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ArrowRightIcon } from "lucide-react"

import { Badge } from "./badge"
import { Button } from "./button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card"

const meta = {
  title: "UI/Card",
  component: Card,
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Stage LED backdrop</CardTitle>
        <CardDescription>Generative visuals that react to the speaker and the room</CardDescription>
        <CardAction>
          <Badge variant="outline">Conferences</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Runs live for the whole event; content follows your brand palette and data.
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          See the format <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </CardFooter>
    </Card>
  ),
}
