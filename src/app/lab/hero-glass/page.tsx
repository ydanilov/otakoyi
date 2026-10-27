import type { Metadata } from "next"

import { HeroGlass } from "@/components/sections/hero-glass"

// Prototype page: not linked, not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: "Hero prototype — ribbed glass",
  robots: { index: false, follow: false },
}

export default function HeroGlassPrototype() {
  return (
    <>
      <HeroGlass />
    </>
  )
}
