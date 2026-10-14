import Link from "next/link"

import { site } from "@/config/site"
import { cn } from "@/lib/utils"

/** Wordmark set in New Rocker. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-logo text-[1.75rem] leading-none tracking-normal md:text-[2rem]",
        className,
      )}
    >
      {site.name}
    </Link>
  )
}
