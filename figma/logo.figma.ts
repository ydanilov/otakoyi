// url=<FIGMA_DRAFT>?node-id=8-56
// component=Logo
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

export default {
  id: "Logo",
  imports: ['import { Logo } from "@/components/site/logo"'],
  example: figma.code`<Logo />`,
  metadata: { nestable: true },
}
