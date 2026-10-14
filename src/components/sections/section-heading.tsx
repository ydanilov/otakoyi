import { ReactiveHeadline } from "@/components/sections/reactive-headline"
import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  /** Page heading (h1) whose letters thicken around the cursor, as on the home hero. */
  page?: boolean
  className?: string
}

const titleClass = "text-3xl font-medium tracking-tight text-balance md:text-5xl"

export function SectionHeading({
  eyebrow,
  title,
  description,
  page = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl space-y-3", className)}>
      {eyebrow && (
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {eyebrow}
        </p>
      )}
      {page ? (
        <ReactiveHeadline text={title} className={titleClass} radius={160} />
      ) : (
        <h2 className={titleClass}>{title}</h2>
      )}
      {description && <p className="text-lg text-pretty text-muted-foreground">{description}</p>}
    </div>
  )
}
