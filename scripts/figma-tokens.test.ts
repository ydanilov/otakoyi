import { describe, expect, it } from "vitest"

import { codeTokens, diff, readSwatches } from "./figma-tokens.mjs"

const swatch = (name: string, color: object, opacity?: number) => ({
  name,
  children: [
    {
      name: "Rectangle",
      fills: [
        {
          type: "SOLID",
          color: { a: 1, ...color },
          ...(opacity ? { opacity } : {}),
          boundVariables: { color: { id: `VariableID:${name}` } },
        },
      ],
    },
    { name: name.split("/")[1], fills: [] },
  ],
})

describe("figma ↔ tokens sync", () => {
  it("reads bound swatches from a Figma mode frame (REST nodes shape)", () => {
    const frame = {
      name: "Tokens — Dark",
      children: [
        { name: "Theme · Dark" },
        {
          name: "Swatches",
          children: [
            swatch("color/signal", { r: 0.7587, g: 0.9526, b: 0.3309 }),
            swatch("color/border", { r: 1, g: 1, b: 1 }, 0.12),
            swatch("generative/gen-2", { r: 0.2606, g: 0.6387, b: 0.9922 }),
          ],
        },
      ],
    }
    expect(readSwatches(frame)).toEqual({
      signal: { variableId: "VariableID:color/signal", value: { hex: "#c1f354" } },
      border: { variableId: "VariableID:color/border", value: { hex: "#ffffff", alpha: 0.12 } },
      "gen-2": { variableId: "VariableID:generative/gen-2", value: { hex: "#42a3fd" } },
    })
  })

  it("the committed Figma snapshot matches tokens.json", async () => {
    const { readFileSync } = await import("node:fs")
    const snapshot = JSON.parse(readFileSync("tokens/figma.json", "utf8"))
    expect(diff(codeTokens(), snapshot.tokens)).toEqual([])
  })

  it("reports missing tokens and colour / alpha drift", () => {
    const code = {
      a: { dark: { hex: "#c1f354", alpha: 1 }, light: { hex: "#4f8300", alpha: 1 } },
      b: { dark: { hex: "#ffffff", alpha: 0.12 }, light: { hex: "#000000", alpha: 0.1 } },
    }
    const figma = {
      a: { dark: { hex: "#a2d128" }, light: { hex: "#4f8300" } },
      b: { dark: { hex: "#ffffff", alpha: 0.3 }, light: { hex: "#000000", alpha: 0.1 } },
      c: { dark: { hex: "#000000" }, light: { hex: "#ffffff" } },
    }
    const problems = diff(code, figma, { deltaE2000: 1, alpha: 0.02 })
    expect(problems).toHaveLength(3)
    expect(problems.join("\n")).toMatch(/c: in Figma but missing/)
    expect(problems.join("\n")).toMatch(/a\.dark: code #c1f354 vs Figma #a2d128/)
    expect(problems.join("\n")).toMatch(/b\.dark: alpha code 0\.12 vs Figma 0\.3/)
  })
})
