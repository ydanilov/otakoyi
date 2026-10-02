// Harness sensor: initial JS per route (gzip) must stay under budget.
// three.js / R3F must be lazy-loaded, never in the initial bundle.
import { readFileSync, readdirSync, statSync } from "node:fs"
import path from "node:path"
import { gzipSync } from "node:zlib"

const BUDGET_KB = Number(process.env.JS_BUDGET_KB ?? 230)
const APP = ".next/server/app"

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f)
    if (statSync(p).isDirectory()) return htmlFiles(p)
    return f.endsWith(".html") && !f.startsWith("_") ? [p] : []
  })
}

let failed = false
const rows = []
for (const file of htmlFiles(APP)) {
  const html = readFileSync(file, "utf8")
  const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((m) => m[1]))]
  let total = 0
  let hasThree = false
  for (const src of srcs) {
    const local = path.join(".next", src.replace(/^\/_next\//, ""))
    const buf = readFileSync(local)
    total += gzipSync(buf).length
    if (/WebGLRenderer|THREE\.REVISION|"three"/.test(buf.toString("utf8"))) hasThree = true
  }
  const kb = total / 1024
  const route =
    "/" +
    path
      .relative(APP, file)
      .replace(/\.html$/, "")
      .replace(/^index$/, "")
  rows.push({ route, kb: kb.toFixed(1), three: hasThree ? "✗ eager" : "lazy" })
  if (kb > BUDGET_KB || hasThree) failed = true
}
console.table(rows)
if (failed) {
  console.error(`✗ JS budget exceeded (${BUDGET_KB} KB gzip) or three.js loaded eagerly`)
  process.exit(1)
}
console.log(`✓ all routes under ${BUDGET_KB} KB gzip initial JS`)
