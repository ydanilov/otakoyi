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
 * A real app screen in a quiet device bezel. The screens already carry the status bar and home
 * indicator, so the frame only draws the hardware edge. Width comes from `className`; height
 * follows the screen's own aspect ratio.
 */
export function DeviceFrame({ screen, sizes, priority, className }: DeviceFrameProps) {
  const phone = screen.device === "phone"
  return (
    <figure
      className={cn(
        "relative border bg-card shadow-2xl ring-1 ring-foreground/5",
        phone ? "rounded-[2.6rem] p-[3.5%]" : "rounded-[1.75rem] p-[2%]",
        className,
      )}
    >
      <Image
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={sizes}
        priority={priority}
        className={cn(
          "h-auto w-full bg-background",
          phone ? "rounded-[2.2rem]" : "rounded-[1.25rem]",
        )}
      />
    </figure>
  )
}
