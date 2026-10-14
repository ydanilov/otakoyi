"use client"

import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Dark-first theme switch. Persists to localStorage; see `themeScript` in `@/lib/init-scripts` for no-flash init. */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement
    const dark = root.classList.toggle("dark")
    try {
      localStorage.setItem("theme", dark ? "dark" : "light")
    } catch {}
  }
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="block dark:hidden" />
    </Button>
  )
}
