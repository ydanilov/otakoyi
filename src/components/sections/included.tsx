import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { DeviceFrame } from "@/components/sections/device-frame"
import { controlApp, controlScreens } from "@/content/control"

export const includedItems = [
  { title: "Concept", body: "A concept and a live prototype in your brand, within a week" },
  {
    title: "Your installation",
    body: "A generative installation built for you, ready to grow into new venues",
  },
  { title: "Data and interaction", body: "Your data, sensors and audience wired into every frame" },
  { title: "Hardware", body: "Projection, LED and sensors specified, sourced and rigged" },
  { title: "On site", body: "Installation, calibration and an operator on the night" },
  { title: "Support", body: "Remote monitoring and updates long after the doors close" },
] as const

/** The control app, closing the grid as a full-width row in the same card style. */
export const includedControl = {
  title: "Control app",
  body: "The controller for your generative installation — change what it does in real time. From a lobby remote to a full VJ console, branded for you",
  note: "Included with every installation — yours to keep",
} as const

const number = (i: number) => String(i + 1).padStart(2, "0")

/**
 * "What's included" on /studio: the turnkey scope as numbered cards, closed by a full-width
 * control-app row (07) so the 3 × 2 grid stays balanced.
 */
export function Included() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {includedItems.map((item, i) => (
        <li
          key={item.title}
          className="group flex min-h-56 flex-col justify-between gap-10 bg-background p-6 transition-colors hover:bg-card md:p-8"
        >
          <span className="flex items-center justify-between font-mono text-xs tracking-widest text-muted-foreground">
            {number(i)}
            <CheckIcon
              aria-hidden
              className="size-5 text-signal transition-transform duration-300 group-hover:scale-110"
            />
          </span>
          <span>
            <span className="block text-2xl font-medium tracking-tight">{item.title}</span>
            <span className="mt-2 block max-w-xs text-pretty text-muted-foreground">
              {item.body}
            </span>
          </span>
        </li>
      ))}
      <li className="group relative grid gap-10 overflow-hidden bg-background p-6 transition-colors hover:bg-card sm:col-span-2 md:p-8 lg:col-span-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col justify-between gap-10">
          <span className="flex items-center justify-between font-mono text-xs tracking-widest text-muted-foreground">
            {number(includedItems.length)}
            <CheckIcon
              aria-hidden
              className="size-5 text-signal transition-transform duration-300 group-hover:scale-110 lg:hidden"
            />
          </span>
          <span>
            <span className="block text-2xl font-medium tracking-tight">
              {includedControl.title}
            </span>
            <span className="mt-2 block max-w-md text-pretty text-muted-foreground">
              {includedControl.body}
            </span>
            <span className="mt-4 block font-mono text-xs tracking-widest text-signal uppercase">
              {includedControl.note}
            </span>
            <Link
              href={controlApp.path}
              className="mt-6 inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline"
            >
              See the control app
              <ArrowRightIcon
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </span>
        </div>
        <div className="relative flex items-end justify-center gap-4 sm:gap-6 lg:justify-end">
          <CheckIcon
            aria-hidden
            className="absolute top-0 right-0 hidden size-5 text-signal transition-transform duration-300 group-hover:scale-110 lg:block"
          />
          <DeviceFrame
            screen={controlScreens.tabletVj}
            sizes="(min-width: 1024px) 360px, 60vw"
            className="w-[64%] max-w-sm lg:mt-10"
          />
          <DeviceFrame
            screen={controlScreens.phoneLoading}
            sizes="(min-width: 1024px) 130px, 22vw"
            className="w-[24%] max-w-36"
          />
        </div>
      </li>
    </ol>
  )
}
