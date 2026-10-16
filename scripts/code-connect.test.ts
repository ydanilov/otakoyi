import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

/**
 * Sensor for the Figma ↔ code component contract (Code Connect).
 * - every Figma library component is either connected (has a template) or declared inline
 * - every template points at its Figma node and imports a component that really exists
 */
const registry = JSON.parse(readFileSync("figma/components.json", "utf8")).components as {
  figma: string
  node: string
  status: "connected" | "inline"
  template?: string
  code?: string
}[]
const templates = readdirSync("figma").filter((f) => f.endsWith(".figma.ts"))

const resolveImport = (spec: string) => {
  if (!spec.startsWith("@/")) return null // package import (lucide-react)
  const base = path.join("src", spec.slice(2))
  return [".tsx", ".ts"].map((ext) => base + ext).find(existsSync) ?? base
}

describe("Code Connect", () => {
  it("every connected Figma component has a template on its node", () => {
    for (const c of registry.filter((c) => c.status === "connected")) {
      const file = `figma/${c.template}.figma.ts`
      expect(existsSync(file), `${c.figma}: missing ${file}`).toBe(true)
      expect(readFileSync(file, "utf8"), `${c.figma}: wrong node`).toContain(
        `// url=<FIGMA_DRAFT>?node-id=${c.node}\n`,
      )
    }
  })

  it("inline Figma parts point at the section that renders them", () => {
    for (const c of registry.filter((c) => c.status === "inline"))
      expect(existsSync(c.code!), `${c.figma}: ${c.code}`).toBe(true)
  })

  it("no orphan templates", () => {
    const known = new Set(registry.map((c) => `${c.template}.figma.ts`))
    expect(templates.filter((t) => !known.has(t))).toEqual([])
  })

  it.each(templates)("%s imports components that exist in code", (t) => {
    const src = readFileSync(path.join("figma", t), "utf8")
    const component = /\/\/ component=(\w+)/.exec(src)![1]
    const imports = [...src.matchAll(/'import \{ ([^}]+) \} from "([^"]+)"'/g)]
    const own = imports.find(([, names]) =>
      names
        .split(",")
        .map((n) => n.trim())
        .includes(component),
    )
    expect(own, `${t}: no import for ${component}`).toBeDefined()
    for (const [, names, spec] of imports) {
      const file = resolveImport(spec)
      if (!file) continue
      expect(existsSync(file), `${t}: ${spec} not found`).toBe(true)
      const code = readFileSync(file, "utf8")
      for (const name of names.split(",").map((n) => n.trim()))
        expect(code, `${t}: ${name} is not exported by ${spec}`).toMatch(
          new RegExp(`export (function|const) ${name}\\b|export \\{[^}]*\\b${name}\\b`),
        )
    }
  })
})
