import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { proposalHref, site } from "@/config/site"

export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="flex flex-col items-start gap-8 rounded-xl border bg-card p-8 md:flex-row md:items-end md:justify-between md:p-14">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-medium tracking-tight text-balance md:text-5xl">
            Planning an event, a stand or a lobby?
          </h2>
          <p className="text-lg text-muted-foreground">
            Tell us the venue and the date. Within a week you get a concept running in your brand
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <Button asChild size="lg" variant="signal">
            <a href={proposalHref}>
              {site.cta.label} <ArrowRightIcon />
            </a>
          </Button>
          <a
            href={`mailto:${site.email}`}
            className="inline-block py-1 text-sm text-muted-foreground hover:text-foreground"
          >
            or write to {site.email}
          </a>
        </div>
      </div>
    </section>
  )
}
