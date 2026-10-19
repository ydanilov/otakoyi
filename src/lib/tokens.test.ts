import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const tokens = JSON.parse(readFileSync("tokens/tokens.json", "utf8"))

describe("design tokens", () => {
  const all = { ...tokens.color, ...tokens.generative } as Record<string, unknown>

  it("every token is a single value (dark only, ADR-011)", () => {
    for (const [name, v] of Object.entries(all))
      expect(typeof v === "string" && v.length > 0, `${name} must be one color string`).toBe(true)
  })

  it("every shadcn foreground has a matching surface", () => {
    for (const name of Object.keys(all).filter((n) => n.endsWith("-foreground")))
      expect(all[name.replace(/-foreground$/, "")], name).toBeDefined()
  })

  it("globals.css maps every token into the Tailwind theme", () => {
    const css = readFileSync("src/app/globals.css", "utf8")
    for (const name of Object.keys(all))
      expect(css, name).toContain(`--color-${name}: var(--${name})`)
  })
})
