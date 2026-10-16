// url=<FIGMA_DRAFT>?node-id=39-62
// component=Slider
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Slider",
  imports: ['import { Slider } from "@/components/ui/slider"'],
  example: figma.code`<Slider min={0} max={13} step={1} value={[4, 9]} thumbLabels={["From", "Up to"]} />`,
  metadata: { nestable: true },
}
