import { expect, type Page } from "@playwright/test"

/**
 * Scrolls through the page so every lazy GenerativeWork mounts, then waits until each
 * one reports `data-state="ready"` (first frame drawn) or "fallback" (no WebGL).
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 100))
    }
    window.scrollTo(0, 0)
  })
  await expect(page.locator('[data-work][data-state="loading"]')).toHaveCount(0, {
    timeout: 15_000,
  })
  await page.waitForTimeout(300)
}
