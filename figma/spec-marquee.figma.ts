// url=<FIGMA_DRAFT>?node-id=43-37
// component=SpecMarquee
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "SpecMarquee",
  imports: ['import { SpecMarquee } from "@/components/sections/spec-marquee"'],
  example: figma.code`<SpecMarquee items={["Stage LED backdrops", "Interactive floors", "Projection mapping"]} />`,
  metadata: { nestable: true },
}
