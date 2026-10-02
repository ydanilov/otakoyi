/**
 * Layout sensors shared by Storybook (preview afterEach) and Playwright (page.evaluate).
 * `collectLayoutIssues` is fully self-contained (no outer references) so Playwright can
 * serialise it into the page.
 */

export type LayoutIssue = { kind: "overflow" | "overlap" | "clipped-text"; detail: string }

export function collectLayoutIssues(root: Element, tolerance = 1): LayoutIssue[] {
  const INTERACTIVE =
    "a[href], button, input, select, textarea, [role='button'], [role='radio'], [role='tab'], [role='link']"
  const visible = (el: Element) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return (
      r.width > 0 &&
      r.height > 0 &&
      s.visibility !== "hidden" &&
      s.display !== "none" &&
      Number(s.opacity) > 0
    )
  }
  const describe = (el: Element) =>
    `<${el.tagName.toLowerCase()}> "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40)}"`
  const ignored = (el: Element) => !!el.closest("[data-layout-ignore]")
  const issues: LayoutIssue[] = []

  // 1. Horizontal overflow of the root.
  const rootRight =
    root === document.documentElement ? window.innerWidth : root.getBoundingClientRect().right
  const rootScroll =
    root === document.documentElement ? document.documentElement.scrollWidth : root.scrollWidth
  const rootClient = root === document.documentElement ? window.innerWidth : root.clientWidth
  if (rootScroll > rootClient + tolerance) {
    const offenders = [...root.querySelectorAll("*")]
      .filter(
        (el) =>
          visible(el) && !ignored(el) && el.getBoundingClientRect().right > rootRight + tolerance,
      )
      .slice(0, 3)
      .map(describe)
    issues.push({
      kind: "overflow",
      detail: `content wider than container: ${offenders.join(", ") || "unknown"}`,
    })
  }

  // 2. Overlapping interactive elements that are not nested in each other.
  const items = [...root.querySelectorAll(INTERACTIVE)].filter((el) => visible(el) && !ignored(el))
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i]!
      const b = items[j]!
      if (a.contains(b) || b.contains(a)) continue
      const ra = a.getBoundingClientRect()
      const rb = b.getBoundingClientRect()
      const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left)
      const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
      if (w > 2 && h > 2)
        issues.push({ kind: "overlap", detail: `${describe(a)} overlaps ${describe(b)}` })
    }
  }

  // 3. Text clipped by its own box (unless intentionally truncated with ellipsis).
  for (const el of root.querySelectorAll("h1, h2, h3, p, a, button, dt, dd, li")) {
    if (!visible(el) || ignored(el)) continue
    const s = getComputedStyle(el)
    if (s.textOverflow === "ellipsis") continue
    // Visually-hidden (sr-only) content is clipped on purpose.
    const r = el.getBoundingClientRect()
    if (
      r.width <= 1 ||
      r.height <= 1 ||
      (s.clip && s.clip !== "auto") ||
      s.clipPath.startsWith("inset(50%")
    )
      continue
    const clipsX = s.overflowX === "hidden" || s.overflowX === "clip"
    const clipsY = s.overflowY === "hidden" || s.overflowY === "clip"
    if (
      (clipsX && el.scrollWidth > el.clientWidth + tolerance) ||
      (clipsY && el.scrollHeight > el.clientHeight + tolerance)
    )
      issues.push({ kind: "clipped-text", detail: `${describe(el)} is clipped` })
  }
  return issues
}

export function assertLayout(root: Element) {
  const issues = collectLayoutIssues(root)
  if (issues.length)
    throw new Error("Layout issues:\n" + issues.map((i) => `  [${i.kind}] ${i.detail}`).join("\n"))
}
