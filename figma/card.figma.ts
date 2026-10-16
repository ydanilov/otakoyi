// url=<FIGMA_DRAFT>?node-id=40-14
// component=Card
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Card",
  imports: [
    'import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"',
  ],
  example: figma.code`<Card>
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>`,
  metadata: { nestable: true },
}
