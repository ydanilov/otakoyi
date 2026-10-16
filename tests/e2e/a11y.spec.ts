import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import { routes } from "../routes"

for (const route of routes) {
  test(`a11y: ${route.name}`, async ({ page }) => {
    await page.goto(route.path)
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([])
  })
}
