// url=<FIGMA_DRAFT>?node-id=43-84
// component=TechnologyBento
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "TechnologyBento",
  imports: [
    'import { TechnologyBento } from "@/components/sections/technologies"',
    'import { technologies } from "@/content/technologies"',
  ],
  example: figma.code`<TechnologyBento items={technologies.filter((t) => t.kind === "input")} />`,
  metadata: { nestable: true },
}
