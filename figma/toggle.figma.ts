// url=<FIGMA_DRAFT>?node-id=39-22
// component=ToggleGroupItem
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Toggle",
  imports: ['import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"'],
  example: figma.code`<ToggleGroup type="single" variant="outline">
  <ToggleGroupItem value="all">All</ToggleGroupItem>
  <ToggleGroupItem value="conference">Conference</ToggleGroupItem>
</ToggleGroup>`,
  metadata: { nestable: true },
}
