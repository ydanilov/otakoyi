import { describe, expect, it } from "vitest"

import { cn } from "./utils"

describe("cn knows the token scales", () => {
  it("keeps a text colour next to a token font size", () => {
    expect(cn("text-foreground", "text-logo")).toBe("text-foreground text-logo")
    expect(cn("text-sm", "text-display-fluid")).toBe("text-display-fluid")
  })

  it("merges token line-heights, tracking and durations", () => {
    expect(cn("leading-none", "leading-display")).toBe("leading-display")
    expect(cn("tracking-wide", "tracking-eyebrow")).toBe("tracking-eyebrow")
    expect(cn("duration-slow", "duration-slow")).toBe("duration-slow")
  })

  it("lets a glass surface replace a component background", () => {
    expect(cn("bg-primary backdrop-blur", "glass-chip")).toBe("glass-chip")
  })
})
