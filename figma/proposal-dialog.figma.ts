// url=<FIGMA_DRAFT>?node-id=50-252
// component=ProposalDialog
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "ProposalDialog",
  imports: ['import { ProposalDialog } from "@/components/site/proposal-dialog"'],
  example: figma.code`<ProposalDialog /> {/* opens on any link to #proposal */}`,
  metadata: { nestable: true },
}
