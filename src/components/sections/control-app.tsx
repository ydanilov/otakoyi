import Link from "next/link"
import {
  ArrowRightIcon,
  CheckIcon,
  QrCodeIcon,
  ScanLineIcon,
  SlidersHorizontalIcon,
} from "lucide-react"

import { DeviceFrame } from "@/components/sections/device-frame"
import { SectionHeading } from "@/components/sections/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { proposalHref } from "@/config/site"
import {
  controlApp,
  controlFeatures,
  controlScreens,
  controlSteps,
  controlUseCases,
  type ControlScreen,
} from "@/content/control"
import { cn } from "@/lib/utils"

type ControlDevicesProps = {
  tablet?: ControlScreen
  phone?: ControlScreen
  priority?: boolean
  className?: string
}

/**
 * Tablet and phone together: the VJ console behind, the phone controller in front. The phone
 * overlaps the tablet's lower-left corner; a soft signal glow sits behind both.
 */
export function ControlDevices({
  tablet = controlScreens.tabletVj,
  phone = controlScreens.phonePult,
  priority,
  className,
}: ControlDevicesProps) {
  return (
    <div className={cn("relative isolate pb-[8%]", className)}>
      <div
        aria-hidden
        className="absolute inset-x-[10%] top-[15%] bottom-[10%] -z-10 rounded-full bg-signal/10 blur-3xl"
      />
      <DeviceFrame
        screen={tablet}
        sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 88vw"
        priority={priority}
        className="ml-auto w-[88%]"
      />
      <DeviceFrame
        screen={phone}
        sizes="(min-width: 1280px) 220px, (min-width: 768px) 17vw, 30vw"
        priority={priority}
        className="absolute bottom-0 left-0 w-[30%]"
      />
    </div>
  )
}

const stepIcons = [QrCodeIcon, ScanLineIcon, SlidersHorizontalIcon]

/** Show the QR → scan it → run the show. Three columns from `md`, a vertical list below. */
export function PairingSteps({ className }: { className?: string }) {
  return (
    <ol
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3",
        className,
      )}
    >
      {controlSteps.map((step, i) => {
        const Icon = stepIcons[i]!
        return (
          <li key={step.title} className="flex flex-col gap-8 bg-background p-6 md:p-8">
            <span className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-widest text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Icon aria-hidden className="size-6 text-muted-foreground" />
            </span>
            <span>
              <span className="block text-xl font-medium tracking-tight">{step.title}</span>
              <span className="mt-2 block text-pretty text-muted-foreground">{step.body}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * The control app on /solutions: what it is (both ends — lobby controller and VJ console), the
 * devices, the three pairing steps and a route to /control.
 */
export function ControlAppFeature({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-2xl border bg-card/40", className)}
    >
      <div
        aria-hidden
        className="absolute -top-1/3 right-0 -z-10 h-2/3 w-2/3 rounded-full bg-signal/5 blur-3xl"
      />
      <div className="grid items-center gap-12 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:p-14">
        <div>
          <SectionHeading
            eyebrow={`${controlApp.name} · included`}
            title="Every installation comes with its own controller"
            description={`${controlApp.lead}. ${controlApp.promise}`}
          />
          <p className="mt-10 flex items-start gap-3 text-pretty">
            <CheckIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-signal" />
            {controlApp.included}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="signal">
              <Link href={controlApp.path}>
                Explore the control app
                <ArrowRightIcon aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={proposalHref}>Request a demo</a>
            </Button>
          </div>
        </div>
        <ControlDevices />
      </div>
      <div className="border-t p-6 md:p-10 lg:px-14">
        <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Pairing in three steps
        </p>
        <PairingSteps />
      </div>
    </div>
  )
}

/** Lobby controller on a phone and VJ console on a tablet — the two ends of the range. */
export function ControlUseCases({ className }: { className?: string }) {
  const [lobby, show] = controlUseCases
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]", className)}>
      {[lobby, show].map((u) => (
        <article
          key={u.title}
          className="flex flex-col justify-between gap-10 overflow-hidden rounded-2xl border bg-card/40 p-6 md:p-10"
        >
          <div>
            <p className="font-mono text-xs tracking-widest text-signal uppercase">{u.eyebrow}</p>
            <h3 className="mt-4 text-2xl font-medium tracking-tight md:text-4xl">{u.title}</h3>
            <p className="mt-3 max-w-xl text-lg text-pretty text-muted-foreground">{u.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {u.points.map((p) => (
                <li key={p}>
                  <Badge variant="outline" className="px-3 py-1 text-sm font-normal">
                    {p}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          {u.screen.device === "phone" ? (
            <div className="flex justify-center gap-4 md:gap-6">
              <DeviceFrame
                screen={u.screen}
                sizes="(min-width: 1024px) 200px, 40vw"
                className="w-[44%] max-w-56"
              />
              <DeviceFrame
                screen={controlScreens.phonePrompts}
                sizes="(min-width: 1024px) 200px, 40vw"
                className="mt-10 w-[44%] max-w-56"
              />
            </div>
          ) : (
            <DeviceFrame screen={u.screen} sizes="(min-width: 1024px) 680px, 90vw" />
          )}
        </article>
      ))}
    </div>
  )
}

/** Everything the app does, as a 4 × 2 grid of numbered cards (the site's grid style). */
export function ControlFeatures({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {controlFeatures.map((f, i) => (
        <li key={f.title} className="bg-background p-6 md:p-8">
          <p className="mb-6 font-mono text-xs text-muted-foreground">0{i + 1}</p>
          <h3 className="text-xl font-medium tracking-tight">{f.title}</h3>
          <p className="mt-2 text-pretty text-muted-foreground">{f.body}</p>
        </li>
      ))}
    </ul>
  )
}
