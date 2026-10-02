export const processSteps = [
  {
    title: "Brief",
    time: "30-min call",
    description: "Venue, audience, goals, brand assets, data you'd like to show.",
  },
  {
    title: "Concept in your brand",
    time: "≈ 1 week",
    description: "A live prototype running on your colours and content — not a moodboard.",
  },
  {
    title: "Production",
    time: "2–6 weeks",
    description: "Engine, interaction, hardware plan and on-site tests.",
  },
  {
    title: "Install & run",
    time: "Event day",
    description: "We install, calibrate and operate on site.",
  },
  {
    title: "Reuse",
    time: "Next event",
    description: "Same engine, new seed and campaign mode. No re-production.",
  },
] as const

export function Process() {
  return (
    <ol className="grid gap-6 md:grid-cols-5">
      {processSteps.map((s, i) => (
        <li key={s.title} className="border-t pt-4">
          <p className="font-mono text-xs text-muted-foreground">
            {String(i + 1).padStart(2, "0")} · {s.time}
          </p>
          <p className="mt-3 text-lg font-medium">{s.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
        </li>
      ))}
    </ol>
  )
}
