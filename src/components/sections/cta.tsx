import { ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GenerativeWork } from "@/components/works/generative-work"
import { proposalHref, site } from "@/config/site"

/**
 * Closing call to action: a full-bleed card with a live generative work rising behind the
 * headline, the proposal button and the studio email as a quiet second route.
 */
export function Cta() {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="relative isolate overflow-hidden rounded-2xl border">
        <GenerativeWork
          work="signal-field"
          seed={21}
          density={0.6}
          className="absolute inset-0 -z-20 opacity-70"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background/80 via-transparent to-transparent"
        />
        <div className="flex min-h-[28rem] flex-col justify-end gap-10 p-8 md:min-h-[34rem] md:p-14 lg:p-20">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">Not sure yet?</p>
          <div className="max-w-3xl space-y-6">
            <h2 className="text-4xl leading-[0.95] font-medium tracking-tighter text-balance md:text-7xl">
              Let&rsquo;s talk it through
            </h2>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
              Tell us about the space, the date or just the idea. We will shape it into an
              installation together
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button asChild size="lg" variant="signal">
              <a href={proposalHref}>
                {site.cta.label}
                <ArrowRightIcon data-icon="inline-end" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
