import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Benefits } from "@/components/sections/benefits"
import { BrandDemo } from "@/components/sections/brand-demo"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"
import { Formats } from "@/components/sections/formats"
import { Hero } from "@/components/sections/hero"
import { Process } from "@/components/sections/process"
import { SectionHeading } from "@/components/sections/section-heading"
import { WorkCard } from "@/components/sections/work-card"
import { Button } from "@/components/ui/button"
import { getCases } from "@/content/cases"

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      {children}
    </section>
  )
}

export default function HomePage() {
  const featured = getCases().filter((c) => c.featured)

  return (
    <>
      <Hero />

      <Section id="formats">
        <SectionHeading
          eyebrow="Where it works"
          title="One studio for every space your brand shows up in."
          className="mb-12"
        />
        <Formats />
      </Section>

      <Section id="benefits">
        <SectionHeading
          eyebrow="Why it pays off"
          title="Attention is the scarcest thing at any event. We design for it."
          description="Generative installations are not decoration. They are a measurable way to win footfall, dwell time and reach."
          className="mb-12"
        />
        <Benefits />
      </Section>

      <Section id="customisation">
        <SectionHeading
          eyebrow="Customised to your brand"
          title="Your brand is the input, not a logo in the corner."
          description="Every installation is built around your identity and your data — so it could only ever be yours."
          className="mb-12"
        />
        <BrandDemo />
      </Section>

      <Section id="installations">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected installations"
            title="Built for stages, stands and lobbies."
          />
          <Button asChild variant="ghost">
            <Link href="/works">
              All installations <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <li key={item.slug}>
              <WorkCard item={item} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="process">
        <SectionHeading
          eyebrow="How it works"
          title="From brief to opening night."
          description="Fixed milestones, a live prototype in week one, and no surprises on site."
          className="mb-12"
        />
        <Process />
      </Section>

      <Section id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions we hear from event and brand teams"
          className="mb-8"
        />
        <Faq />
      </Section>

      <Cta />
    </>
  )
}
