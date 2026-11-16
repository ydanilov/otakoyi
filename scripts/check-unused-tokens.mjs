// Weekly sweep: tokens in tokens/tokens.json that nothing in src/ uses. Report only (exit 0),
// so a token is never deleted without the owner's approval.
//
// A token counts as used when src/ references it as a Tailwind class part (`bg-signal`,
// `text-muted-foreground`, `duration-base`), a CSS variable (`var(--signal)`) or a key
// (`gen-1` in the generated palette). Generated files and the theme mapping don't count.
import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

const SKIP = new Set(["src/app/tokens.css", "src/lib/tokens.generated.ts", "src/app/globals.css"])

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f)
    if (statSync(p).isDirectory()) return files(p)
    return /\.(tsx?|mdx?|css)$/.test(f) && !SKIP.has(p) ? [p] : []
  })
}

/** Flat token names from tokens.json, grouped: { color: [...], motion: [...] }. */
export function tokenNames(tokens) {
  const out = {}
  for (const [group, value] of Object.entries(tokens)) {
    if (group.startsWith("$") || typeof value !== "object") continue
    out[group] = Object.keys(value).flatMap((k) =>
      value[k] && typeof value[k] === "object" && !("$value" in value[k])
        ? Object.keys(value[k]).map((s) => `${k}-${s}`)
        : [k],
    )
  }
  return out
}

export function unusedTokens(tokens, sources) {
  const all = sources.join("\n")
  const unused = []
  for (const [group, names] of Object.entries(tokenNames(tokens)))
    for (const name of names) {
      const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      if (!new RegExp(`(-|--|["'\`])${esc}(?![\\w-])`).test(all)) unused.push(`${group}/${name}`)
    }
  return unused
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const tokens = JSON.parse(readFileSync("tokens/tokens.json", "utf8"))
  const unused = unusedTokens(
    tokens,
    files("src").map((f) => readFileSync(f, "utf8")),
  )
  if (unused.length) console.log("Unused tokens:\n" + unused.map((u) => `- ${u}`).join("\n"))
  else console.log("✓ every token is used")
}
