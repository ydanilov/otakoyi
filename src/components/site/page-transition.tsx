"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

/**
 * Route change transition: the old page fades out to the background and the new one fades in
 * (`.page-out` / `.page-in` in `globals.css`), which hides the scroll reset to the top.
 *
 * Built on React's `<ViewTransition>` (shipped with the App Router's React canary) and the browser
 * View Transitions API. Pure progressive enhancement: without `document.startViewTransition`
 * React skips the animation and navigation is instant; where React has no `ViewTransition`
 * (stable React in Storybook/Vitest) this renders its children as-is.
 *
 * Keyed by pathname so only real page changes animate — `?query` / `#hash` updates and Suspense
 * reveals inside the page do not (`default="none"`). Site motion off (`data-motion="off"`) turns the
 * animation off in CSS.
 */
const ViewTransition = (React as { ViewTransition?: typeof React.ViewTransition }).ViewTransition

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  useInstantHistoryScroll(pathname)
  if (!ViewTransition) return <>{children}</>
  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  )
}

/**
 * Back/forward: the browser restores the old scroll position, but `scroll-smooth` on <html> turns
 * that into a long visible scroll. Restoration is made instant for history navigations only;
 * in-page anchor links keep smooth scrolling.
 */
function useInstantHistoryScroll(pathname: string) {
  const pending = React.useRef(false)
  React.useEffect(() => {
    const onPop = () => {
      pending.current = true
      document.documentElement.style.scrollBehavior = "auto"
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])
  React.useEffect(() => {
    if (!pending.current) return
    pending.current = false
    const id = window.setTimeout(() => {
      document.documentElement.style.scrollBehavior = ""
    }, 1000)
    return () => window.clearTimeout(id)
  }, [pathname])
}
