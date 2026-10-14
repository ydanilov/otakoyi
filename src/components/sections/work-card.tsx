import Link from "next/link"

import { CaseVisual } from "@/components/sections/case-visual"
import { Badge } from "@/components/ui/badge"
import type { Case } from "@/content/cases"
import { cn } from "@/lib/utils"

export function WorkCard({ item, className }: { item: Case; className?: string }) {
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
        <CaseVisual
          item={item}
          animate={false}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] rounded-lg transition-transform duration-500 group-hover:scale-[0.985]"
        />
        {item.status !== "Delivered" && (
          <Badge className="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur">
            {item.status}
          </Badge>
        )}
        {headline && (
          <p className="absolute bottom-3 left-3 rounded-md bg-background/80 px-3 py-2 backdrop-blur">
            <span className="text-lg font-medium">{headline.value}</span>{" "}
            <span className="text-sm text-muted-foreground">{headline.label}</span>
          </p>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.location}</p>
        </div>
        <div className="flex shrink-0 flex-nowrap justify-end gap-1">
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
