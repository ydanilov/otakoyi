import type { MDXComponents } from "mdx/types"

import { Separator } from "@/components/ui/separator"
import { GenerativeWork } from "@/components/works/generative-work"

// Global MDX mapping: markdown elements → design-system typography.
const components: MDXComponents = {
  h2: (props) => (
    <h2 className="mt-14 mb-4 text-2xl font-medium tracking-tight md:text-3xl" {...props} />
  ),
  h3: (props) => <h3 className="mt-10 mb-3 text-xl font-medium tracking-tight" {...props} />,
  p: (props) => <p className="mb-5 text-lg leading-relaxed text-muted-foreground" {...props} />,
  ul: (props) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-lg text-muted-foreground" {...props} />
  ),
  a: (props) => <a className="text-foreground underline underline-offset-4" {...props} />,
  hr: () => <Separator className="my-12" />,
  GenerativeWork,
}

export function useMDXComponents(): MDXComponents {
  return components
}
