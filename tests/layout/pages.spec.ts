import { expect, test } from "@playwright/test"

import { collectLayoutIssues } from "../../src/test/layout"
import { settle } from "../helpers"
import { routes } from "../routes"

/**
 * Layout sensors for every route × viewport (desktop / tablet / mobile projects).
 * These encode the layout contract of the site, not pixels — they survive copy changes.
 */
for (const route of routes) {
  test.describe(`layout: ${route.name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route.path)
      await settle(page)
    })

    test("no overflow, overlaps or clipped text", async ({ page }) => {
      const issues = await page.evaluate(
        collectLayoutIssues,
        await page.evaluateHandle(() => document.documentElement),
      )
      expect(issues).toEqual([])
    })

    test("exactly one h1 and no skipped heading levels", async ({ page }) => {
      const levels = await page.$$eval("main h1, main h2, main h3, main h4", (hs) =>
        hs.filter((h) => (h as HTMLElement).offsetParent !== null).map((h) => Number(h.tagName[1])),
      )
      expect(levels.filter((l) => l === 1)).toHaveLength(1)
      for (let i = 1; i < levels.length; i++)
        expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
    })

    test("sticky header stays on top while scrolling", async ({ page }) => {
      const header = page.locator("header").first()
      await expect(header).toBeVisible()
      await page.mouse.wheel(0, 2000)
      await page.waitForTimeout(200)
      const box = await header.boundingBox()
      expect(box?.y ?? 99).toBeLessThanOrEqual(1)
      expect(box?.height).toBe(57) // 56px + 1px border — matches the Figma SiteHeader component
    })

    test("content respects the 1280px container on wide screens", async ({ page, viewport }) => {
      test.skip((viewport?.width ?? 0) < 1280, "desktop only")
      const widest = await page.$$eval("main h1, main h2, main p", (els) =>
        Math.max(...els.map((e) => e.getBoundingClientRect().width)),
      )
      expect(widest).toBeLessThanOrEqual(1280)
    })

    test("every generative work is labelled for assistive tech", async ({ page }) => {
      const unlabeled = await page.$$eval(
        "[role='img']",
        (els) => els.filter((e) => !(e.getAttribute("aria-label") || "").trim()).length,
      )
      expect(unlabeled).toBe(0)
    })

    test("sales contract: page offers a proposal CTA", async ({ page }) => {
      const cta = page.getByRole("main").getByRole("link", { name: /Get a proposal/ })
      await expect(cta.first()).toBeVisible()
      await expect(cta.first()).toHaveAttribute("href", /^mailto:.+\?subject=/)
    })

    test("footer is reachable at the end of the page", async ({ page }) => {
      await page.keyboard.press("End")
      await expect(page.getByRole("contentinfo")).toBeInViewport()
    })
  })
}
