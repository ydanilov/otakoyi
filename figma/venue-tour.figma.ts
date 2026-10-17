// url=<FIGMA_DRAFT>?node-id=45-105
// component=VenueTour
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "VenueTour",
  imports: [
    'import { VenueTour } from "@/components/sections/venue-tour"',
    'import { tourStops } from "@/content/solutions"',
  ],
  example: figma.code`<VenueTour stops={tourStops} />`,
  metadata: { nestable: true },
}
