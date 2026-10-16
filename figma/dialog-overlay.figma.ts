// url=<FIGMA_DRAFT>?node-id=56-106
// component=DialogOverlay
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "DialogOverlay",
  imports: ['import { DialogOverlay } from "@/components/ui/dialog"'],
  example: figma.code`<DialogOverlay /> {/* rendered by DialogContent; bg-black/50 */}`,
  metadata: { nestable: true },
}
