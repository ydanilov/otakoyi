"use client"

import { MoonIcon, SunIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Dark-first theme switch. Persists to localStorage; see `themeScript` for no-flash init. */
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

/** Inline script run before paint: default dark, honour a stored "light". */
export const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}`
