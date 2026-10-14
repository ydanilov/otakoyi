import { Benefits } from "@/components/sections/benefits"
import { BrandDemo } from "@/components/sections/brand-demo"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero"
import { InNumbers } from "@/components/sections/in-numbers"
import { PinnedProcess } from "@/components/sections/pinned-process"
import { SectionHeading } from "@/components/sections/section-heading"
import { SpecMarquee } from "@/components/sections/spec-marquee"
import { Technologies } from "@/components/sections/technologies"
import { VenueTour } from "@/components/sections/venue-tour"
import { WorksReel } from "@/components/sections/works-reel"
import { getCases } from "@/content/cases"
import { tourStops } from "@/content/solutions"
import { technologies } from "@/content/technologies"

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      {children}
    </section>
  )
}

const specs = [
  "Stage LED backdrops",
  "Interactive floors",
  "Lobby brand walls",
  "Projection mapping",
  "Live data feeds",
  "Audio-reactive",
  "Prototype in ≈ 1 week",
  "On-site operator",
  "Remote monitoring",
  "Your palette, your type",
] as const

/** Claims taken from our own delivery model (process, runtime) — not client results. */
const stats = [
  { value: 1, prefix: "≈", suffix: " wk", label: "to a live prototype in your brand" },
  { value: 1, suffix: " engine", label: "for every screen, venue and format" },
  { value: 24, suffix: "/7", label: "runtime for permanent lobby walls" },
  { value: 0, suffix: " re-renders", label: "when the venue or screen changes" },
]

export default function HomePage() {
  const featured = getCases().filter((c) => c.featured)

  return (
    <>
      <Hero />

      <SpecMarquee items={specs} />

      <VenueTour stops={tourStops} />

      <Section id="technology">
        <SectionHeading
          eyebrow="Technology"
          title="One engine. Every surface in the room"
          description="Projection, LED, light and screens, driven by music, movement and your data — so every surface tells the same story, live"
          className="mb-12"
        />
        <Technologies items={technologies} />
      </Section>

      <Section id="benefits">
        <SectionHeading
          eyebrow="Why it pays off"
          title="Attention is the scarcest thing at any event. We design for it"
          description="Generative installations are not decoration. They are a measurable way to win footfall, dwell time and reach"
          className="mb-12"
        />
        <Benefits />
      </Section>

      <WorksReel items={featured} />

      <Section id="numbers">
        <SectionHeading
          eyebrow="How we deliver"
          title="Built to run, not to render"
          className="mb-12"
        />
        <InNumbers stats={stats} />
      </Section>

      <Section id="customisation">
        <SectionHeading
          eyebrow="Customised to your brand"
          title="Your brand is the input, not a logo in the corner"
          description="Every installation is built around your identity and your data — so it could only ever be yours"
          className="mb-12"
        />
        <BrandDemo />
      </Section>

      <PinnedProcess skipTo="#faq" />

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
