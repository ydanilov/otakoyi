// Harness sensor: every component in ui/ (shadcn primitives), sections/, site/ and works/ must be
// covered by a story in the same folder. Storybook is the contract — no story, no component.
//
// "Covered" means more than an import: a stories file in the same folder must import the module
// AND render one of its exported components (`<Name` in JSX or `component: Name` in the meta).
// An import that is only used for types or helpers does not count.
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const DIRS = [
  "src/components/ui",
  "src/components/sections",
  "src/components/site",
  "src/components/works",
]
// Internal modules rendered only through a covered component.
const EXEMPT = new Set([
  "src/components/works/shader-canvas.tsx",
  "src/components/works/particle-wordmark-canvas.tsx",
  "src/components/works/venue-scene-canvas.tsx",
])

/** PascalCase names a module exports: `export function X`, `export const X`, `export { X, Y }`. */
export function exportedComponents(source) {
  const names = new Set()
  for (const m of source.matchAll(
    /export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class)\s+([A-Z]\w*)/g,
  ))
    names.add(m[1])
  for (const m of source.matchAll(/export\s*\{([^}]+)\}/g))
    for (const part of m[1].split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)
        .pop()
        ?.trim()
      if (name && /^[A-Z]/.test(name)) names.add(name)
    }
  return [...names]
}

/** Every identifier a module exports (for sets like `socialIcons` that hold components). */
function exportedIdentifiers(source) {
  return [...source.matchAll(/export\s+(?:const|function|let)\s+(\w+)/g)].map((m) => m[1])
}

/**
 * Stories files that import `./<module>` and render one of `names`. A module without a
 * PascalCase export (an icon set) counts when the story uses an export beyond importing it.
 */
export function coveringStories(storyFiles, mod, names, identifiers = []) {
  return storyFiles.filter(({ source }) => {
    if (!source.includes(`"${mod}"`)) return false
    if (names.length)
      return names.some((n) => new RegExp(`<${n}[\\s/>.]|component:\\s*${n}\\b`).test(source))
    return identifiers.some((n) => (source.match(new RegExp(`\\b${n}\\b`, "g")) ?? []).length > 1)
  })
}

export function findMissing(root = ".") {
  const missing = []
  for (const dir of DIRS) {
    const abs = path.join(root, dir)
    const files = readdirSync(abs)
    const storyFiles = files
      .filter((f) => f.endsWith(".stories.tsx"))
      .map((f) => ({ file: f, source: readFileSync(path.join(abs, f), "utf8") }))
    for (const f of files.filter((f) => f.endsWith(".tsx") && !f.endsWith(".stories.tsx"))) {
      const rel = path.join(dir, f)
      if (EXEMPT.has(rel)) continue
      const source = readFileSync(path.join(abs, f), "utf8")
      const names = exportedComponents(source)
      const mod = `./${f.replace(/\.tsx$/, "")}`
      if (!coveringStories(storyFiles, mod, names, exportedIdentifiers(source)).length)
        missing.push(`${rel}  (render one of: ${names.join(", ") || "no exported component"})`)
    }
  }
  return missing
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const missing = findMissing()
  if (missing.length) {
    console.error(
      "✗ Components without a story that renders them (add one next to the file):\n  " +
        missing.join("\n  "),
    )
    process.exit(1)
  }
  console.log("✓ every component has a story that renders it")
}
