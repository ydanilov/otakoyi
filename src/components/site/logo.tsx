import Link from "next/link"

import { site } from "@/config/site"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 text-sm font-medium tracking-tight", className)}
    >
      <span aria-hidden className="inline-block size-3 rounded-full bg-signal" />
      {site.name}
    </Link>
  )
}
