import { expect, test } from "@playwright/test"

import { getCases, isPlaceholderCase } from "../../src/content/cases"
import { solutions } from "../../src/content/solutions"

test("robots, sitemap and llms.txt are served", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Sitemap:")
  expect(robots).toContain("GPTBot")

  const sitemap = await (await request.get("/sitemap.xml")).text()
  for (const s of solutions) expect(sitemap).toContain(`/solutions/${s.slug}<`)
  for (const c of getCases()) {
    if (isPlaceholderCase(c)) expect(sitemap).not.toContain(`/works/${c.slug}<`)
    else expect(sitemap).toContain(`/works/${c.slug}<`)
  }

  const llms = await request.get("/llms.txt")
  expect(llms.ok()).toBe(true)
  expect(await llms.text()).toMatch(/^# Otakoyi/)
  expect((await request.get("/llms-full.txt")).ok()).toBe(true)
})

test("every top-level page has canonical, OG image and valid JSON-LD", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/works", "/solutions", "/studio", `/solutions/${solutions[0]!.slug}`]) {
    await page.goto(path)
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href")
    expect(new URL(canonical!).pathname).toBe(path)

    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content")
    const img = await request.get(new URL(og!).pathname)
    expect(img.headers()["content-type"]).toContain("image/png")

    for (const json of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(() => JSON.parse(json)).not.toThrow()
    }
  }
})

test("placeholder cases are noindex", async ({ page }) => {
  const placeholder = getCases().find(isPlaceholderCase)
  test.skip(!placeholder, "no placeholder cases left")
  await page.goto(`/works/${placeholder!.slug}`)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
})
