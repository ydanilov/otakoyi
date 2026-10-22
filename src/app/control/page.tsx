import type { Metadata } from "next"

import {
  ControlAvailability,
  ControlDevices,
  ControlFeatures,
  ControlInstallationPanel,
  ControlUseCases,
  ControlWorksWith,
  PairingSteps,
} from "@/components/sections/control-app"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"
import { HeroField } from "@/components/sections/hero-field"
import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { SectionHeading } from "@/components/sections/section-heading"
import { Button } from "@/components/ui/button"
import { proposalHref } from "@/config/site"
import { controlApp, controlFaq, controlScreens, controlWorksWith } from "@/content/control"
import { JsonLd, breadcrumbs, faqPage, orgId } from "@/lib/json-ld"
import { absoluteUrl, pageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

const description =
  "Otakoyi Control, the branded controller that comes with every installation: a simple phone controller for lobbies or a full VJ console on a tablet for live shows. Pair by QR, no accounts. Included, no subscription"

export const metadata: Metadata = pageMetadata({
  title: "Control app",
  description,
  path: controlApp.path,
})

function Section({
  id,
  children,
  className,
}: {
  id?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto max-w-7xl scroll-mt-20 px-4 py-16 md:px-8 md:py-24", className)}
    >
      {children}
    </section>
  )
}

export default function ControlPage() {
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "SoftwareApplication",
            name: controlApp.name,
            applicationCategory: "BusinessApplication",
            operatingSystem: "iOS, iPadOS, Web browser",
            description,
            url: absoluteUrl(controlApp.path),
            image: absoluteUrl(controlScreens.tabletVj.src),
            screenshot: Object.values(controlScreens).map((s) => absoluteUrl(s.src)),
            publisher: { "@id": orgId },
          },
          faqPage(controlFaq),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Control app", path: controlApp.path },
          ]),
        ]}
      />

      <section className="relative isolate overflow-hidden">
        <HeroField seed={41} />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-16 pb-16 md:px-8 md:pt-24 md:pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p className="mb-4 font-mono text-xs tracking-widest text-signal uppercase">
              {controlApp.name}
            </p>
            <ReactiveHeadline
              text="Your installation, in your hands"
              className="max-w-3xl text-5xl leading-[0.95] tracking-tighter text-balance md:text-7xl"
            />
            <p className="mt-6 max-w-xl text-lg text-pretty text-muted-foreground md:text-xl">
              {controlApp.promise}. Scan a QR and you are in control
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="signal">
                <a href={proposalHref}>Request a demo</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#pairing">How pairing works</a>
              </Button>
            </div>
            <p className="mt-8 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              iPhone and iPad · in beta · Web · works today
            </p>
          </div>
          <ControlDevices phone={controlScreens.phoneLoading} priority />
        </div>
      </section>

      <Section id="use-cases">
        <SectionHeading
          eyebrow="Two ways to run it"
          title="A calm remote for the lobby. A console for the show"
          description="We design the controller around your installation and the people who run it. Every delivery ships both layouts, phone and tablet"
          className="mb-12"
        />
        <ControlUseCases />
      </Section>

      <Section id="pairing">
        <SectionHeading
          eyebrow="Pairing"
          title="Show the QR. Scan. Control"
          description="No accounts and no passwords. The installation shows a code on its own screen; staff get control within seconds. A web version works in any browser on the same network"
          className="mb-12"
        />
        <PairingSteps />
      </Section>

      <Section id="installation">
        <SectionHeading
          eyebrow="Safe by design"
          title="One in control. Everyone in sync"
          description="One device controls at a time and every other one sees the live state. Hand over with one tap — and the studio can always take over remotely"
          className="mb-12"
        />
        <ControlInstallationPanel />
      </Section>

      <Section id="features">
        <SectionHeading eyebrow="Features" title="Everything the show needs" className="mb-12" />
        <ControlFeatures />
      </Section>

      <Section id="works-with">
        <SectionHeading
          eyebrow="Works with"
          title="TouchDesigner and any OSC software"
          description={controlWorksWith.body}
          className="mb-12"
        />
        <ControlWorksWith />
      </Section>

      <Section id="availability">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
          <SectionHeading
            eyebrow="Availability"
            title="Included. Yours for good"
            description="The control app comes with every installation. No subscription and nothing to renew — access stays yours for good"
          />
          <ControlAvailability />
        </div>
      </Section>

      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Questions about the control app" className="mb-8" />
        <Faq items={controlFaq} />
      </Section>

      <Cta />
    </>
  )
}
