import { CheckIcon, MinusIcon } from "lucide-react"

/*
 * Four options for the "How we deliver" block, shown one under another on the home page so the
 * owner can pick. The chosen one replaces the stats strip; the rest get deleted.
 */

const promises = [
  {
    value: "1 week",
    title: "To a live prototype",
    body: "From brief to a piece running in your brand, on your screens, in days not months",
  },
  {
    value: "Any size",
    title: "One installation, every venue",
    body: "It re-shapes itself to each wall, screen and proportion instead of being re-made",
  },
  {
    value: "24/7",
    title: "Runs on its own",
    body: "Permanent lobby walls play for years without new content or an operator",
  },
  {
    value: "Next event",
    title: "Grows with you",
    body: "New city, new campaign, new data: we extend the same piece instead of starting over",
  },
]

/** A — Promises: four big claims, each with a short explanation. */
export function DeliveryPromises() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {promises.map((p) => (
        <li
          key={p.title}
          className="flex min-h-64 flex-col justify-between gap-10 bg-background p-6 md:p-8"
        >
          <p className="text-4xl font-medium tracking-tighter whitespace-nowrap text-signal md:text-5xl">
            {p.value}
          </p>
          <div>
            <p className="text-lg font-medium">{p.title}</p>
            <p className="mt-2 text-pretty text-muted-foreground">{p.body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

const timeline = [
  { when: "Week 1", title: "Live prototype", body: "Your brand, running on a real screen" },
  {
    when: "Weeks 2–6",
    title: "Build and rehearse",
    body: "Content, data, hardware, on-site tests",
  },
  { when: "Opening night", title: "On site", body: "Installed, calibrated, an operator on call" },
  {
    when: "After",
    title: "It keeps growing",
    body: "New venues and campaigns from the same piece",
  },
]

/** B — Timeline: delivery as a path from week one to the life after the event. */
export function DeliveryTimeline() {
  return (
    <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
      {timeline.map((t, i) => (
        <li key={t.when} className="relative">
          <div className="flex items-center gap-3">
            <span className="size-3 shrink-0 rounded-full bg-signal" />
            {i < timeline.length - 1 && <span className="hidden h-px flex-1 bg-border md:block" />}
          </div>
          <p className="mt-6 font-mono text-xs tracking-widest text-signal uppercase">{t.when}</p>
          <p className="mt-2 text-2xl font-medium tracking-tight">{t.title}</p>
          <p className="mt-2 text-pretty text-muted-foreground">{t.body}</p>
        </li>
      ))}
    </ol>
  )
}

const compare = [
  ["Every new screen size", "New render", "Re-shapes itself"],
  ["Every new event", "New production", "Same piece, extended"],
  ["Visitors and data", "A loop that ignores them", "Shape every frame live"],
  ["Lobby walls", "The same video for months", "Never the same twice"],
] as const

/** C — Comparison: rendered video against a live installation, row by row. */
export function DeliveryCompare() {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b bg-card font-mono text-xs tracking-widest uppercase">
        <span className="p-4 text-muted-foreground md:p-6" />
        <span className="p-4 text-muted-foreground md:p-6">Rendered video</span>
        <span className="p-4 text-signal md:p-6">Live installation</span>
      </div>
      {compare.map(([row, video, live]) => (
        <div key={row} className="grid grid-cols-[1.2fr_1fr_1fr] border-b last:border-b-0">
          <span className="p-4 font-medium md:p-6 md:text-lg">{row}</span>
          <span className="flex items-start gap-2 p-4 text-muted-foreground md:p-6">
            <MinusIcon aria-hidden className="mt-1 size-4 shrink-0" />
            {video}
          </span>
          <span className="flex items-start gap-2 p-4 md:p-6">
            <CheckIcon aria-hidden className="mt-1 size-4 shrink-0 text-signal" />
            {live}
          </span>
        </div>
      ))}
    </div>
  )
}

/** D — Statement: one big line on the left, three proofs on the right. */
export function DeliveryStatement() {
  return (
    <div className="grid gap-10 rounded-xl border bg-card p-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:p-12">
      <p className="text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">
        You buy one installation. It plays every venue you take it to, and{" "}
        <span className="text-signal">keeps growing</span> after opening night
      </p>
      <ul className="space-y-6 self-end">
        {promises.slice(0, 3).map((p) => (
          <li key={p.title} className="border-t pt-4">
            <p className="font-mono text-xs tracking-widest text-signal uppercase">{p.value}</p>
            <p className="mt-1 text-lg font-medium">{p.title}</p>
            <p className="mt-1 text-pretty text-muted-foreground">{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
