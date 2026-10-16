// url=<FIGMA_DRAFT>?node-id=50-254
// component=StudioHero
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "StudioHero",
  imports: ['import { StudioHero } from "@/components/sections/studio-hero"'],
  example: figma.code`<StudioHero
  first="Artists with toolboxes"
  second="Engineers with taste"
  image={{ src: "/studio/studio.webp", alt: "A creative technologist at work in the studio" }}
/>`,
  metadata: { nestable: true },
}
