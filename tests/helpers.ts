import { expect, type Page } from "@playwright/test"

/**
 * Scrolls through the page so every lazy GenerativeWork mounts, then waits until each
 * visible one reports `data-state="ready"` (first frame drawn) or "fallback" (no WebGL).
 *
 * Only visible works count: with site motion off (ADR-006) the animated variant of a
 * section is `motion-off:hidden`, so its works never enter the viewport and never draw.
 * The timeout covers SwiftShader in CI, where a home page with several shaders is slow.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight / 2) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 100))
    }
    // A fast sweep on a busy CPU can scroll past a work between two frames, so the
    // IntersectionObserver never reports it. Visit every work still loading, one by one.
    const pending = () =>
      [...document.querySelectorAll<HTMLElement>('[data-work][data-state="loading"]')].filter(
        (el) => el.checkVisibility(),
      )
    for (const el of pending()) {
      el.scrollIntoView({ block: "center" })
      for (let t = 0; t < 100 && el.dataset.state === "loading"; t++)
        await new Promise((r) => setTimeout(r, 100))
    }
    window.scrollTo(0, 0)
  })
  await expect(
    page.locator('[data-work][data-state="loading"]').filter({ visible: true }),
  ).toHaveCount(0, { timeout: 45_000 })
  await page.waitForTimeout(300)
}

/**
 * Swaps every visible canvas for a still image of the frame it has already drawn.
 *
 * A full-page capture briefly resizes the layout viewport; WebGL canvases re-render during the
 * capture and the screenshot can catch either frame. The drawn frame itself is deterministic
 * (same seed, motion off), so freezing it keeps the check honest and removes the race.
 * Canvases keep their buffer (`preserveDrawingBuffer`), so `toDataURL` returns the real frame.
 */
export async function freezeCanvases(page: Page) {
  await page.evaluate(async () => {
    const canvases = [...document.querySelectorAll("canvas")].filter((c) => c.checkVisibility())
    await Promise.all(
      canvases.map((canvas) => {
        const img = new Image()
        img.src = canvas.toDataURL("image/png")
        img.alt = ""
        const { width, height } = canvas.getBoundingClientRect()
        img.style.cssText = `display:block;width:${width}px;height:${height}px`
        canvas.replaceWith(img)
        return img.decode()
      }),
    )
  })
}
