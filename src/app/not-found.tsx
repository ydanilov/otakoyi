import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/sections/section-heading"
import { Button } from "@/components/ui/button"
import { proposalHref, site } from "@/config/site"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
}

export default function NotFound() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-24 md:px-8 md:pt-40 md:pb-32">
        <SectionHeading
          page
          eyebrow="404"
          title="This page isn't on the floor plan"
          description="The link may be old or mistyped. Start from our installations, or tell us about your space"
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="signal">
            <a href={proposalHref}>
              {site.cta.label}
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/works">See installations</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
