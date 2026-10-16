// url=<FIGMA_DRAFT>?node-id=6-31
// component=Badge
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

const variant = figma.selectedInstance.getEnum("Variant", {
  default: "default",
  secondary: "secondary",
  outline: "outline",
  destructive: "destructive",
})

export default {
  id: "Badge",
  imports: ['import { Badge } from "@/components/ui/badge"'],
  example: figma.code`<Badge${figma.helpers.react.renderProp("variant", variant)}>Conference</Badge>`,
  metadata: { nestable: true },
}
