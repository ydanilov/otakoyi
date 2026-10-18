import { readdirSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * Sensor for the docs an agent or reviewer reads first.
 * - an ADR that supersedes another must be reflected in that ADR's status and in the ADR index
 * - the ADR index lists every ADR file
 * - README and docs/metrics.md quote the Code Connect registry's real figures
 */
const DECISIONS = "docs/decisions"
const read = (file: string) => readFileSync(file, "utf8")

const adrFiles = readdirSync(DECISIONS).filter((f) => /^\d{3}-.+\.md$/.test(f))
const adrs = adrFiles.map((file) => {
  const text = read(`${DECISIONS}/${file}`)
  const status = text.match(/^\*\*Status:\*\*(.*)$/m)?.[1] ?? ""
  return { file, id: file.slice(0, 3), status }
})
const index = read(`${DECISIONS}/README.md`)
const indexRow = (id: string) =>
  index.split("\n").find((line) => line.startsWith(`| [${id}]`)) ?? ""

describe("ADRs", () => {
  it("every ADR file has a status line", () => {
    for (const adr of adrs) expect(adr.status, `${adr.file}: missing **Status:** line`).not.toBe("")
  })

  it("the ADR index lists every ADR file", () => {
    for (const adr of adrs)
      expect(
        indexRow(adr.id),
        `docs/decisions/README.md has no row for ${adr.file} — add one`,
      ).toContain(`(${adr.file})`)
  })

  it("a superseded ADR says so in its status and in the index", () => {
    for (const adr of adrs) {
      const clause = adr.status.match(/supersedes([^·]*)/i)?.[1] ?? ""
      for (const target of clause.match(/\b\d{3}\b/g) ?? []) {
        const old = adrs.find((a) => a.id === target)
        expect(old, `${adr.file} supersedes ADR-${target}, which does not exist`).toBeDefined()
        expect(
          old!.status,
          `${old!.file}: ADR-${adr.id} supersedes it — add "superseded by ADR-${adr.id}" to its status line`,
        ).toMatch(new RegExp(`superseded by (ADR-)?${adr.id}`, "i"))
        expect(
          indexRow(target),
          `docs/decisions/README.md: mark ${old!.file} as superseded by ${adr.id}`,
        ).toMatch(new RegExp(`superseded by ${adr.id}`, "i"))
      }
    }
  })
})

describe("Code Connect figures in docs", () => {
  const registry = JSON.parse(read("figma/components.json")).components as { status: string }[]
  const total = registry.length
  const connected = registry.filter((c) => c.status === "connected").length
  const inline = registry.filter((c) => c.status === "inline").length
  const fix = `figma/components.json has ${total} components (${connected} connected, ${inline} inline)`

  it("README quotes the registry", () => {
    const readme = read("README.md")
    expect(readme, `README: ${fix}`).toContain(`All ${total} components in the Figma library`)
    expect(readme, `README: ${fix}`).toContain(`${connected} are\nconnected`)
    expect(readme, `README: ${fix}`).toContain(`${inline} are\nFigma-only`)
    expect(readme, `README results table: ${fix}`).toContain(`${total} / ${total} components`)
  })

  it("docs/metrics.md quotes the registry", () => {
    expect(read("docs/metrics.md"), `docs/metrics.md: ${fix}`).toContain(
      `${connected} connected + ${inline} inline = ${total} / ${total}`,
    )
  })
})
