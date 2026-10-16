// url=<FIGMA_DRAFT>?node-id=47-168
// component=Occasions
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Occasions",
  imports: [
    'import { Occasions } from "@/components/sections/occasions"',
    'import { solutions } from "@/content/solutions"',
  ],
  example: figma.code`<Occasions items={solutions} />`,
  metadata: { nestable: true },
}
