import { Building2Icon, MicVocalIcon, PartyPopperIcon, PresentationIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const formatItems = [
  {
    icon: MicVocalIcon,
    title: "Conferences",
    description:
      "Stage backdrops, sponsor booths and registration zones that make your brand the one people film",
  },
  {
    icon: PartyPopperIcon,
    title: "Events & launches",
    description:
      "Touring, audio-reactive installations that rebuild in an afternoon for every venue",
  },
  {
    icon: Building2Icon,
    title: "Offices & lobbies",
    description:
      "Permanent LED walls that stay alive 24/7 — on brand, driven by your data, no content treadmill",
  },
  {
    icon: PresentationIcon,
    title: "Exhibitions & trade shows",
    description:
      "Interactive floors and walls that pull visitors to your stand and keep them there",
  },
] as const

export function Formats() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {formatItems.map(({ icon: Icon, title, description }) => (
        <li key={title}>
          <Card className="h-full bg-card/60">
            <CardHeader>
              <Icon aria-hidden className="mb-4 size-6 text-signal" />
              <CardTitle className="text-xl font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{description}</CardDescription>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}
