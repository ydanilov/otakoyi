// url=<FIGMA_DRAFT>?node-id=74-540
// component=SectionHeading
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "SectionHeading",
  imports: ['import { SectionHeading } from "@/components/sections/section-heading"'],
  example: figma.code`<SectionHeading
  eyebrow="Why it pays off"
  title="Attention is the scarcest thing at any event. We design for it"
  description="One or two sentences on the business benefit"
/>`,
  metadata: { nestable: true },
}
