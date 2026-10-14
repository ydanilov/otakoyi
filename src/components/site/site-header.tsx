"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { proposalHref, site } from "@/config/site"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import { MotionToggle } from "./motion-toggle"

export function SiteHeader() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(!isActive(item.href) && "text-muted-foreground")}
            >
              <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            </Button>
          ))}
          <Button asChild size="sm" variant="signal" className="ml-2">
            <a href={proposalHref}>{site.cta.label}</a>
          </Button>
          <MotionToggle />
        </nav>
        <div className="flex items-center md:hidden">
          <MotionToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
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
