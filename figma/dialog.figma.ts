// url=<FIGMA_DRAFT>?node-id=40-24
// component=DialogContent
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "DialogContent",
  imports: [
    'import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"',
  ],
  example: figma.code`<Dialog>
  <DialogContent className="sm:max-w-xl">
    <DialogHeader>
      <DialogTitle>Get a proposal</DialogTitle>
      <DialogDescription>An email is enough to start</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
  metadata: { nestable: true },
}
