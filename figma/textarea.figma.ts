// url=<FIGMA_DRAFT>?node-id=39-50
// component=Textarea
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Textarea",
  imports: ['import { Textarea } from "@/components/ui/textarea"'],
  example: figma.code`<Textarea rows={8} className="min-h-40" />`,
  metadata: { nestable: true },
}
