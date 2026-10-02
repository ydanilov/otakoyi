import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { GenerativeWork } from "@/components/works/generative-work"
import type { Case } from "@/content/cases"
import { cn } from "@/lib/utils"

type WorkCardProps = {
  item: Case
  /** Heading level for the card title — keep the page outline without skipped levels. */
  headingLevel?: "h2" | "h3"
  className?: string
}

export function WorkCard({ item, headingLevel: Title = "h3", className }: WorkCardProps) {
  const headline = item.results[0]
  return (
    <Link
      href={`/works/${item.slug}`}
      className={cn(
        "group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="relative">
        <GenerativeWork
          work={item.hero.work}
          seed={item.hero.seed}
          density={item.hero.density}
          animate={false}
          className="aspect-[4/3] rounded-lg transition-transform duration-500 group-hover:scale-[0.985]"
        />
        {headline && (
          <p className="absolute bottom-3 left-3 rounded-md bg-background/80 px-3 py-2 backdrop-blur">
            <span className="text-lg font-medium">{headline.value}</span>{" "}
            <span className="text-sm text-muted-foreground">{headline.label}</span>
          </p>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <Title className="text-lg font-medium tracking-tight">{item.title}</Title>
          <p className="text-sm text-muted-foreground">{item.location}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {item.formats.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
