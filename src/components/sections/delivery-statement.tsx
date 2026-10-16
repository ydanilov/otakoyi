/* "How we deliver": one statement on the left, three promises on the right. */

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
    body: "Lobby walls play for years and never repeat: live data shapes every frame, with no re-renders",
  },
  {
    value: "Next event",
    title: "Grows with you",
    body: "New city, new campaign, new data: we extend the same piece instead of starting over",
  },
]

export function DeliveryStatement() {
  return (
    <div className="grid gap-10 rounded-xl border bg-card p-6 md:grid-cols-[1.2fr_1fr] md:gap-16 md:p-12">
      <div>
        <p className="mb-6 font-mono text-xs tracking-widest text-muted-foreground uppercase">
          How we deliver
        </p>
        <h2 className="text-3xl leading-tight font-medium tracking-tight text-balance md:text-5xl">
          Built to run, not to render. It <span className="text-signal">keeps growing</span> long
          after opening night
        </h2>
      </div>
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
