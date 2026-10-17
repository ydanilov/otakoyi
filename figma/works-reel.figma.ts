// url=<FIGMA_DRAFT>?node-id=45-136
// component=WorksReel
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "WorksReel",
  imports: [
    'import { WorksReel } from "@/components/sections/works-reel"',
    'import { getCases } from "@/content/cases"',
  ],
  example: figma.code`<WorksReel items={getCases().filter((c) => c.featured)} />`,
  metadata: { nestable: true },
}
