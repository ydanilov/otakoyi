import { describe, expect, it } from "vitest"

import { tokenNames, unusedTokens } from "./check-unused-tokens.mjs"

describe("unused tokens report", () => {
  const tokens = {
    $description: "x",
    color: { signal: "oklch(0.9 0.19 125)", popover: "oklch(0.17 0 0)" },
    radius: "0.375rem",
  }

  it("flattens groups and skips scalars", () => {
    expect(tokenNames(tokens)).toEqual({ color: ["signal", "popover"] })
  })

  it("finds tokens nothing references", () => {
    expect(unusedTokens(tokens, ['<div className="bg-signal" />'])).toEqual(["color/popover"])
    expect(unusedTokens(tokens, ["color: var(--popover)", "text-signal"])).toEqual([])
  })
})
