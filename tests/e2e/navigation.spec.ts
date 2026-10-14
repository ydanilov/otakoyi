import { expect, test } from "@playwright/test"

import { getCases } from "../../src/content/cases"

test("home → works → case → next case", async ({ page, isMobile }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Installations people stop for")

  await page.getByRole("link", { name: "See installations" }).click()
  await expect(page).toHaveURL(/\/works$/)

  const first = getCases()[0]!
  await page
    .getByRole("link", { name: new RegExp(first.title) })
    .first()
    .click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(first.title)

  await page.getByRole("navigation", { name: "Next installation" }).getByRole("link").click()
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(first.title)

  if (!isMobile) {
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Studio" })
      .click()
    await expect(page).toHaveURL(/\/studio$/)
  }
})

test("works filter narrows the grid", async ({ page }) => {
  await page.goto("/works")
  const items = page.getByRole("main").getByRole("listitem")
  await expect(items).toHaveCount(getCases().length)
  await page.getByRole("radio", { name: "Office" }).click()
  await expect(items).toHaveCount(getCases().filter((c) => c.formats.includes("Office")).length)
})

test("mobile menu opens", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only")
  await page.goto("/")
  await page.getByRole("button", { name: "Open menu" }).click()
  await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible()
})

test("theme toggle persists light mode", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveClass(/dark/)
  // Tests run with motion off (ADR-006); the toggle reads "Play motion" only once React has hydrated.
  await expect(page.getByRole("button", { name: "Play motion" }).first()).toBeVisible()
  await page.getByRole("button", { name: "Toggle theme" }).first().click()
  await page.reload()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
})

test("proposal CTA opens a pre-filled email", async ({ page }) => {
  await page.goto("/")
  const cta = page
    .getByRole("main")
    .getByRole("link", { name: /Get a proposal/ })
    .first()
  await expect(cta).toHaveAttribute("href", /^mailto:.+\?subject=/)
})

test("unknown case returns 404", async ({ page }) => {
  const res = await page.goto("/works/does-not-exist")
  expect(res?.status()).toBe(404)
})
