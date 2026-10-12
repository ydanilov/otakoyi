import type { Metadata } from "next"

import { Cta } from "@/components/sections/cta"
import { LabPlayground } from "@/components/sections/lab-playground"
import { SectionHeading } from "@/components/sections/section-heading"
import { GenerativeWork } from "@/components/works/generative-work"
import { workIds, works } from "@/components/works/registry"

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Play with the live generative systems behind our installations — change the seed and density, keep the recipe.",
}

export default function LabPage() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <SectionHeading
          eyebrow="Lab"
          title="The engine, unplugged."
          description="These are the systems our installations run on, live in your browser. Change the seed, push the density, keep the recipe — the same recipe always renders the same piece."
          className="mb-12"
        />
        <LabPlayground />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <SectionHeading eyebrow="Systems" title="What's in the engine today." className="mb-12" />
        <ul className="grid gap-6 md:grid-cols-3">
          {workIds.map((id) => (
            <li key={id} className="space-y-4">
              <GenerativeWork work={id} animate={false} className="aspect-square rounded-xl" />
              <div>
                <h3 className="text-lg font-medium tracking-tight">{works[id].title}</h3>
                <p className="text-muted-foreground">{works[id].description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <Cta />
    </>
  )
}
