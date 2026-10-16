// url=<FIGMA_DRAFT>?node-id=9-66
// component=AccordionItem
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "AccordionItem",
  imports: [
    'import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"',
  ],
  example: figma.code`<AccordionItem value="hardware">
  <AccordionTrigger>Do you provide the hardware?</AccordionTrigger>
  <AccordionContent>Yes — projectors, LED, sensors and media servers.</AccordionContent>
</AccordionItem>`,
  metadata: { nestable: true },
}
