// url=<FIGMA_DRAFT>?node-id=7-7
// component=GenerativeWork
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

const work = figma.selectedInstance.getEnum("Work", {
  "Signal Field": "signal-field",
  Contour: "contour",
  Lattice: "lattice",
  "Signal Field — Seed 42": "signal-field",
  "Brand Demo — Fintech": "signal-field",
})
const seed = figma.selectedInstance.getEnum("Work", { "Signal Field — Seed 42": 42 })

export default {
  id: "GenerativeWork",
  imports: ['import { GenerativeWork } from "@/components/works/generative-work"'],
  example: figma.code`<GenerativeWork${figma.helpers.react.renderProp("work", work)}${figma.helpers.react.renderProp("seed", seed)} palette="dark" />`,
  metadata: { nestable: true },
}
