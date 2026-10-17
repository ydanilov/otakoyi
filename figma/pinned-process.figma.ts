// url=<FIGMA_DRAFT>?node-id=74-3772
// component=PinnedProcess
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "PinnedProcess",
  imports: ['import { PinnedProcess } from "@/components/sections/pinned-process"'],
  example: figma.code`<PinnedProcess skipTo="#faq" />`,
  metadata: { nestable: true },
}
