// url=<FIGMA_DRAFT>?node-id=9-39
// component=WorkCard
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "WorkCard",
  imports: [
    'import { WorkCard } from "@/components/sections/work-card"',
    'import { getCase } from "@/content/cases"',
  ],
  example: figma.code`<WorkCard item={getCase("pump-the-market")!} />`,
  metadata: { nestable: true },
}
