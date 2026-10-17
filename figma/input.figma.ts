// url=<FIGMA_DRAFT>?node-id=39-42
// component=Input
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Input",
  imports: ['import { Input } from "@/components/ui/input"'],
  example: figma.code`<Input id="email" type="email" />`,
  metadata: { nestable: true },
}
