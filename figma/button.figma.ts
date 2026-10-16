// url=<FIGMA_DRAFT>?node-id=6-26
// component=Button
// Code Connect template: what Figma Dev Mode shows for this component instead of generated CSS.
import figma from "figma"

const variant = figma.selectedInstance.getEnum("Variant", {
  signal: "signal",
  default: "default",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive",
})
const size = figma.selectedInstance.getEnum("Size", {
  lg: "lg",
  default: "default",
  sm: "sm",
  icon: "icon",
})

export default {
  id: "Button",
  imports: [
    'import { Button } from "@/components/ui/button"',
    'import { ArrowRightIcon } from "lucide-react"',
  ],
  example: figma.code`<Button${figma.helpers.react.renderProp("variant", variant)}${figma.helpers.react.renderProp("size", size)}>
  Get a proposal <ArrowRightIcon />
</Button>`,
  metadata: { nestable: true },
}
