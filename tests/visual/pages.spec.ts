import { expect, test } from "@playwright/test"

import { settle } from "../helpers"
import { routes } from "../routes"

for (const route of routes) {
  for (const theme of ["dark", "light"] as const) {
    test(`visual: ${route.name} (${theme})`, async ({ page }) => {
      if (theme === "light") await page.addInitScript(() => localStorage.setItem("theme", "light"))
      await page.goto(route.path)
      await settle(page)
      await expect(page).toHaveScreenshot(`${route.name}-${theme}.png`, { fullPage: true })
    })
  }
}
