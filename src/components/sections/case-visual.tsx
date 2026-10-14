import Image from "next/image"

import { GenerativeWork } from "@/components/works/generative-work"
import type { Case } from "@/content/cases"
import { cn } from "@/lib/utils"

type CaseVisualProps = {
  item: Case
  className?: string
  /** For the generative stand-in only. */
  animate?: boolean
  /** `sizes` for the responsive image. */
  sizes?: string
  priority?: boolean
}

/**
 * The picture of a case: real imagery when the case has a cover, otherwise its generative
 * stand-in. Size and position it with `className` (it fills its box).
 */
export function CaseVisual({
  item,
  className,
  animate,
  sizes = "100vw",
  priority,
}: CaseVisualProps) {
  if (item.cover) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image
          src={item.cover.src}
          alt={item.cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    )
  }
  return (
    <GenerativeWork
      work={item.hero.work}
      seed={item.hero.seed}
      density={item.hero.density}
      animate={animate}
      className={className}
    />
  )
}
