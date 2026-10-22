import Image from "next/image"

import type { ControlScreen } from "@/content/control"
import { cn } from "@/lib/utils"

type DeviceFrameProps = {
  screen: ControlScreen
  /** `sizes` for the responsive image — the frame's rendered width. */
  sizes: string
  priority?: boolean
  className?: string
}

/**
 * Proportions of a current iPhone / iPad, as a share of the frame's own width (container query
 * units, so the bezel scales with the device instead of with the column it sits in). The outer
 * radius is the screen radius plus the bezel, so both corners stay concentric.
 *  - phone: ~5 px bezel at a 200 px frame, display corner ≈ 13 % of the screen width
 *  - tablet: ~6 px bezel at a 560 px frame, display corner ≈ 1.5 % of the screen width
 */
const frame = {
  phone: { shell: "rounded-[14.6cqw]", inset: "p-[2.4cqw]", screen: "rounded-[12.4cqw]" },
  tablet: { shell: "rounded-[2.6cqw]", inset: "p-[1.1cqw]", screen: "rounded-[1.5cqw]" },
} as const

/**
 * A real app screen in a thin device bezel. The screens already carry the status bar and home
 * indicator, so the frame only draws the hardware: a near-black bezel, no outline.
 * Width comes from `className`; height always follows the screen's own aspect ratio (`h-fit`, so
 * a stretching flex parent can never leave an empty band under the screen).
 */
export function DeviceFrame({ screen, sizes, priority, className }: DeviceFrameProps) {
  const f = frame[screen.device]
  return (
    <figure className={cn("@container relative h-fit", className)}>
      <div
        className={cn(
          "bg-foreground shadow-2xl dark:bg-background",
          f.shell,
          f.inset,
        )}
      >
        <Image
          src={screen.src}
          alt={screen.alt}
          width={screen.width}
          height={screen.height}
          sizes={sizes}
          priority={priority}
          className={cn("block h-auto w-full bg-background", f.screen)}
        />
      </div>
    </figure>
  )
}
