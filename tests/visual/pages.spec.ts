import { expect, test } from "@playwright/test"

import { freezeCanvases, settle } from "../helpers"
import { routes } from "../routes"

// settle (≤ 45 s) + a stable full-page capture (≤ 30 s) don't fit the 30 s default.
test.describe.configure({ timeout: 120_000 })

for (const route of routes) {
  for (const theme of ["dark", "light"] as const) {
    test(`visual: ${route.name} (${theme})`, async ({ page }) => {
      if (theme === "light") await page.addInitScript(() => localStorage.setItem("theme", "light"))
      await page.goto(route.path)
      await settle(page)
      await freezeCanvases(page)
      // A full-page capture of a tall page with live WebGL takes seconds under SwiftShader;
      // Playwright needs two identical captures in a row, so 5 s (the default) is too short.
      await expect(page).toHaveScreenshot(`${route.name}-${theme}.png`, {
        fullPage: true,
        timeout: 30_000,
      })
    })
  }
}
