import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  /** Heading level. Use "h1" when the heading is the page title. */
  as?: "h1" | "h2"
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      {eyebrow && (
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
      )}
      <Heading className="text-3xl font-medium tracking-tight text-balance md:text-5xl">
        {title}
      </Heading>
      {description && <p className="text-lg text-pretty text-muted-foreground">{description}</p>}
    </div>
  )
}
