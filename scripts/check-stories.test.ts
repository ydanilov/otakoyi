import { describe, expect, it } from "vitest"

import { coveringStories, exportedComponents, findMissing } from "./check-stories.mjs"

describe("check:stories sensor", () => {
  it("reads PascalCase exports", () => {
    expect(
      exportedComponents(
        "export function Hero() {}\nexport const Cta = () => null\nexport { Faq, helper }",
      ),
    ).toEqual(["Hero", "Cta", "Faq"])
  })

  it("does not count an import that is never rendered", () => {
    const stories = [
      { file: "a.stories.tsx", source: 'import { Cta } from "./cta"\ntype X = typeof Cta' },
    ]
    expect(coveringStories(stories, "./cta", ["Cta"])).toHaveLength(0)
  })

  it("counts JSX and meta.component", () => {
    const jsx = [
      { file: "a.stories.tsx", source: 'import { Cta } from "./cta"\nrender: () => <Cta />' },
    ]
    const meta = [{ file: "b.stories.tsx", source: 'import { Cta } from "./cta"\ncomponent: Cta,' }]
    expect(coveringStories(jsx, "./cta", ["Cta"])).toHaveLength(1)
    expect(coveringStories(meta, "./cta", ["Cta"])).toHaveLength(1)
  })

  it("passes on the repo", () => {
    expect(findMissing()).toEqual([])
  })
})
