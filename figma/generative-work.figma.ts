// url=<FIGMA_DRAFT>?node-id=7-7
// component=GenerativeWork
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

const work = figma.selectedInstance.getEnum("work", {
  "signal-field": "signal-field",
  contour: "contour",
  lattice: "lattice",
  "signal-field-seed-42": "signal-field",
  "brand-demo-fintech": "signal-field",
})
const seed = figma.selectedInstance.getEnum("work", { "signal-field-seed-42": 42 })

export default {
  id: "GenerativeWork",
  imports: ['import { GenerativeWork } from "@/components/works/generative-work"'],
  example: figma.code`<GenerativeWork${figma.helpers.react.renderProp("work", work)}${figma.helpers.react.renderProp("seed", seed)} />`,
  metadata: { nestable: true },
}
