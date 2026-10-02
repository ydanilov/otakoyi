export const benefitItems = [
  {
    title: "Stop the crowd",
    description:
      "Motion beats static. A living installation pulls people to your stand and keeps them there longer.",
  },
  {
    title: "Be remembered",
    description:
      "Visitors don't remember the fifth looped video of the day. They remember the wall that reacted to them.",
  },
  {
    title: "Earn organic reach",
    description:
      "Every visitor becomes a camera. Installations are made to be filmed and shared — in your colours.",
  },
  {
    title: "Show your data, live",
    description:
      "Sales, markets, social mentions, sensor or visitor data — turned into visuals that explain your story.",
  },
  {
    title: "Reuse, don't re-render",
    description:
      "One generative engine runs at every event, in every format. No new video production each time.",
  },
  {
    title: "Turnkey",
    description:
      "Concept, content engine, hardware, installation and on-site operator. You bring the venue.",
  },
] as const

export function Benefits() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {benefitItems.map((b, i) => (
        <li key={b.title} className="bg-background p-6 md:p-8">
          <p className="mb-6 font-mono text-xs text-muted-foreground">0{i + 1}</p>
          <h3 className="text-xl font-medium tracking-tight">{b.title}</h3>
          <p className="mt-2 text-muted-foreground">{b.description}</p>
        </li>
      ))}
    </ul>
  )
}
