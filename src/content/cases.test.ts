import { existsSync, readdirSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { workIds } from "@/components/works/registry"
import { getCases } from "./cases"

const dir = path.join(__dirname, "cases")

describe("case content contract", () => {
  const cases = getCases()

  it("every case passes the schema", () => {
    expect(cases.length).toBeGreaterThan(0)
  })

  it("slugs are unique", () => {
    const slugs = cases.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it("every case has an MDX body", () => {
    for (const c of cases) expect(existsSync(path.join(dir, `${c.slug}.mdx`)), c.slug).toBe(true)
  })

  it("every MDX file is registered as a case (no orphans)", () => {
    const slugs = new Set(cases.map((c) => c.slug))
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".mdx")))
      expect(slugs.has(f.replace(/\.mdx$/, "")), f).toBe(true)
  })

  it("hero works exist in the registry", () => {
    for (const c of cases) expect(workIds).toContain(c.hero.work)
  })

  it("at least one featured case for the home page", () => {
    expect(cases.some((c) => c.featured)).toBe(true)
  })
})
