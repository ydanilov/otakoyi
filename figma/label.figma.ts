// url=<FIGMA_DRAFT>?node-id=39-24
// component=Label
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Label",
  imports: ['import { Label } from "@/components/ui/label"'],
  example: figma.code`<Label htmlFor="email">
  Work email<span className="text-signal">*</span>
</Label>`,
  metadata: { nestable: true },
}
