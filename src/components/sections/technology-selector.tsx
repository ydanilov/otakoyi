"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerativeWork } from "@/components/works/generative-work"
import type { Technology } from "@/content/technologies"
import { cn } from "@/lib/utils"

const num = (i: number) => String(i + 1).padStart(2, "0")

/**
 * Selector: a tab list on the left (a horizontal scroller on small screens) and one big panel on
 * the right with the selected technology's live work, what it does and where it lives.
 */
export function TechnologySelector({ items, label }: { items: Technology[]; label: string }) {
  const [active, setActive] = useState(0)
  const t = items[active]!
  return (
    <Tabs
      value={String(active)}
      onValueChange={(v) => setActive(Number(v))}
      orientation="vertical"
      className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-10"
    >
      <TabsList
        aria-label={label}
        className="-mx-4 h-auto w-auto justify-start gap-2 overflow-x-auto rounded-none bg-transparent p-0 px-4 pb-1 max-lg:group-data-[orientation=vertical]/tabs:flex-row lg:mx-0 lg:items-stretch lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {items.map((x, i) => (
          <TabsTrigger
            key={x.slug}
            value={String(i)}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className={cn(
              "h-auto flex-none shrink-0 cursor-pointer items-baseline justify-start gap-3 rounded-lg px-4 py-3 text-left text-base font-normal whitespace-normal max-lg:group-data-[orientation=vertical]/tabs:w-auto",
              "text-muted-foreground hover:text-foreground lg:border-border dark:text-muted-foreground",
              "data-[state=active]:border-signal/60 data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none",
              "dark:data-[state=active]:border-signal/60 dark:data-[state=active]:bg-muted",
            )}
          >
            <span className="font-mono text-xs text-signal">{num(i)}</span>
            {x.name}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value={String(active)}
        className="relative isolate flex min-h-[28rem] overflow-hidden rounded-xl border lg:min-h-[32rem]"
      >
        {t.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={t.image}
            src={t.image}
            alt=""
            className="absolute inset-0 -z-10 size-full animate-in object-cover duration-700 fade-in-0"
          />
        ) : (
          <GenerativeWork
            key={t.preview.work}
            work={t.preview.work}
            seed={t.preview.seed}
            density={t.preview.density}
            className="absolute inset-0 -z-10"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/70 to-transparent md:bg-gradient-to-r md:via-background/60"
        />
        <div className="mt-auto max-w-xl space-y-5 p-6 md:p-10">
          <p className="font-mono text-xs tracking-widest text-signal uppercase">
            {num(active)} / {num(items.length - 1)}
          </p>
          <h3 className="text-3xl font-medium tracking-tight text-balance md:text-5xl">{t.name}</h3>
          <p className="text-lg text-pretty text-muted-foreground">{t.line}</p>
          <div className="flex flex-wrap gap-1.5">
            {t.where.map((w) => (
              <Badge key={w} variant="outline" className="bg-background/60 backdrop-blur">
                {w}
              </Badge>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
