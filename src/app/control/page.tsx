import type { Metadata } from "next"
import Image from "next/image"

import {
  ControlDevices,
  ControlFeatures,
  ControlUseCases,
  PairingSteps,
} from "@/components/sections/control-app"
import { Cta } from "@/components/sections/cta"
import { Faq } from "@/components/sections/faq"
import { HeroField } from "@/components/sections/hero-field"
import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { SectionHeading } from "@/components/sections/section-heading"
import { appStoreUrl, controlApp, controlFaq, controlScreens } from "@/content/control"
import { JsonLd, breadcrumbs, faqPage, orgId } from "@/lib/json-ld"
import { absoluteUrl, pageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

const description =
  "Otakoyi Control, the controller for your generative installation — change what it does in real time. A simple phone controller for lobbies or a full VJ console on a tablet for live shows. Pair by QR, no accounts. Included, no subscription"

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

const appStoreBadge = (
  <Image
    src="/control/app-store-badge.svg"
    alt={appStoreUrl ? "Download on the App Store" : "Download on the App Store — coming soon"}
    width={135}
    height={40}
    unoptimized
    className="h-12 w-auto"
  />
)

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

      <section className="relative isolate hero-under-header overflow-hidden">
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
              {controlApp.lead}. {controlApp.promise}
            </p>
            {/* Apple badge: official black artwork, ≥ 40 px tall, clear space ≥ ¼ of its height. */}
            <div className="mt-10 flex items-start">
              {appStoreUrl ? (
                <a href={appStoreUrl} aria-label={`Download ${controlApp.name} on the App Store`}>
                  {appStoreBadge}
                </a>
              ) : (
                appStoreBadge
              )}
            </div>
            <p className="mt-8 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Free forever · No subscription · No hidden payments
            </p>
          </div>
          <ControlDevices phone={controlScreens.phoneLoading} priority />
        </div>
      </section>

      <Section id="use-cases">
        <SectionHeading
          eyebrow="Two ways to run it"
          title="A calm remote for the lobby. A console for the show"
          description="Made for Otakoyi installations. We build the dashboard for each project around what you need to run. Every delivery ships both layouts, phone and tablet"
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

      <Section id="features">
        <SectionHeading eyebrow="Features" title="Everything the show needs" className="mb-12" />
        <ControlFeatures />
      </Section>

      <Section id="faq">
        <SectionHeading eyebrow="FAQ" title="Questions about the control app" className="mb-8" />
        <Faq items={controlFaq} />
      </Section>

      <Cta />
    </>
  )
}
