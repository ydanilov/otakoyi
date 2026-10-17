// url=<FIGMA_DRAFT>?node-id=40-35
// component=SheetContent
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "SheetContent",
  imports: ['import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"'],
  example: figma.code`<Sheet>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Otakoyi</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
  metadata: { nestable: true },
}
