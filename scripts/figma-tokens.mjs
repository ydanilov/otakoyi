// Figma Variables ↔ tokens/tokens.json — the two halves of one token contract.
//
//   pnpm tokens:figma:pull    Read the Theme swatches from Figma (REST, needs FIGMA_ACCESS_TOKEN)
//                             and rewrite the snapshot tokens/figma.json.
//   pnpm tokens:figma:check   Offline sensor (runs in `pnpm verify` and CI): fail when the snapshot
//                             and tokens.json disagree — a token missing on one side, or a colour /
//                             alpha that drifted beyond tolerance (CIEDE2000 ΔE, alpha delta).
//   pnpm tokens:figma:plan    Write tokens/figma-push.json: the variable updates that would bring
//                             Figma in line with code (applied through the Figma plugin bridge).
//
// Why swatches and not /variables/local: the Variables REST API is Enterprise-only. Every Theme
// variable is bound to a swatch on the Figma "Tokens" page, and the nodes endpoint returns the
// bound, resolved value per mode frame on any plan.
import { readFileSync, writeFileSync } from "node:fs"
import { differenceCiede2000, formatHex, parse } from "culori"

const CONFIG = JSON.parse(readFileSync("tokens/figma.config.json", "utf8"))
const SNAPSHOT = "tokens/figma.json"
const PLAN = "tokens/figma-push.json"
const MODES = ["dark", "light"]
const dE = differenceCiede2000()

/** tokens.json → { name: { dark: {hex, alpha}, light: {hex, alpha} } } */
export function codeTokens() {
  const t = JSON.parse(readFileSync("tokens/tokens.json", "utf8"))
  const all = { ...t.color, ...t.generative }
  return Object.fromEntries(
    Object.entries(all).map(([name, modes]) => [
      name,
      Object.fromEntries(
        MODES.map((m) => {
          const c = parse(modes[m])
          return [m, { hex: formatHex(c), alpha: round(c.alpha ?? 1) }]
        }),
      ),
    ]),
  )
}

const round = (n) => Math.round(n * 1000) / 1000
const hex = ({ r, g, b }) =>
  "#" +
  [r, g, b]
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")

/** Walk a mode frame: swatch frames named `<group>/<token>`, first filled child = the variable. */
export function readSwatches(frame) {
  const out = {}
  const visit = (node) => {
    const m = /^(?:color|generative)\/(.+)$/.exec(node.name ?? "")
    if (m && node.children) {
      const chip = node.children.find((c) => c.fills?.some((f) => f.type === "SOLID"))
      const fill = chip?.fills.find((f) => f.type === "SOLID")
      if (fill) {
        const alpha = round((fill.color.a ?? 1) * (fill.opacity ?? 1))
        out[m[1]] = {
          variableId: fill.boundVariables?.color?.id ?? null,
          value: { hex: hex(fill.color), ...(alpha < 1 ? { alpha } : {}) },
        }
        return
      }
    }
    node.children?.forEach(visit)
  }
  visit(frame)
  return out
}

async function pull() {
  const token = process.env.FIGMA_ACCESS_TOKEN
  if (!token) {
    console.error(
      "✗ FIGMA_ACCESS_TOKEN is not set (Figma → Settings → Personal access tokens, file_content:read)",
    )
    process.exit(1)
  }
  const ids = MODES.map((m) => CONFIG.modeFrames[m]).join(",")
  const res = await fetch(`https://api.figma.com/v1/files/${CONFIG.fileKey}/nodes?ids=${ids}`, {
    headers: { "X-Figma-Token": token },
  })
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`)
  const data = await res.json()
  const tokens = {}
  for (const m of MODES) {
    const frame = data.nodes[CONFIG.modeFrames[m]]?.document
    if (!frame) throw new Error(`Mode frame ${CONFIG.modeFrames[m]} (${m}) not found in Figma`)
    for (const [name, { variableId, value }] of Object.entries(readSwatches(frame))) {
      tokens[name] ??= { variableId }
      tokens[name][m] = value
    }
  }
  const snapshot = {
    $description:
      "Snapshot of the Figma side of the token contract, written by `pnpm tokens:figma:pull`. Do not edit by hand. `pnpm tokens:figma:check` compares it with tokens/tokens.json.",
    $source: {
      fileKey: CONFIG.fileKey,
      figmaVersion: data.version,
      lastModified: data.lastModified,
      pulledAt: new Date().toISOString().slice(0, 10),
      via: "Figma REST /files/:key/nodes (token swatches bound to Theme variables)",
    },
    tokens,
  }
  writeFileSync(SNAPSHOT, JSON.stringify(snapshot, null, 2) + "\n")
  console.log(`✓ pulled ${Object.keys(tokens).length} tokens from Figma ${data.name} → ${SNAPSHOT}`)
}

/** Compare code and Figma; returns a list of human-readable problems. */
export function diff(code, figma, tol = CONFIG.tolerance) {
  const problems = []
  for (const name of Object.keys(code))
    if (!figma[name]) problems.push(`${name}: in tokens.json but has no swatch in Figma`)
  for (const name of Object.keys(figma))
    if (!code[name]) problems.push(`${name}: in Figma but missing from tokens.json`)
  for (const name of Object.keys(code)) {
    if (!figma[name]) continue
    for (const m of MODES) {
      const a = code[name][m]
      const b = figma[name][m]
      if (!b) {
        problems.push(`${name}.${m}: no ${m} value in Figma`)
        continue
      }
      const d = dE(a.hex, b.hex)
      const alphaDelta = Math.abs((a.alpha ?? 1) - (b.alpha ?? 1))
      if (d > tol.deltaE2000)
        problems.push(`${name}.${m}: code ${a.hex} vs Figma ${b.hex} (ΔE ${d.toFixed(2)})`)
      if (alphaDelta > tol.alpha)
        problems.push(`${name}.${m}: alpha code ${a.alpha} vs Figma ${b.alpha ?? 1}`)
    }
  }
  return problems
}

function check() {
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8"))
  const problems = diff(codeTokens(), snapshot.tokens)
  if (problems.length) {
    console.error(`✗ tokens.json and Figma (snapshot ${snapshot.$source.pulledAt}) have drifted:`)
    for (const p of problems) console.error(`  - ${p}`)
    console.error(
      "  Fix: change the side that is wrong. Design changed in Figma → update tokens/tokens.json and run `pnpm tokens`.\n" +
        "  Code is right → `pnpm tokens:figma:plan` and apply it in Figma, then `pnpm tokens:figma:pull`.",
    )
    process.exit(1)
  }
  console.log(
    `✓ ${Object.keys(snapshot.tokens).length} tokens match Figma (snapshot ${snapshot.$source.pulledAt})`,
  )
}

function plan() {
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, "utf8"))
  const code = codeTokens()
  const updates = []
  for (const [name, modes] of Object.entries(code)) {
    const f = snapshot.tokens[name]
    for (const m of MODES) {
      const same =
        f?.[m] &&
        dE(modes[m].hex, f[m].hex) <= CONFIG.tolerance.deltaE2000 &&
        Math.abs(modes[m].alpha - (f[m].alpha ?? 1)) <= CONFIG.tolerance.alpha
      if (same) continue
      const c = parse(modes[m].hex)
      updates.push({
        variableId: f?.variableId ?? null,
        name,
        mode: m === "dark" ? "Dark" : "Light",
        value: { r: round(c.r), g: round(c.g), b: round(c.b), a: modes[m].alpha },
      })
    }
  }
  writeFileSync(PLAN, JSON.stringify({ collection: CONFIG.collection, updates }, null, 2) + "\n")
  console.log(`✓ ${updates.length} variable update(s) → ${PLAN}`)
}

const cmd = process.argv[2]
if (import.meta.url === `file://${process.argv[1]}`) {
  if (cmd === "pull") await pull()
  else if (cmd === "check") check()
  else if (cmd === "plan") plan()
  else {
    console.error("usage: node scripts/figma-tokens.mjs <pull|check|plan>")
    process.exit(1)
  }
}
