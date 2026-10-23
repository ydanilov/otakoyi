"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { proposalHref, site } from "@/config/site"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

/** Past this many pixels of scroll the header docks to the top as a floating glass bar. */
const DOCK_AT = 24

/**
 * At the top of a page the header has no surface of its own: its content sits on the hero's
 * background, a little lower than the edge. Once the page scrolls it rises to the top and becomes a
 * floating capsule of frosted glass (Liquid Glass-like: translucent fill, blur, a hairline rim and a
 * soft top highlight) that stays pinned. Page heroes extend under it with `hero-under-header`.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const [docked, setDocked] = useState(false)

  useEffect(() => {
    const update = () => setDocked(window.scrollY > DOCK_AT)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <header
      data-docked={docked || undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-40 px-2 [view-transition-name:site-header] md:px-4 motion-on:transition-[padding] motion-on:duration-500 motion-on:ease-out",
        docked ? "pt-2 md:pt-3" : "pt-5",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex h-14 items-center justify-between rounded-full motion-on:transition-all motion-on:duration-500 motion-on:ease-out",
          docked
            ? "max-w-5xl bg-background/70 px-3 shadow-2xl ring-1 shadow-background/60 ring-foreground/10 backdrop-blur-2xl backdrop-saturate-150 md:pr-2 md:pl-5"
            : "max-w-7xl px-2 ring-1 ring-transparent md:px-4",
        )}
      >
        {/* Top highlight of the glass rim; invisible until the bar docks. */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-foreground/[0.07] via-transparent to-transparent motion-on:transition-opacity motion-on:duration-500",
            docked ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="relative">
          <Logo />
        </div>
        <nav aria-label="Main" className="relative hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn("rounded-full", !isActive(item.href) && "text-muted-foreground")}
            >
              <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            </Button>
          ))}
          <Button asChild size="sm" variant="signal" className="ml-2 rounded-full">
            <a href={proposalHref}>{site.cta.label}</a>
          </Button>
        </nav>
        <div className="relative flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-full">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{site.name}</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-2 px-4">
                {site.nav.map((item) => (
                  <Link key={item.href} href={item.href} className="py-2 text-2xl">
                    {item.label}
                  </Link>
                ))}
                <a href={proposalHref} className="py-2 text-2xl text-signal">
                  {site.cta.label}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
