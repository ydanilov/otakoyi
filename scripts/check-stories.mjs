// Harness sensor: every component in sections/, site/ and works/ must be covered by a story
// in the same folder. Storybook is the contract — no story, no component.
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const DIRS = ["src/components/sections", "src/components/site", "src/components/works"]
// Internal modules rendered only through a covered component.
const EXEMPT = new Set([
  "src/components/works/shader-canvas.tsx",
  "src/components/works/particle-wordmark-canvas.tsx",
  "src/components/works/venue-scene-canvas.tsx",
])

let missing = []
for (const dir of DIRS) {
  const files = readdirSync(dir)
  const stories = files
    .filter((f) => f.endsWith(".stories.tsx"))
    .map((f) => readFileSync(path.join(dir, f), "utf8"))
    .join("\n")
  for (const f of files.filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))) {
    const rel = path.join(dir, f)
    if (EXEMPT.has(rel)) continue
    const mod = `./${f.replace(/\.tsx$/, "")}`
    if (!stories.includes(`"${mod}"`)) missing.push(rel)
  }
}
if (missing.length) {
  console.error(
    "✗ Components without a story (add one next to the file):\n  " + missing.join("\n  "),
  )
  process.exit(1)
}
console.log("✓ every component has a story")
